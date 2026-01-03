'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowRight,
  Zap,
  BarChart,
  Rocket,
  Github,
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  Sparkles,
  Loader2,
  XCircle,
  FileSpreadsheet,
  MessageSquare,
  Database,
  Shield,
  Globe,
  X,
  CreditCard,
  Infinity,
  Layers
} from 'lucide-react'
import TrustSection from './Trust'
import PricingSection from './Pricing'
import DemoSection from './Demosection'
import Navbar from './navbar'
import Hero from './hero'
import Use from './use'
import Footer from './Footer'





// --- Main Landing Page Component ---
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans selection:bg-emerald-200 selection:text-emerald-900 overflow-x-hidden">
<Navbar />
<Hero />



      <TrustSection />
<Use />

      {/* Pricing Section Added Here */}
      <PricingSection id="pricing" />

      {/* Features */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Everything you need to scale</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Every feature is picked for one outcome: help you deliver client strategies faster, without extra tools.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 group">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">CSV Export</h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Download a clean 7-day schedule as CSV and plug it into Google Sheets, Notion, or Buffer in one click.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-teal-100 hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300 group">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Context</h3>
            <p className="text-slate-600 text-base leading-relaxed">
              Different prompt logic for SaaS, local businesses, creators, and more—so the plan “sounds right”.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300 group">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Database className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Asset Library</h3>
            <p className="text-slate-600 text-base leading-relaxed">
              See previous generations and track how many strategies you’ve created per client each month.
            </p>
          </div>
        </div>
      </section>

      <DemoSection />

<Footer />
    </div>
  )
}