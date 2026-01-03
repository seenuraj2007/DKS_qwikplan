import { Layers, CheckCircle2, Link, Zap } from "lucide-react"

// --- Pricing Section (New) ---
const PricingSection = ({ id }: { id?: string } = {}) => {
    return (
    <section id={id} className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4 inline-block border border-emerald-100">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-slate-600">
            Start for free. Upgrade when you need to scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Free Tier */}
          <div className="flex flex-col p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <Layers className="w-12 h-12 text-slate-100" />
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900">Starter</h3>
              <p className="text-slate-500 mt-2 text-sm">Perfect for trying out QwikPlan.</p>
            </div>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-slate-900">$0</span>
              <span className="text-slate-500">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {['5 AI Plans per month', 'Basic GPT-3.5 Models', 'Standard CSV Export', 'Public GitHub Support'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/auth"
              className="w-full py-3.5 px-6 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all text-center"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="flex flex-col p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 p-4 opacity-20">
                <Zap className="w-16 h-16 text-emerald-400" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Pro</h3>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  POPULAR
                </span>
              </div>
              <p className="text-slate-400 mt-2 text-sm mb-6">For serious freelancers and agencies.</p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold text-white">$19</span>
                <span className="text-slate-400">/month</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {['Unlimited AI Plans', 'Advanced Models (GPT-4o, Claude)', 'Custom Branding on PDFs', 'Priority Email Support', 'Future Beta Features'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              
              <Link
                href="/auth?plan=pro"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-white hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-900/50 transition-all text-center transform hover:scale-[1.02]"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default PricingSection;