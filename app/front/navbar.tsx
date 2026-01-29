import { Zap, Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/auth" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-slate-900 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span>DKS QwikPlan</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#comparison" className="hover:text-slate-900 transition-colors">
              Why This?
            </Link>
            <Link href="/pricing" className="hover:text-slate-900 transition-colors">
              Pricing
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-slate-200 shadow-xl animate-slide-in-down">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
              <Link href="#comparison" onClick={() => setIsOpen(false)} className="text-slate-700 hover:text-emerald-600 py-2 font-medium">
                Why This?
              </Link>
              <Link href="/pricing" onClick={() => setIsOpen(false)} className="text-slate-700 hover:text-emerald-600 py-2 font-medium">
                Pricing
              </Link>
              <Link href="#demo" onClick={() => setIsOpen(false)} className="text-slate-700 hover:text-emerald-600 py-2 font-medium">
                Demo
              </Link>
              <Link
                href="https://github.com/seenuraj2007/DKS_qwikplan"
                target="_blank"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-slate-700 hover:text-emerald-600 py-2 font-medium"
              >
                <Github className="w-4 h-4" /> GitHub
              </Link>
              <Link
                href="/auth"
                onClick={() => setIsOpen(false)}
                className="mt-2 inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
