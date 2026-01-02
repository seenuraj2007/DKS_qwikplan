import { NextResponse } from 'next/server'
import { Groq } from 'groq-sdk'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { checkRateLimit } from '../../../lib/rate-limit'

interface GenerateRequestBody {
  niche?: unknown
  audience?: unknown
  platform?: unknown
  goal?: unknown
  isDemo?: boolean
}

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
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
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
        async get(name: string) {
          return (await cookieStore).get(name)?.value
        },
        async set(name: string, value: string, options: Record<string, unknown>) {
          ;(await cookieStore).set({ name, value, ...options })
        },
        async remove(name: string, options: Record<string, unknown>) {
          ;(await cookieStore).set({ name, value: '', ...options })
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

      const {
        data: { user: userData },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !userData) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      user = userData

      // Rate Limiting (Skip for Demo)
      const rateLimitResult = checkRateLimit(user.id)
      if (!rateLimitResult.success) {
        const retryAfterSeconds = Math.max(
          1,
          Math.ceil(((rateLimitResult.retryAfter ?? 0) - Date.now()) / 1000)
        )
        return NextResponse.json(
          { error: 'Too many requests. Please try again shortly.' },
          {
            status: 429,
            headers: {
              'Retry-After': String(retryAfterSeconds),
            },
          }
        )
      }
    }

    // 3. Usage & Limit Checking (Skip for Demo)
    let currentUsage = 0
    let limit = 50
    let profileId: string | null = null

    if (!isDemo) {
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
        // Create profile if missing
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: user.id,
              plan_usage: 0,
              monthly_limit: 50,
            },
          ])
          .select('id, plan_usage, monthly_limit')
          .single()

        if (insertError) {
          return NextResponse.json(
            { error: 'Failed to create user profile' },
            { status: 500 }
          )
        }
        profileId = newProfile?.id ?? null
        currentUsage = newProfile?.plan_usage ?? 0
        limit = newProfile?.monthly_limit ?? 50
      }

      if (currentUsage >= limit) {
        return NextResponse.json(
          {
            error: 'Monthly limit reached. Upgrade to Pro for more.',
            usage: { current: currentUsage, limit },
          },
          { status: 429 }
        )
      }
    }

    // 4. AI Generation
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 })
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    // Logic: 2 days for demo, 7 days for logged-in users
    const daysToGenerate = isDemo ? 2 : 7

    const systemPrompt = "You are a strict JSON API for social media strategy. Your output must be valid, parsable JSON. You do not converse; you only return data.";

    const userPrompt = `
  INPUT DATA:
  - Niche: ${niche}
  - Target Audience: ${audience || 'General public'} 
  - Platform: ${platform}
  - Goal: ${goal}

  INSTRUCTIONS:
  Analyze the input and generate a ${daysToGenerate}-day plan.
  
  CRITICAL SCHEMA RULES:
  1. "strategy": MUST be a STRING (text). Explain chosen Content Pillar and Psychological Trigger.
  2. "schedule": MUST be an ARRAY of STRINGS. 
     - IMPORTANT: The array MUST contain exactly ${daysToGenerate} items.
     - Format: "Day X: [Verb] [Topic]".
     - Do NOT output objects or empty strings. Just the array of strings.
  3. "proTip": MUST be a STRING (Platform specific hack).
  4. "bestPostTime": MUST be a STRING. Format: "Days: Time".
  5. "hashtags": MUST be a STRING (10-15 tags).

  GENERATION DETAILS:
  - Strategy: Focus on specific content pillars for ${niche}.
  - Schedule: Make actions specific to ${platform} (e.g., 'Reel' for Instagram, 'Thread' for Twitter).
  - Hashtags: Mix high-volume and niche tags.

  RETURN ONLY RAW JSON. NO MARKDOWN. NO CODE BLOCKS.
  
  EXACT JSON STRUCTURE TO FOLLOW:
  {
    "strategy": "This week focuses on the [PILLAR] pillar...",
    "schedule": [ 
      "Day 1: [Verb] [Specific Topic for ${niche}]",
      "Day 2: [Verb] [Specific Topic]",
      "Day 3: [Verb] [Specific Topic]",
      "Day 4: [Verb] [Specific Topic]",
      "Day 5: [Verb] [Specific Topic]",
      "Day 6: [Verb] [Specific Topic]",
      "Day 7: [Verb] [Specific Topic]"
    ],
    "proTip": "[Specific hack for ${platform}]",
    "bestPostTime": "[Days]: [Time]",
    "hashtags": "#tag1 #tag2 #tag3"
  }
`

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 1,
      stream: false,
      response_format: { type: 'json_object' },
    })
    
    // Safety Check for Groq Free Tier limits
    if (!chatCompletion) {
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 })
    }

    const content = chatCompletion.choices[0]?.message?.content || '{}'

    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(content)

      if (!Array.isArray(parsed.schedule)) {
        parsed.schedule = []
      }

      // Normalize schedule items to strings
      parsed.schedule = (parsed.schedule as string[]).map((item) => {
        if (typeof item === 'object' && item !== null) {
          if ('day' in item && 'task' in item) {
            return `${(item as { day: string }).day}: ${(item as { task: string }).task}`
          }
          return JSON.stringify(item)
        }
        return String(item)
      })
    } catch (e) {
      console.error('JSON Parse Error:', e)
      return NextResponse.json({ error: 'Invalid AI Response' }, { status: 500 })
    }

    // 5. FEATURE: Save History to Database (Only for Logged In Users)
    if (!isDemo && user) {
      try {
        const { error: insertError } = await supabase.from('strategies').insert({
          user_id: user.id,
          niche: niche,
          platform: platform,
          goal: goal,
          strategy_text: parsed.strategy as string,
          schedule: parsed.schedule,
          hashtags: parsed.hashtags,
        })
        if (insertError) console.error("History Save Error:", insertError)
      } catch (dbErr) {
        console.error("History Save Exception:", dbErr)
      }
    }

    // 6. Update Usage (Only for Logged In Users)
    if (!isDemo && profileId) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ plan_usage: currentUsage + 1 })
        .eq('id', profileId)

      if (updateError) {
        console.error('Update Error:', updateError)
      }
    }

    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error('Server Error:', error)
    
    // Handle Groq Rate Limits specifically
    if (error?.status === 429) {
        return NextResponse.json(
          { error: 'AI service is busy. Please try again in 10 seconds.' },
          { status: 429 }
        )
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}