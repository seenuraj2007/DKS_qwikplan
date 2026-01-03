import { Zap, Github, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            DKS QwikPlan
          </div>
          <div className="text-sm text-slate-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} DKS QwikPlan. Open Source MIT License.
          </div>
          <div className="flex gap-6">
            <Link
              href="https://github.com/seenuraj2007/DKS_qwikplan"
              target="_blank"
              className="hover:text-white transition-colors flex items-center gap-2 font-medium"
            >
              <Github className="w-4 h-4" /> GitHub
            </Link>
            <Link
              href="/"
              className="hover:text-white transition-colors font-medium"
            >
              Twitter
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}