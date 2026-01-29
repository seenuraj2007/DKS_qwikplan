'use client'

import { CheckCircle2, Zap, Crown, Shield, Sparkles, ArrowRight, Loader2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from '../../lib/supabaseClient'

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: 'pro') => {
    try {
      setLoading(plan)

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push(`/auth?redirect=/pricing&plan=${plan}`)
        return
      }

      const userId = user.id

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          plan
        })
      })

      if (!res.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { checkoutUrl } = await res.json()

      if (checkoutUrl) {
        window.location.href = checkoutUrl
      }

    } catch (error) {
      console.error('Subscription error:', error)
      alert('Failed to initiate subscription. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="text-slate-900">DKS QwikPlan</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4 inline-block border border-emerald-100">
              Pricing
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-slate-600">
              Start for free. Upgrade when you need more features and credits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-50">
                <Zap className="w-16 h-16 text-slate-100" />
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Starter</h2>
                <p className="text-slate-500 text-sm">Perfect for trying out QwikPlan</p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-bold text-slate-900">$0</span>
                <span className="text-slate-500 text-lg">/month</span>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>50 generations per month</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Basic AI model (Llama 3.1)</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>CSV export</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Strategy history</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>Streak tracking</span>
                </li>
              </ul>

              <Link
                href="/dashboard"
                className="w-full py-4 px-6 rounded-xl border-2 border-slate-200 font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all text-center flex items-center justify-center gap-2"
              >
                Get Started Free
              </Link>
            </div>

            <div className="flex flex-col p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Crown className="w-16 h-16 text-emerald-400" />
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-600/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Pro</h2>
                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider">
                    Popular
                  </span>
                </div>

                <p className="text-slate-400 text-sm mb-8">For serious creators and agencies</p>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-bold text-white">$5</span>
                  <span className="text-slate-400 text-lg">/month</span>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span><strong className="text-white">500 generations</strong> per month</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span><strong className="text-white">Advanced AI models</strong> (GPT-4, Claude)</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span><strong className="text-white">Priority support</strong></span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span><strong className="text-white">CSV export</strong></span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span><strong className="text-white">Strategy history</strong> with search</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span><strong className="text-white">Streak tracking</strong> + leaderboards</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span><strong className="text-white">Early access</strong> to new features</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span><strong className="text-white">No watermark</strong> on exports</span>
                  </li>
                </ul>

                <button
                  onClick={() => handleSubscribe('pro')}
                  disabled={loading === 'pro'}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-white hover:from-emerald-400 hover:to-teal-400 shadow-xl shadow-emerald-900/50 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading === 'pro' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Upgrade to Pro
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center gap-2 justify-center">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-slate-400">Powered by Razorpay · Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="max-w-3xl mx-auto bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Frequently Asked Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Can I cancel anytime?</h4>
                  <p className="text-slate-600 text-sm">Yes, you can cancel your subscription at any time from your dashboard settings.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">What happens if I run out of credits?</h4>
                  <p className="text-slate-600 text-sm">You can upgrade to Pro or wait for your credits to reset at the start of the next month.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Do unused credits roll over?</h4>
                  <p className="text-slate-600 text-sm">No, credits reset at the start of each billing cycle.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">What payment methods are accepted?</h4>
                  <p className="text-slate-600 text-sm">We accept all major credit cards and debit cards through our secure payment processor.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
