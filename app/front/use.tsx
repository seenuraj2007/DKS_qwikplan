import { Zap, Github, ArrowRight, CheckCircle2, MessageSquare, Rocket, XCircle } from "lucide-react";
import Link from "next/link";

export default function Use() {
  return (
    <>
      {/* Strong “Why Use This” section */}
      <section id="comparison" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Why use DKS QwikPlan?
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Because you don’t get paid for “ideas”. You get paid when content is planned, scheduled, and shipped.
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
                    <h4 className="font-bold text-slate-900 text-lg">You have to fight for good output</h4>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                      You spend 15–30 minutes tweaking prompts, regenerating, and copy-pasting into docs.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <XCircle className="w-6 h-6 text-slate-300 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Everything is unstructured</h4>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                      You get a huge paragraph. No daily breakdown, no CSV, no way to send to a client.
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
                        You pick niche and platform. Backend prompts are tuned for strategy + schedule, not chat.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-white text-lg">Structured, exportable output</h4>
                      <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                        Strategy, 7-day schedule, best times, and hashtags—ready to export as CSV immediately.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}