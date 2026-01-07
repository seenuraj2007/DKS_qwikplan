import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getBearerToken, createSupabaseFromBearerToken, createSupabaseFromCookies } from '../../../lib/supabaseServer'
import { feedbackRequestSchema } from '../../../lib/validations'

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    const validatedBody = feedbackRequestSchema.safeParse(body)
    
    if (!validatedBody.success) {
      const firstError = validatedBody.error.issues[0]
      return NextResponse.json(
        { error: firstError?.message || 'Invalid input' },
        { status: 400 }
      )
    }
    
    const { feedbackText, niche, platform, rating } = validatedBody.data

    // 1. Auth
    const bearerToken = getBearerToken(req)
    const supabase = bearerToken
      ? createSupabaseFromBearerToken(bearerToken)
      : await createSupabaseFromCookies()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Insert into Database
    // We let DB handle created_at, but we pass rating if available
    const { error: insertError } = await supabase.from('feedback').insert({
      user_id: user.id,
      user_email: user.email || null,
      rating: rating || null,
      feedback_text: feedbackText,
      niche_context: niche,
      platform: platform,
    })

    if (insertError) {
      console.error('Feedback insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      )
    }

    // 3. Send Email (Resend)
    const resendApiKey = process.env.RESEND_API_KEY
    const toListRaw =
      process.env.FEEDBACK_TO_EMAILS ||
      process.env.FEEDBACK_NOTIFICATION_EMAIL ||
      process.env.FEEDBACK_TO_EMAIL

    // Fallback: If no env var, send to yourself or default admin
    const to = toListRaw
      ? toListRaw.split(',').map((e) => e.trim()).filter(Boolean)
      : []

    if (resendApiKey && to.length > 0) {
      const resend = new Resend(resendApiKey)
      const from = process.env.RESEND_FROM || 'DKS QwikPlan <noreply@yourdomain.com>'

      const safeFeedbackText = escapeHtml(feedbackText)
      const safeNiche = niche ? escapeHtml(niche) : 'Not specified'
      const safePlatform = platform ? escapeHtml(platform) : 'Not specified'
      const safeUserEmail = user.email ? escapeHtml(user.email) : 'Not provided'

      try {
        const { error } = await resend.emails.send({
          from,
          to,
          subject: `New Feedback: ${niche || 'Unknown Niche'}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333;">New Feedback Received</h2>
              <p><strong>User ID:</strong> ${user.id}</p>
              <p><strong>Email:</strong> ${safeUserEmail}</p>
              <p><strong>Niche:</strong> ${safeNiche}</p>
              <p><strong>Platform:</strong> ${safePlatform}</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <p><strong style="color: #333;">Feedback:</strong></p>
              <p style="background: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap; color: #555;">${safeFeedbackText}</p>
            </div>
          `,
          text: `New feedback received\n\nUser: ${user.id} (${user.email || 'no email'})\nNiche: ${niche || 'Not specified'}\nPlatform: ${platform || 'Not specified'}\n\nFeedback:\n${feedbackText}`,
        })

        if (error) {
          console.error('Resend send error:', error)
          // Note: We don't fail the request if email fails, just log it
        }
      } catch (emailError) {
        console.error('Resend send exception:', emailError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}