import { SupabaseClient } from '@supabase/supabase-js'
import { Groq } from 'groq-sdk'
import type { PlanResult, Strategy } from '../types'
import { cacheManager, CACHE_CONFIG } from '../cache'

export interface GenerateInput {
  niche: string
  audience?: string
  platform: string
  goal: string
}

export class GenerateService {
  private groq: Groq | null = null

  constructor(private supabase: SupabaseClient) {
    if (process.env.GROQ_API_KEY) {
      this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    }
  }

  private async generateContentUncached(input: GenerateInput, regenerateType?: string): Promise<PlanResult> {
    if (!this.groq) {
      throw new Error('AI service not configured')
    }

    let systemPrompt = ''

    if (regenerateType === 'hook') {
      systemPrompt = `
You are an expert viral content creator specializing in hooks. Your ONLY job is to return STRICT JSON with a NEW, DIFFERENT hook.

Create a NEW attention-grabbing hook for:
- Niche: ${input.niche}
- Audience: ${input.audience || 'general public'}
- Platform: ${input.platform}
- Goal: ${input.goal}

RULES:
- Make it DIFFERENT from the previous one
- Focus on different psychological trigger (urgency, curiosity, social proof, etc.)
- Keep it under 3 seconds when spoken
- Make it stop the scroll

REQUIRED JSON FORMAT:
{
  "hook": "A completely NEW attention-grabbing hook (different angle)"
}
      `
    } else if (regenerateType === 'script') {
      systemPrompt = `
You are an expert viral content creator specializing in main content. Your ONLY job is to return STRICT JSON with a NEW script.

Create a NEW engaging main content for:
- Niche: ${input.niche}
- Audience: ${input.audience || 'general public'}
- Platform: ${input.platform}
- Goal: ${input.goal}

RULES:
- Make it DIFFERENT from previous version
- New angle, new examples, new value propositions
- For VIDEO: Return full script with [SCENE] and "SPOKEN" format
- For TEXT: Return ready-to-post content
- Keep it engaging and conversion-focused

REQUIRED JSON FORMAT:
{
  "script": "A completely NEW main content script"
}
      `
    } else {
      // Full regeneration or new angle
      systemPrompt = `
You are an expert viral content creator and copywriter. Your ONLY job is to return STRICT JSON.

Generate ONE high-converting post for:
- Niche: ${input.niche}
- Audience: ${input.audience || 'general public'}
- Platform: ${input.platform}
- Goal: ${input.goal}

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
    }

    const chatCompletion = await this.groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Create the best ${input.platform} post for my ${input.niche} business targeting ${input.audience || 'general audience'} with goal ${input.goal}.`
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      stream: false,
      response_format: { type: 'json_object' },
    })

    if (!chatCompletion.choices?.[0]?.message?.content) {
      throw new Error('AI service unavailable')
    }

    const content = chatCompletion.choices[0].message.content
    let parsed: Partial<PlanResult>

    try {
      parsed = JSON.parse(content) as Partial<PlanResult>

      parsed.strategy = parsed.strategy || "Targeted content optimized for your goal"
      parsed.hook = parsed.hook || "Attention-grabbing opener"
      parsed.script = parsed.script || "Full content goes here"
      parsed.caption = parsed.caption || ""
      parsed.cta = parsed.cta || "Take action now"
      parsed.hashtags = parsed.hashtags || ""
      parsed.proTip = parsed.proTip || "Post during peak hours"
      parsed.bestPostTime = parsed.bestPostTime || "Weekdays 6-8PM"

      return parsed as PlanResult

    } catch (e) {
      console.error('JSON Parse Error:', e, 'Raw content:', content)
      throw new Error('Invalid AI Response - try again')
    }
  }

  private getCacheKey(input: GenerateInput): string {
    return cacheManager.generateCacheKey('ai_response', {
      niche: input.niche.toLowerCase().trim(),
      audience: (input.audience || 'general').toLowerCase().trim(),
      platform: input.platform.toLowerCase(),
      goal: input.goal.toLowerCase()
    })
  }

  async generateContent(input: GenerateInput, useCache: boolean = true, regenerateType?: string): Promise<PlanResult> {
    if (!useCache) {
      return this.generateContentUncached(input, regenerateType)
    }

    const cacheKey = this.getCacheKey(input)
    const cached = cacheManager.get<PlanResult>(cacheKey)

    if (cached && !regenerateType) {
      return cached
    }

    const result = await this.generateContentUncached(input, regenerateType)
    if (!regenerateType) {
      cacheManager.set(cacheKey, result, CACHE_CONFIG.AI_RESPONSE_TTL)
    }
    return result
  }

  async saveStrategy(
    userId: string,
    input: GenerateInput,
    result: PlanResult
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.from('strategies').insert({
        user_id: userId,
        niche: input.niche,
        platform: input.platform,
        goal: input.goal,
        strategy_text: result.strategy,
        schedule: [JSON.stringify(result)],
        hashtags: result.hashtags,
      })

      if (error) {
        console.error('Error saving strategy:', error)
        return { success: false, error: error.message }
      }

      this.invalidateUserStrategiesCache(userId)
      return { success: true }
    } catch (e) {
      console.error('Exception saving strategy:', e)
      return { success: false, error: 'Failed to save strategy' }
    }
  }

  private invalidateUserStrategiesCache(userId: string): void {
    cacheManager.clearByPrefix('user_strategies')
  }

  async getUserStrategies(
    userId: string,
    limit: number = 50,
    offset: number = 0,
    useCache: boolean = true
  ): Promise<{ strategies: Strategy[]; error?: string }> {
    const cacheKey = cacheManager.generateCacheKey('user_strategies', { userId, limit, offset })

    if (useCache) {
      const cached = cacheManager.get<{ strategies: Strategy[]; error?: string }>(cacheKey)
      if (cached) {
        return cached
      }
    }

    const { data, error } = await this.supabase
      .from('strategies')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching user strategies:', error)
      return { strategies: [], error: error.message }
    }

    const result = { strategies: data as Strategy[] }

    if (useCache) {
      cacheManager.set(cacheKey, result, CACHE_CONFIG.STRATEGY_TTL)
    }

    return result
  }

  async deleteStrategy(strategyId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase
      .from('strategies')
      .delete()
      .eq('id', strategyId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting strategy:', error)
      return { success: false, error: error.message }
    }

    this.invalidateUserStrategiesCache(userId)
    return { success: true }
  }

  async getStrategyById(strategyId: string, userId: string): Promise<Strategy | null> {
    const { data, error } = await this.supabase
      .from('strategies')
      .select('*')
      .eq('id', strategyId)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching strategy:', error)
      return null
    }

    return data as Strategy
  }

  clearAICache(): void {
    cacheManager.clearByPrefix('ai_response')
  }

  clearAllCache(): void {
    cacheManager.clearByPrefix('ai_response')
    cacheManager.clearByPrefix('user_strategies')
  }
}
