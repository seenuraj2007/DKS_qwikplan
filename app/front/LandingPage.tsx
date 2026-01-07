'use client'
import {
  Download,
  History,
  Flame,
  BarChart3,
} from 'lucide-react'
import TrustSection from './Trust'
import DemoSection from './Demosection'
import Navbar from './navbar'
import Hero from './hero'
import Use from './use'
import Footer from './Footer'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'





// --- Main Landing Page Component ---
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans selection:bg-emerald-200 selection:text-emerald-900 overflow-x-hidden">
<Navbar />
<Hero />



       <TrustSection />
<Use />
      
      {/* Features */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Everything you need</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Powerful features to help you generate, track, and export marketing strategies.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 group">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Download className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">CSV Export</h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Download your generated strategy as CSV. Perfect for records, clients, or further analysis in your favorite tools.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-teal-100 hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300 group">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <History className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Strategy History</h3>
            <p className="text-slate-600 text-base leading-relaxed">
              View all your past generations organized by date. Search, review, and reuse your best strategies anytime.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-amber-100 hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-300 group">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Flame className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Streak Tracking</h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Stay consistent with your content creation. Track daily streaks and beat your personal best.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300 group">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Usage Tracking</h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Monitor your monthly credit usage. See how much you've used and your remaining limit at a glance.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-purple-100 hover:shadow-xl hover:shadow-purple-900/5 transition-all duration-300 group">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <History className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Multiple Platforms</h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Generate for Instagram, LinkedIn, YouTube, Twitter, or Facebook. Optimized content for each platform.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-rose-100 hover:shadow-xl hover:shadow-rose-900/5 transition-all duration-300 group">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-rose-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Download className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Account Settings</h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Manage your password, view account details, or delete your data. Full control over your account.
            </p>
          </div>
        </div>
      </section>

      <DemoSection />

<Footer />
    </div>
  )
}