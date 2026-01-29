import { NextResponse } from 'next/server'
import { createSupabaseFromBearerToken, createSupabaseFromCookies, getBearerToken } from '../../../lib/supabaseServer'
import Razorpay from 'razorpay'

const PRICES = {
  pro: 500 // ₹5.00 in paise (500 paise = ₹5.00)
} as const

function getRazorpayInstance() {
  const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
  const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return null
  }

  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, plan } = body

    if (!userId || !plan) {
      return NextResponse.json(
        { error: 'Missing userId or plan' },
        { status: 400 }
      )
    }

    const razorpay = getRazorpayInstance()
    if (!razorpay) {
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      )
    }

    if (!(plan in PRICES)) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      )
    }

    const bearerToken = getBearerToken(req)
    const supabase = bearerToken
      ? createSupabaseFromBearerToken(bearerToken)
      : await createSupabaseFromCookies()

    const { data: { user: userData }, error: userError } = await supabase.auth.getUser()
    if (userError || !userData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (userData.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const priceInPaise = PRICES[plan as keyof typeof PRICES]

    const options = {
      amount: priceInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId,
        plan,
        customerEmail: userData.email
      }
    }

    const order = await razorpay.orders.create(options as any)

    if (!order) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    const { RAZORPAY_KEY_ID } = process.env

    return NextResponse.json({
      orderId: (order as any).id,
      amount: (order as any).amount,
      currency: (order as any).currency,
      key: RAZORPAY_KEY_ID
    })

  } catch (error) {
    console.error('Razorpay order creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
