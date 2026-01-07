import { NextResponse } from 'next/server'
import { checkRateLimit } from '../../../lib/rate-limit'
import { getBearerToken, createSupabaseFromBearerToken, createSupabaseFromCookies } from '../../../lib/supabaseServer'
import { UserService, GenerateService } from '../../../lib/services'
import type { PlanResult, UserProfile } from '../../../lib/types'
import { generateRequestSchema } from '../../../lib/validations'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    const validatedBody = generateRequestSchema.safeParse(body)
    
    if (!validatedBody.success) {
      const firstError = validatedBody.error.issues[0]
      return NextResponse.json(
        { error: firstError?.message || 'Invalid input' },
        { status: 400 }
      )
    }
    
    const { niche, audience, platform, goal, isDemo, regenerate } = validatedBody.data

    // 2. Auth & Supabase Client (Skip for Demo Mode)
    let user: { id: string; email?: string | null } | null = null
    let supabase: ReturnType<typeof createSupabaseFromBearerToken> | null = null
    
    // Track user profile data
    let profileId: string | null = null
    let currentUsage = 0

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

      const userService = new UserService(supabase)

      // Rate Limiting
      const rateLimitResult = checkRateLimit(user.id)
      if (!rateLimitResult.success) {
        const retryAfterSeconds = Math.max(1, Math.ceil(((rateLimitResult.retryAfter ?? 0) - Date.now()) / 1000))
        return NextResponse.json(
          { error: 'Too many requests. Please try again shortly.' },
          { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
        )
      }

      // Check usage limit
      const { profile, isNew } = await userService.getOrCreateProfile(user.id)

      if (isNew) {
        profileId = profile.id
        currentUsage = 0
      } else {
        profileId = profile.id
        currentUsage = profile.plan_usage
      }

      if (currentUsage >= profile.monthly_limit) {
        return NextResponse.json(
          { error: 'Monthly limit reached. Upgrade to Pro for more.', usage: { current: currentUsage, limit: profile.monthly_limit } },
          { status: 429 }
        )
      }
    }

    // 4. AI Generation (with caching)
    if (!supabase) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const generateService = new GenerateService(supabase)

    let parsed: PlanResult

    try {
      parsed = await generateService.generateContent({
        niche,
        audience,
        platform,
        goal
      }, !isDemo, regenerate) // Use cache for non-demo requests, pass regenerate type
    } catch (e) {
      const err = e as { message?: string }
      console.error('Generation Error:', err)
      return NextResponse.json({ error: err.message || 'Failed to generate content' }, { status: 500 })
    }

    // 5. Save History & Update Usage (Only for Logged In Users)
    if (!isDemo && user && supabase && profileId) {
      try {
        await generateService.saveStrategy(user.id, { niche, audience, platform, goal }, parsed)

        const userService = new UserService(supabase)
        await userService.incrementUsage(profileId)

      } catch (dbErr) {
        console.error('History Save Exception', dbErr)
      }
    }

    return NextResponse.json(parsed)

  } catch (error) {
    console.error('Server Error', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
