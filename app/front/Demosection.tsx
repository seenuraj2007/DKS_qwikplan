import { Loader2, Sparkles, X, CheckCircle2, Rocket, Zap, Link, ArrowRight } from "lucide-react"
import { useState } from "react"

// --- Interactive Demo (Modernized) ---
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
    <section id="demo" className="py-20 md:py-28 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4 inline-block border border-emerald-500/20">
            Interactive Demo
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            See execution, not just ideas
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            No signup required. Pick a niche and platform, and watch it turn into a real, structured plan.
          </p>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl ring-1 ring-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">1. Pick a Niche</label>
              <div className="relative group">
                <select
                  value={selectedNiche}
                  onChange={(e) => setSelectedNiche(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-900/80 border border-slate-700 text-white rounded-2xl text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none cursor-pointer transition-all hover:border-slate-500"
                >
                  {demoNiches.map(niche => <option key={niche} value={niche}>{niche}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">2. Pick a Platform</label>
              <div className="relative group">
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-900/80 border border-slate-700 text-white rounded-2xl text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none cursor-pointer transition-all hover:border-slate-500"
                >
                  {demoPlatforms.map(platform => <option key={platform} value={platform}>{platform}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleDemoGenerate}
            disabled={isGenerating}
            className="w-full h-14 sm:h-16 rounded-2xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all transform hover:scale-[1.01] shadow-xl shadow-emerald-900/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-3 text-lg"
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
            <div className="mt-6 flex items-center gap-3 text-sm text-amber-200 bg-amber-900/40 border border-amber-500/30 px-4 py-3 rounded-xl">
              <X className="w-5 h-5 flex-shrink-0" />
              <span>{demoError}</span>
            </div>
          )}

          <div className="mt-8 relative min-h-[340px]">
            {generatedStrategy ? (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
                <div className="flex flex-col sm:flex-row items-start sm:justify-between sm:items-center mb-6 gap-3">
                  <h3 className="font-bold text-white flex items-center gap-3 text-2xl">
                    <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    Strategy Generated
                  </h3>
                  <span className="text-xs font-medium text-slate-500 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
                    Demo preview (2 of 7 days)
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-800">
                    <h4 className="text-xs font-bold text-emerald-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                      <Rocket className="w-4 h-4" />
                      Core Strategy
                    </h4>
                    <p className="text-slate-300 leading-relaxed text-base mb-8">{generatedStrategy.strategy}</p>

                    <h4 className="text-xs font-bold text-emerald-400 mb-4 uppercase tracking-widest">
                      2-Day Schedule
                    </h4>
                    <div className="space-y-4">
                      {generatedStrategy.schedule.map((day: string, idx: number) => (
                        <div key={idx} className="flex gap-4 items-start text-sm text-slate-300 group">
                          <div className="bg-slate-800 group-hover:bg-emerald-900/50 transition-colors w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono mt-0.5 text-slate-500 group-hover:text-emerald-400 flex-shrink-0 border border-slate-700/50">
                            {idx + 1}
                          </div>
                          <span className="leading-relaxed py-1">{day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 flex flex-col">
                    <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-800 flex-1">
                      <div className="flex items-center gap-2 mb-3 text-slate-400 text-xs uppercase font-bold tracking-wider">
                        <Zap className="w-4 h-4 text-amber-400" /> Pro Tip
                      </div>
                      <p className="text-slate-300 text-sm leading-snug">{generatedStrategy.proTip}</p>
                    </div>
                    <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-800 flex-1">
                      <div className="flex items-center gap-2 mb-3 text-slate-400 text-xs uppercase font-bold tracking-wider">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        Time & Hashtags
                      </div>
                      <p className="text-slate-300 text-xs mb-2 opacity-90">{generatedStrategy.bestPostTime}</p>
                      <p className="text-emerald-400 text-xs font-mono break-words leading-normal">
                        {generatedStrategy.hashtags}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Link
                    href="/auth"
                    className="inline-flex items-center text-sm font-bold text-emerald-400 hover:text-emerald-300 gap-2 transition-colors group"
                  >
                    Unlock full 7-day calendar & CSV export 
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <p className="text-xs text-slate-600 mt-3">
                    Free account • No card required • Built on Vercel & Supabase
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-[340px] border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500 px-6 text-center bg-slate-900/30">
                <div className="w-14 h-14 bg-slate-900/50 rounded-full flex items-center justify-center mb-4 border border-slate-800">
                  <Sparkles className="w-6 h-6 opacity-40" />
                </div>
                <p className="text-base font-medium text-slate-400">Ready to generate?</p>
                <p className="text-sm text-slate-600 mt-1 max-w-xs mx-auto">Select your niche and platform above to see the magic in action.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default DemoSection;