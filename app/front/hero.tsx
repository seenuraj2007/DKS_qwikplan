import { Zap, ArrowRight, CheckCircle2, Users, Target, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <>
      {/* Hero */}
      <main className="pt-32 pb-20 lg:pt-48 lg:pb-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-emerald-50/50 to-transparent blur-3xl -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-medium mb-10 shadow-sm hover:shadow-md transition-shadow cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            AI-Powered Marketing Generator • Free tier available
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
            Generate viral content
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              in seconds, not hours
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-12 leading-relaxed">
            Enter your niche and goals. Get AI-generated marketing plans with hooks, scripts, captions, 
            CTAs, hashtags, and posting times. Ready to copy, edit, or export as CSV.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/auth"
              className="w-full sm:w-auto h-14 px-8 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl shadow-emerald-500/25 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Generate My Strategy <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto h-14 px-8 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
            >
              See How It Works
            </Link>
          </div>

          <div className="relative max-w-5xl mx-auto rounded-2xl border border-slate-200/60 shadow-2xl overflow-hidden bg-slate-50 group">
             <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000" />
             <Image
               src="/Screenshot 2025-12-31 at 11.36.41 PM.png"
               alt="Dashboard Preview"
               width={1000}
               height={600}
               className="w-full relative rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-700"
             />
          </div>
        </div>
      </main>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              From input to strategy in 3 steps
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              No prompt engineering needed. Just fill in the form and let AI do the heavy lifting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 h-full border border-emerald-100">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  1
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/30">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Define Your Goals</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Enter your business niche, target audience, platform (Instagram, LinkedIn, YouTube, etc.), 
                  and your main goal (sales, awareness, engagement).
                </p>
              </div>
            </div>

            <div className="relative md:mt-8">
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 h-full border border-slate-200">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  2
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-slate-700 rounded-xl shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">AI Generates Strategy</h3>
                </div>
                <div className="text-slate-600 leading-relaxed">
                  <p>Our AI instantly creates a complete marketing plan including:</p>
                  <ul className="mt-3 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Hook:</strong> Attention-grabbing opener</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Script:</strong> Full content body or video script</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Caption:</strong> Ready-to-post caption text</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span><strong>CTA:</strong> Strong call-to-action phrase</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span><strong>Hashtags:</strong> Optimized for visibility</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl p-8 h-full border border-teal-100">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  3
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl shadow-lg shadow-teal-500/30">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Copy, Export & Track</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Review your generated strategy. Copy it directly, download as CSV for your records, 
                  or save it to your history. Track your usage and maintain streaks with each generation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
