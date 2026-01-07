import { Loader2, Sparkles, X, CheckCircle2, Rocket, Zap, FileText, ArrowRight, Hash, Clock } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

const DemoSection = () => {
  const [selectedNiche, setSelectedNiche] = useState('Sustainable Fashion')
  const [selectedPlatform, setSelectedPlatform] = useState('Instagram')
  const [selectedGoal, setSelectedGoal] = useState('Sales')
  const [generatedStrategy, setGeneratedStrategy] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [demoError, setDemoError] = useState('')

  const demoNiches = ['Sustainable Fashion', 'Tech SaaS', 'Food Blogging', 'Fitness Coaching']
  const demoPlatforms = ['Instagram', 'LinkedIn', 'YouTube', 'Twitter']
  const demoGoals = ['Sales', 'Brand Awareness', 'Engagement', 'Leads']

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
          audience: 'General audience',
          platform: selectedPlatform,
          goal: selectedGoal,
        }),
      })

      if (!res.ok) throw new Error('API Error')

      const data = await res.json()
      setGeneratedStrategy(data)
    } catch (error) {
      console.error(error)
      setDemoError('Live demo is at limit right now. Showing a realistic sample instead.')
      setGeneratedStrategy({
        strategy: `Focus on ${selectedGoal.toLowerCase()} for ${selectedNiche} by highlighting unique value proposition and social proof. Use authentic storytelling to build trust on ${selectedPlatform}.`,
        hook: `Wait, you've been ${selectedNiche.toLowerCase()} all wrong...`,
        script: `Stop trying to appeal to everyone. The ${selectedNiche} audience doesn't want "good enough" – they want specific solutions to specific problems.

The secret? Position yourself as the expert who understands ONE thing deeply, then scale that authority.

Content pillars that convert:
1. Problem-solution format (show you understand their pain)
2. Behind-the-scenes authenticity (builds connection)
3. Transformation stories (social proof that works)

Your next post? Pick one of these formats and watch engagement skyrocket.`,
        caption: `Want to stand out in ${selectedNiche}? 🚀

Stop trying to be everything to everyone. Focus on solving ONE specific problem better than anyone else.

Save this for reference ♻️

#${selectedNiche.replace(/\s+/g, '')} #MarketingTips #GrowthStrategy`,
        cta: `Comment "FOCUS" and I'll send you my 30-day content calendar`,
        proTip: `On ${selectedPlatform}, post between 6-8 PM on weekdays for maximum engagement. Use the first 3 words of your hook as your image/text overlay.`,
        bestPostTime: 'Weekdays 6:00-8:00 PM',
        hashtags: `#${selectedNiche.replace(/\s+/g, '')} #${selectedNiche.replace(/\s+/g, '')}Tips #Marketing #ContentStrategy #SocialMedia #Growth #${selectedGoal} #${selectedPlatform} #BusinessGrowth`
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
            Generate your first strategy
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            See what the dashboard actually generates. No signup required.
          </p>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl ring-1 ring-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Niche</label>
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="w-full px-3 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none cursor-pointer transition-all"
              >
                {demoNiches.map(niche => <option key={niche} value={niche}>{niche}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Platform</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full px-3 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none cursor-pointer transition-all"
              >
                {demoPlatforms.map(platform => <option key={platform} value={platform}>{platform}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Goal</label>
              <select
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                className="w-full px-3 py-3 bg-slate-900/80 border border-slate-700 text-white rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none cursor-pointer transition-all"
              >
                {demoGoals.map(goal => <option key={goal} value={goal}>{goal}</option>)}
              </select>
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
            <div className="mt-4 flex items-center gap-3 text-sm text-amber-200 bg-amber-900/40 border border-amber-500/30 px-4 py-3 rounded-xl">
              <X className="w-5 h-5 flex-shrink-0" />
              <span>{demoError}</span>
            </div>
          )}

          <div className="mt-8 relative min-h-[380px]">
            {generatedStrategy ? (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-xl">Your Marketing Strategy</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-800">
                      <h4 className="text-xs font-bold text-emerald-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Hook
                      </h4>
                      <p className="text-white text-base leading-relaxed font-semibold">
                        {generatedStrategy.hook}
                      </p>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-800">
                      <h4 className="text-xs font-bold text-emerald-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Script / Content
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                        {generatedStrategy.script}
                      </p>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-800">
                      <h4 className="text-xs font-bold text-emerald-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                        <Rocket className="w-4 h-4" />
                        Call-to-Action
                      </h4>
                      <p className="text-white text-base leading-relaxed font-semibold">
                        {generatedStrategy.cta}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-800">
                      <div className="flex items-center gap-2 mb-3 text-slate-400 text-xs uppercase font-bold tracking-wider">
                        <Clock className="w-4 h-4 text-amber-400" />
                        Best Posting Time
                      </div>
                      <p className="text-white text-base font-medium">
                        {generatedStrategy.bestPostTime}
                      </p>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-800">
                      <div className="flex items-center gap-2 mb-3 text-slate-400 text-xs uppercase font-bold tracking-wider">
                        <Hash className="w-4 h-4 text-teal-400" />
                        Hashtags
                      </div>
                      <p className="text-emerald-400 text-xs font-mono break-words leading-normal">
                        {generatedStrategy.hashtags}
                      </p>
                    </div>

                    <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-5 border border-slate-800">
                      <div className="flex items-center gap-2 mb-3 text-slate-400 text-xs uppercase font-bold tracking-wider">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        Pro Tip
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {generatedStrategy.proTip}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center space-y-3">
                  <Link
                    href="/auth"
                    className="inline-flex items-center text-sm font-bold text-emerald-400 hover:text-emerald-300 gap-2 transition-colors group"
                  >
                    Generate unlimited strategies & export as CSV 
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <p className="text-xs text-slate-600">
                    Free account • Track usage • History & Streaks
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-[380px] border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500 px-6 text-center bg-slate-900/30">
                <div className="w-14 h-14 bg-slate-900/50 rounded-full flex items-center justify-center mb-4 border border-slate-800">
                  <Sparkles className="w-6 h-6 opacity-40" />
                </div>
                <p className="text-base font-medium text-slate-400">Ready to generate?</p>
                <p className="text-sm text-slate-600 mt-1 max-w-xs mx-auto">Select your niche, platform, and goal above to see the magic.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default DemoSection;
