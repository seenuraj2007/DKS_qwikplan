// app/api/demo-generate/route.ts
import { NextResponse } from 'next/server'
import { Groq } from 'groq-sdk'

interface DemoRequestBody {
  niche?: unknown
  audience?: unknown
  platform?: unknown
  goal?: unknown
}

export async function POST(req: Request) {
  try {
    let body: DemoRequestBody | undefined
    try {
      body = await req.json() as DemoRequestBody
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const niche = typeof body?.niche === 'string' ? body.niche.trim() : ''
    const audience = typeof body?.audience === 'string' ? body.audience.trim() : ''
    const platform = typeof body?.platform === 'string' ? body.platform.trim() : ''
    const goal = typeof body?.goal === 'string' ? body.goal.trim() : ''

    if (!niche || !platform || !goal) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 })
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const systemPrompt = "You are a strict JSON API for social media strategy. Your output must be valid, parsable JSON. You do not converse; you only return data."

    const userPrompt = `
  INPUT DATA:
  - Niche: ${niche}
  - Target Audience: ${audience || 'General public'} 
  - Platform: ${platform}
  - Goal: ${goal}

  INSTRUCTIONS:
  Analyze the input and generate a 7-day plan.
  
  CRITICAL SCHEMA RULES:
  1. "strategy": MUST be a STRING (text). Do NOT use an object. Do NOT create sub-keys like "pillar" or "trigger". Instead, write a paragraph like: "Strategy: Focus on [Pillar Name] using [Trigger Name] to..."
  2. "schedule": MUST be an ARRAY of STRINGS. Example: ["Day 1: Post X", "Day 2: Post Y"].
  3. "proTip": MUST be a STRING.
  4. "bestPostTime": MUST be a STRING. Format: "Day Range: Time".
  5. "hashtags": MUST be a STRING.

  GENERATION DETAILS:
  - Strategy: Identify one specific 'Content Pillar' (e.g., Education, Entertainment) and one 'Psychological Trigger' (e.g., Social Proof, Scarcity). Explain them in the text.
  - Schedule: Make actions specific to ${platform} (e.g., 'Reel' for Instagram, 'Thread' for Twitter).
  - Hashtags: Mix high-volume and niche tags.

  RETURN ONLY RAW JSON. NO MARKDOWN. NO CODE BLOCKS.
  
  EXACT JSON STRUCTURE TO FOLLOW:
  {
    "strategy": "This week focuses on the [PILLAR] pillar, utilizing [TRIGGER] to engage ${audience || 'the audience'}.",
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

    const content = chatCompletion.choices[0]?.message?.content || '{}'

    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(content)

      if (!Array.isArray(parsed.schedule)) {
        parsed.schedule = []
      }

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

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Server Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
