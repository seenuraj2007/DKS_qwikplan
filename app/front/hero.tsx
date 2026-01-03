import { Zap, Github, ArrowRight } from "lucide-react";
import Link from "next/link";

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
            v2.0 is now live • Free tier available
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
            Stop planning in chat.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Start executing in calendars.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-12 leading-relaxed">
            Generic AI tools give you paragraphs. DKS QwikPlan turns your niche into a 7-day content calendar, hashtags,
            and growth strategy—ready to export and send to clients.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/auth"
              className="w-full sm:w-auto h-14 px-8 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl shadow-emerald-500/25 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              Generate My First Plan <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#demo"
              className="w-full sm:w-auto h-14 px-8 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
            >
              View Live Demo
            </Link>
          </div>

          <div className="relative max-w-5xl mx-auto rounded-2xl border border-slate-200/60 shadow-2xl overflow-hidden bg-slate-50 group">
             <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000" />
            <img
              src="/Screenshot 2025-12-31 at 11.36.41 PM.png"
              alt="Dashboard Preview"
              className="w-full relative rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-700"
            />
          </div>
        </div>
      </main>
    </>
  );
}