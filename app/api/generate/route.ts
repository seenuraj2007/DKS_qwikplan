import { NextResponse } from 'next/server'
import { Groq } from 'groq-sdk'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { checkRateLimit } from '../../../lib/rate-limit'

// Define the response body interface
interface GenerateRequestBody {
  niche?: unknown
  audience?: unknown
  platform?: unknown
  goal?: unknown
  isDemo?: boolean
}

// --- Helper Functions (Auth & Database) ---
function getBearerToken(req: Request): string | null {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return null
  const match = authHeader.match(/^Bearer\s+(.+)$/i)
  return match?.[1] ?? null
}

function createSupabaseFromBearerToken(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    }
  )
}

async function createSupabaseFromCookies() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        async get(name: string) { return (await cookieStore).get(name)?.value },
        async set(name: string, value: string, options: Record<string, unknown>) {
          ; (await cookieStore).set({ name, value, ...options })
        },
        async remove(name: string, options: Record<string, unknown>) {
          ; (await cookieStore).set({ name, value: '', ...options })
        },
      },
    }
  )
}

export async function POST(req: Request) {
  try {
    // 1. Parse Body
    let body: GenerateRequestBody | undefined
    try {
      body = await req.json() as GenerateRequestBody
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const niche = typeof body?.niche === 'string' ? body.niche.trim() : ''
    const audience = typeof body?.audience === 'string' ? body.audience.trim() : ''
    const platform = typeof body?.platform === 'string' ? body.platform.trim() : ''
    const goal = typeof body?.goal === 'string' ? body.goal.trim() : ''
    const isDemo = body?.isDemo === true

    if (!niche || !platform || !goal) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // 2. Auth & Supabase Client (Skip for Demo Mode)
    let user: any = null
    let supabase: any = null

    if (!isDemo) {
      const bearerToken = getBearerToken(req)
      supabase = bearerToken
        ? createSupabaseFromBearerToken(bearerToken)
        : await createSupabaseFromCookies()

      const { data: { user: userData }, error: userError } = await supabase.auth.getUser()
      if (userError || !userData) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      user = userData

      // Rate Limiting
      const rateLimitResult = checkRateLimit(user.id)
      if (!rateLimitResult.success) {
        const retryAfterSeconds = Math.max(1, Math.ceil(((rateLimitResult.retryAfter ?? 0) - Date.now()) / 1000))
        return NextResponse.json(
          { error: 'Too many requests. Please try again shortly.' },
          { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
        )
      }

      // 3. Usage Limit Checking
      let currentUsage = 0
      let limit = 50
      let profileId: string | null = null

      const { data: profiles, error: fetchError } = await supabase
        .from('profiles')
        .select('id, plan_usage, monthly_limit')
        .eq('user_id', user.id)

      if (fetchError) {
        console.error('Fetch Error:', fetchError)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
      }

      if (profiles && profiles.length > 0) {
        const profile = profiles[0]
        profileId = profile.id
        currentUsage = profile.plan_usage || 0
        limit = profile.monthly_limit || 50
      } else {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ user_id: user.id, plan_usage: 0, monthly_limit: 50 }])
          .select('id, plan_usage, monthly_limit')
          .single()

        if (insertError) return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
        profileId = newProfile?.id ?? null
        currentUsage = newProfile?.plan_usage ?? 0
        limit = newProfile?.monthly_limit ?? 50
      }

      if (currentUsage >= limit) {
        return NextResponse.json(
          { error: 'Monthly limit reached. Upgrade to Pro for more.', usage: { current: currentUsage, limit } },
          { status: 429 }
        )
      }

      // Pass profileId to be used later
      (req as any).profileId = profileId;
      (req as any).currentUsage = currentUsage;
    }

    // 4. AI Generation
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 })
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    // FIXED: System prompt now contains "JSON" for Groq JSON mode
    const systemPrompt = `
You are an expert viral content creator and copywriter. Your ONLY job is to return STRICT JSON.

Generate ONE high-converting post for:
- Niche: ${niche}
- Audience: ${audience || 'general public'}
- Platform: ${platform}
- Goal: ${goal}

RULES:
- For VIDEO platforms (Reels, TikTok, YouTube): Return full script with [SCENE] and "SPOKEN" format
- For TEXT platforms (Twitter, LinkedIn, Facebook): Return ready-to-post text
- Return ONLY valid JSON - NO other text
- Make it specific, engaging, and conversion-focused

REQUIRED JSON FORMAT (do not change structure):
{
  "strategy": "Why this angle converts for this niche/goal",
  "hook": "First 3-second attention grabber",
  "script": "FULL main content. Video: [Scene] \"Spoken\". Text: complete post body",
  "caption": "Caption text (empty string if not needed)",
  "cta": "Exact call-to-action phrase",
  "hashtags": "10-15 hashtags separated by spaces",
  "proTip": "One platform-specific optimization tip",
  "bestPostTime": "Day + time range (e.g. Fri 6-8PM)"
}
    `

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Create the best ${platform} post for my ${niche} business targeting ${audience || 'general audience'} with goal ${goal}.` }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      stream: false,
      response_format: { type: 'json_object' },
    })

    if (!chatCompletion.choices?.[0]?.message?.content) {
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 })
    }

    const content = chatCompletion.choices[0].message.content
    let parsed: any

    try {
      parsed = JSON.parse(content)
      
      // Ensure all required fields exist (fallback if AI misses something)
      parsed.strategy = parsed.strategy || "Targeted content optimized for your goal"
      parsed.hook = parsed.hook || "Attention-grabbing opener"
      parsed.script = parsed.script || "Full content goes here"
      parsed.caption = parsed.caption || ""
      parsed.cta = parsed.cta || "Take action now"
      parsed.hashtags = parsed.hashtags || ""
      parsed.proTip = parsed.proTip || "Post during peak hours"
      parsed.bestPostTime = parsed.bestPostTime || "Weekdays 6-8PM"
      
    } catch (e) {
      console.error('JSON Parse Error:', e, 'Raw content:', content)
      return NextResponse.json({ error: 'Invalid AI Response - try again' }, { status: 500 })
    }

    // 5. Save History & Update Usage (Only for Logged In Users)
    if (!isDemo && user) {
      const profileId = (req as any).profileId
      const currentUsage = (req as any).currentUsage

      try {
        // We store the "script" object in the 'schedule' column (assuming it's a flexible JSON column)
        // or we just store the main text. To keep it compatible with the DB schema, we'll store the whole object.
        const { error: insertError } = await supabase.from('strategies').insert({
          user_id: user.id,
          niche,
          platform,
          goal,
          strategy_text: parsed.strategy,
          schedule: [JSON.stringify(parsed)], // Store as an array of 1 string to fit existing schema if needed, or just the JSON
          hashtags: parsed.hashtags,
        })

        if (insertError) console.error('History Save Error', insertError)

        const { error: updateError } = await supabase
          .from('profiles')
          .update({ plan_usage: currentUsage + 1 })
          .eq('id', profileId)

        if (updateError) console.error('Update Er`ror', updateError)

      } catch (dbErr) {
        console.error('History Save Exception', dbErr)
      }
    }

    return NextResponse.json(parsed)

  } catch (error: any) {
    console.error('Server Error', error)
    if (error?.status === 429) {
      return NextResponse.json({ error: 'AI service is busy. Please try again in 10 seconds.' }, { status: 429 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
