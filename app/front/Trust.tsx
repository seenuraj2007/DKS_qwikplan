import { Users, FileSpreadsheet, Shield } from "lucide-react";


// --- Trust Section (Modernized) ---
const TrustSection = () => {
  return (
    <section className="py-12 border-y border-slate-100 bg-slate-50/50 relative overflow-hidden">
      {/* Subtle mesh gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent opacity-50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">
          Trusted by freelancers & indie makers
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="group p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex flex-col items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-full group-hover:bg-emerald-100 transition-colors">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-lg font-bold text-slate-900">Client Ready</span>
            <span className="text-sm text-slate-500 leading-relaxed">Designed around client work, not just solo content</span>
          </div>
          <div className="group p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-teal-200 transition-all duration-300 flex flex-col items-center gap-3">
            <div className="p-3 bg-teal-50 rounded-full group-hover:bg-teal-100 transition-colors">
              <FileSpreadsheet className="w-6 h-6 text-teal-600" />
            </div>
            <span className="text-lg font-bold text-slate-900">CSV Export</span>
            <span className="text-sm text-slate-500 leading-relaxed">Plug schedules directly into Notion, Buffer, or Sheets</span>
          </div>
          <div className="group p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col items-center gap-3">
            <div className="p-3 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition-colors">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-lg font-bold text-slate-900">Open Source</span>
            <span className="text-sm text-slate-500 leading-relaxed">Full code on GitHub • Zero vendor lock-in</span>
          </div>
        </div>
      </div>
    </section>
  )
}
export default TrustSection;