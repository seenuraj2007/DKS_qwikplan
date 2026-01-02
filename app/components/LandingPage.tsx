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
  X
} from 'lucide-react'

// --- Trust Section (real + honest) ---
const TrustSection = () => {
  return (
    <section className="py-10 border-y border-slate-100 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Built for freelancers & solo founders
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-white border border-slate-100 flex flex-col items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <span className="text-lg font-bold text-slate-900">For Clients</span>
            <span className="text-xs text-slate-500">Designed around client work, not just solo content</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-100 flex flex-col items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-teal-600" />
            <span className="text-lg font-bold text-slate-900">CSV First</span>
            <span className="text-xs text-slate-500">Export schedules into Sheets, Notion, or Buffer</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-100 flex flex-col items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-600" />
            <span className="text-lg font-bold text-slate-900">Open Source</span>
            <span className="text-xs text-slate-500">Full code on GitHub • No vendor lock-in</span>
          </div>

        </div>
      </div>
    </section>
  )
}

// --- Interactive Demo (unchanged logic, small copy tweaks) ---
const DemoSection = () => {
  const [selectedNiche, setSelectedNiche] = useState('Sustainable Fashion')
  const [selectedPlatform, setSelectedPlatform] = useState('Instagram')
  const [generatedStrategy, setGeneratedStrategy] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [demoError, setDemoError] = useState('')

  const demoNiches = ['Sustainable Fashion', 'Tech SaaS', 'Food Blogging', 'Fitness Coaching']
  const demoPlatforms = ['Instagram', 'LinkedIn', 'YouTube', 'Twitter']

  const handleDemoGenerate = async () => {
    setIsGenerating(true)
    setDemoError('')
    setGeneratedStrategy(null)

    await new Promise(r => setTimeout(r, 800))

    try {
      const res = await fetch('/api/demo-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: selectedNiche,
          platform: selectedPlatform,
          goal: 'Increase engagement and brand awareness',
        }),
      })

      if (!res.ok) throw new Error('API Error')

      const data = await res.json()
      if (data.schedule) data.schedule = data.schedule.slice(0, 2)
      setGeneratedStrategy(data)
    } catch (error) {
      console.error(error)
      setDemoError('Live demo is at limit right now. Showing a realistic sample instead.')
      setGeneratedStrategy({
        strategy: `Focus on educational "behind-the-scenes" content about ${selectedNiche} to build authority on ${selectedPlatform}.`,
        schedule: [
          `Day 1: "Top 5 Mistakes in ${selectedNiche}" (Carousel)`,
          `Day 2: Customer Success Story (Video/Reel)`
        ],
        proTip: 'Engage with comments within the first 15 minutes of posting.',
        bestPostTime: 'Weekdays: 10:00 AM - 2:00 PM',
        hashtags: `#${selectedNiche.replace(/\s+/g, '')} #Growth #Marketing`
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section id="demo" className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 md:translate-x-0 md:left-1/4 w-64 md:w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 md:translate-x-0 md:right-1/4 w-64 md:w-96 h-96 bg-teal-600/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 md:mb-12">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs sm:text-sm font-semibold border border-emerald-500/20 mb-4 inline-block">
            Interactive Demo
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4">See execution, not just ideas</h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed px-2 sm:px-0">
            No signup. Pick a niche and platform, and watch it turn into a real, structured plan.
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 md:mb-8">
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-slate-300">1. Pick a Niche</label>
              <div className="relative">
                <select
                  value={selectedNiche}
                  onChange={(e) => setSelectedNiche(e.target.value)}
                  className="w-full px-3 sm:px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none appearance-none cursor-pointer hover:border-slate-500 transition-colors"
                >
                  {demoNiches.map(niche => <option key={niche} value={niche}>{niche}</option>)}
                </select>
                {/* Custom Arrow - adjusted padding for mobile */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute right-3 sm:right-4 top-3.5 text-slate-400 pointer-events-none w-5 h-5"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-slate-300">2. Pick a Platform</label>
              <div className="relative">
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full px-3 sm:px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none appearance-none cursor-pointer hover:border-slate-500 transition-colors"
                >
                  {demoPlatforms.map(platform => <option key={platform} value={platform}>{platform}</option>)}
                </select>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute right-3 sm:right-4 top-3.5 text-slate-400 pointer-events-none w-5 h-5"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>

          <button
            onClick={handleDemoGenerate}
            disabled={isGenerating}
            className="w-full h-12 sm:h-14 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all transform hover:scale-[1.01] shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base sm:text-lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Strategy...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate AI Strategy
              </>
            )}
          </button>

          {demoError && (
            <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-amber-300 bg-amber-900/30 border border-amber-700/60 px-3 py-2 rounded-lg">
              <X className="w-4 h-4" />
              <span>{demoError}</span>
            </div>
          )}

          <div className="mt-6 md:mt-8 relative min-h-[300px]">
            {generatedStrategy ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row items-start sm:justify-between sm:items-center mb-4 gap-2">
                  <h3 className="font-bold text-white flex items-center gap-2 text-lg sm:text-xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Strategy Generated
                  </h3>
                  <span className="text-[10px] sm:text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full whitespace-nowrap">
                    Demo preview (2 of 7 days)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 bg-slate-900 rounded-xl p-4 sm:p-5 border border-slate-800">
                    <h4 className="text-sm font-semibold text-emerald-400 mb-2 uppercase tracking-wider">Core Strategy</h4>
                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base">{generatedStrategy.strategy}</p>

                    <h4 className="text-sm font-semibold text-emerald-400 mt-5 sm:mt-6 mb-2 sm:mb-3 uppercase tracking-wider">
                      2-Day Content Schedule
                    </h4>
                    <div className="space-y-2 sm:space-y-3">
                      {generatedStrategy.schedule.map((day: string, idx: number) => (
                        <div key={idx} className="flex gap-2 sm:gap-3 items-start text-xs sm:text-sm text-slate-300">
                          <div className="bg-slate-800 w-5 h-6 sm:w-6 sm:h-6 rounded flex items-center justify-center text-[10px] sm:text-xs font-mono mt-0.5 text-slate-500 flex-shrink-0">
                            {idx + 1}
                          </div>
                          <span className="leading-relaxed">{day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 flex flex-col">
                    <div className="bg-slate-900 rounded-xl p-3 sm:p-4 border border-slate-800">
                      <div className="flex items-center gap-2 mb-2 text-slate-400 text-[10px] sm:text-xs uppercase font-bold">
                        <Zap className="w-3 h-3 sm:w-4 sm:h-4" /> Pro Tip
                      </div>
                      <p className="text-slate-300 text-xs sm:text-sm leading-snug">{generatedStrategy.proTip}</p>
                    </div>
                    <div className="bg-slate-900 rounded-xl p-3 sm:p-4 border border-slate-800">
                      <div className="flex items-center gap-2 mb-2 text-slate-400 text-[10px] sm:text-xs uppercase font-bold">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        Best time & hashtags
                      </div>
                      <p className="text-slate-300 text-[10px] sm:text-xs mb-1">{generatedStrategy.bestPostTime}</p>
                      <p className="text-emerald-400 text-xs sm:text-sm font-mono break-words">
                        {generatedStrategy.hashtags}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 text-center px-2">
                  <Link
                    href="/auth"
                    className="inline-flex items-center text-xs sm:text-sm text-emerald-400 hover:text-emerald-300 font-semibold gap-1 transition-colors"
                  >
                    Unlock full 7-day calendar & CSV export <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Link>
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-2 leading-relaxed">
                    Free account • No card required • Built on free-tier infra (Vercel, Supabase, Groq)
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-[300px] border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-500 px-4 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 opacity-50" />
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">Pick a niche and platform, then click “Generate AI Strategy”.</p>
                <p className="text-[10px] sm:text-xs text-slate-600 mt-2 leading-relaxed">You’ll see exactly what your clients will get before you sign up.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// --- Main Landing Page Component ---
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-lg transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/auth" className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span>DKS QwikPlan</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#comparison" className="hover:text-slate-900 transition-colors">
              Why This?
            </Link>
            <Link href="#demo" className="hover:text-slate-900 transition-colors">
              Demo
            </Link>
            <Link
              href="https://github.com/seenuraj2007/DKS_qwikplan"
              target="_blank"
              className="hover:text-slate-900 flex items-center gap-1.5"
            >
              <Github className="w-4 h-4" /> GitHub
            </Link>
          </div>

          <Link
            href="/auth"
            className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            v2.0 • Open-source content strategy engine
          </div> */}

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
            Stop planning in chat.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Start executing in calendars.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
            Generic AI tools give you paragraphs. DKS QwikPlan turns your niche into a 7-day content calendar, hashtags,
            and growth strategy—ready to export and send to clients.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/auth"
              className="w-full sm:w-auto h-14 px-8 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl shadow-emerald-500/25 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Generate My First Plan <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#demo"
              className="w-full sm:w-auto h-14 px-8 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              View Live Demo
            </Link>
          </div>

          <div className="relative max-w-5xl mx-auto rounded-2xl border-8 border-slate-900 shadow-2xl overflow-hidden bg-slate-900">
            <img
              src="/Screenshot 2025-12-31 at 11.36.41 PM.png"
              alt="Dashboard Preview"
              className="w-full opacity-90 hover:opacity-100 transition-opacity duration-500"
            />
          </div>
        </div>
      </main>

      <TrustSection />

      {/* Strong “Why Use This” section */}
      <section id="comparison" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why use DKS QwikPlan instead of generic AI?
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto">
              Because you don’t get paid for “ideas”. You get paid when content is planned, scheduled, and shipped for your
              clients. This is where DKS QwikPlan is different.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Generic AI tools</h3>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">You have to fight for good output</h4>
                    <p className="text-slate-500 text-sm mt-1">
                      You spend 15–30 minutes tweaking prompts, regenerating, and copy-pasting into docs.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">Everything is unstructured</h4>
                    <p className="text-slate-500 text-sm mt-1">
                      You get a huge paragraph. No daily breakdown, no CSV, no way to send to a client as a clean plan.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">Nothing is saved as “assets”</h4>
                    <p className="text-slate-500 text-sm mt-1">
                      Strategies disappear in chat history. Next month you start from scratch for the same client.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-emerald-200 shadow-xl shadow-emerald-500/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                BUILT FOR CLIENT WORK
              </div>

              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-emerald-50">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Rocket className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">DKS QwikPlan</h3>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">Zero prompt engineering</h4>
                    <p className="text-slate-500 text-sm mt-1">
                      You pick niche and platform. Backend prompts are tuned for strategy + schedule, not chat.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">Structured, exportable output</h4>
                    <p className="text-slate-500 text-sm mt-1">
                      Strategy, 7-day schedule, best times, and hashtags—ready to export as CSV and send to a client.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">Client library instead of chat history</h4>
                    <p className="text-slate-500 text-sm mt-1">
                      Every plan is saved inside a dashboard. You can reopen, tweak, and regenerate variations later.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What you get in version 2.0</h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Every feature is picked for one outcome: help you deliver client strategies faster, without extra tools or manual
            formatting.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600 mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">CSV Export</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Download a clean 7-day schedule as CSV and plug it into Google Sheets, Notion, Trello, or Buffer.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-teal-600 mb-4">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Niche-Specific Logic</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Different prompt logic for SaaS, local businesses, creators, and more—so the plan “sounds right” for the niche.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 mb-4">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">History & Analytics</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              See previous generations and track how many strategies you’ve created per client each month.
            </p>
          </div>
        </div>
      </section>

      <DemoSection />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white font-bold">
            <Zap className="w-5 h-5 fill-emerald-500 text-emerald-500" />
            DKS QwikPlan
          </div>
          <div className="text-sm">
            &copy; {new Date().getFullYear()} DKS QwikPlan. Open Source MIT License. Self-host or use hosted version.
          </div>
          <div className="flex gap-6">
            <Link
              href="https://github.com/seenuraj2007/DKS_qwikplan"
              target="_blank"
              className="hover:text-white transition-colors flex items-center gap-2"
            >
              <Github className="w-4 h-4" /> GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
