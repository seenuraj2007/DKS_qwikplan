import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature') || ''

    console.log('Razorpay Webhook received:', { body, signature })

    if (!RAZORPAY_WEBHOOK_SECRET) {
      console.error('RAZORPAY_WEBHOOK_SECRET not configured')
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex')

    if (expectedSignature !== signature) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)
    const { event: eventType, payload } = event

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
      {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
      }
    )

    if (eventType === 'payment.captured' || eventType === 'payment.authorized') {
      const { payment } = payload
      const { notes } = payment.entity
      const { userId, plan } = notes

      if (!userId || !plan) {
        console.error('Missing userId or plan in notes')
        return NextResponse.json({ error: 'Invalid notes' }, { status: 400 })
      }

      const planType = plan as 'free' | 'pro' | 'enterprise'
      const monthlyLimit = planType === 'pro' ? 500 : 50

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          plan_type: planType,
          monthly_limit: monthlyLimit
        })
        .eq('user_id', userId)

      if (profileError) {
        console.error('Error updating profile:', profileError)
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
      }

      console.log(`Updated user ${userId} to ${planType} plan`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
