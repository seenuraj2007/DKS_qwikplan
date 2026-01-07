import { Zap, CheckCircle2, MessageSquare, Rocket, XCircle, FileText, Clock, Hash } from "lucide-react";

export default function Use() {
  return (
    <>
      {/* Comparison Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Why use DKS QwikPlan?
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Stop wrestling with generic AI. Get structured, platform-specific marketing content in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Generic AI Card */}
            <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                <div className="p-3 bg-slate-100 rounded-2xl">
                  <MessageSquare className="w-7 h-7 text-slate-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800">Generic AI tools</h3>
              </div>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <XCircle className="w-6 h-6 text-slate-300 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Prompt engineering required</h4>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                      You spend 15-30 minutes tweaking prompts, regenerating, and copy-pasting.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <XCircle className="w-6 h-6 text-slate-300 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Generic output</h4>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                      Gets random paragraphs not tailored to your specific platform or goal.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <XCircle className="w-6 h-6 text-slate-300 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Unstructured content</h4>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                      No hooks, no CTAs, no hashtags. Just text you have to rework.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* QwikPlan Card */}
            <div className="bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
               {/* Glow effect inside card */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
 
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-800">
                  <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/20">
                    <Rocket className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">DKS QwikPlan</h3>
                </div>

                <div className="space-y-8">
                  <div className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-white text-lg">Zero prompt engineering</h4>
                      <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                        Just fill the form. Our backend handles the complex prompts for you.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-white text-lg">Complete, structured output</h4>
                      <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                        Get everything you need: hook, script, caption, CTA, hashtags, and best posting time.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-white text-lg">Platform-specific content</h4>
                      <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                        Content optimized for Instagram, LinkedIn, YouTube, Twitter, or Facebook.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              What you actually get
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Every generation gives you a complete, ready-to-use marketing strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-emerald-500 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Full Strategy</h3>
              </div>
              <p className="text-slate-600 text-sm">
                Strategic explanation of why this approach works for your niche and goal.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-500 rounded-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Hook</h3>
              </div>
              <p className="text-slate-600 text-sm">
                Attention-grabbing opening line designed to stop the scroll in 3 seconds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Script or Body</h3>
              </div>
              <p className="text-slate-600 text-sm">
                Full content: video script with scenes or complete post body text, ready to use.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Call-to-Action</h3>
              </div>
              <p className="text-slate-600 text-sm">
                Strong, conversion-focused CTA that drives your desired outcome (sales, leads, etc.).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-teal-500 rounded-lg">
                  <Hash className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Hashtags</h3>
              </div>
              <p className="text-slate-600 text-sm">
                Optimized set of 10-15 hashtags for maximum visibility and reach.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-50 to-red-50 border border-rose-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-rose-500 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Best Posting Time</h3>
              </div>
              <p className="text-slate-600 text-sm">
                Platform-specific optimal day and time to post for maximum engagement.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
