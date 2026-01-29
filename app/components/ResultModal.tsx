'use client'

import { supabase } from '../../lib/supabaseClient'
import type { PlanResult } from '../../lib/types'
import { useState } from 'react'
import { X, Download, Copy, Check, Zap, Clock, Hash, MessageCircle, Star } from 'lucide-react'

interface ResultModalProps {
  showModal: boolean
  result: PlanResult | null
  niche: string
  platform: string
  userId: string | null
  userEmail: string
  showToast: (msg: string, type?: 'success' | 'error') => void
  onClose: () => void
  onDownload: (data: PlanResult) => void
}

export default function ResultModal({
  showModal,
  result,
  niche,
  platform,
  showToast,
  onClose,
  userId,
  onDownload
}: ResultModalProps) {
  const [copied, setCopied] = useState(false)
  
  // Feedback State
  const [rating, setRating] = useState<number | null>(null)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [submittingFeedback, setSubmittingFeedback] = useState(false)

  if (!showModal || !result) return null

  // Copy helper
  const copyToClipboard = (text: string, label: string = 'Text') => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} copied!`)
    })
  }

  // Copy ALL helper
  const handleCopyAll = () => {
    const textToCopy = `
PLATFORM: ${platform}
HOOK: ${result.hook}
---------------------------
CONTENT SCRIPT:
${result.script}
---------------------------
CAPTION: ${result.caption || 'N/A'}
---------------------------
CTA: ${result.cta}
HASHTAGS: ${result.hashtags}
    `.trim()
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true)
      showToast('Full script copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Feedback Submission
  const handleSubmitFeedback = async () => {
    if (!rating && !feedbackText.trim()) {
      showToast('Add a rating or comment first', 'error')
      return
    }
    try {
      setSubmittingFeedback(true)
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token
      if (!accessToken) {
        showToast('Please log in to submit feedback', 'error')
        return
      }

      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          userId, rating: rating || 0, feedbackText, niche, platform
        }),
      })
      
      showToast('Thanks for your feedback!', 'success')
      setFeedbackText('')
      setRating(null)
    } catch (err) {
      showToast('Failed to submit feedback.', 'error')
    } finally {
      setSubmittingFeedback(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
              Generative Content Script
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Optimized for {platform} • {niche}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1">
          
          {/* Strategy Insight */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">Strategy Angle</h3>
            <p className="text-slate-700 text-sm font-medium leading-relaxed">{result.strategy}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT COL: The Script */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* HOOK Section */}
              <div className="bg-white border-2 border-slate-100 rounded-xl overflow-hidden hover:border-emerald-200 transition-colors group">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                  <h4 className="font-bold text-slate-700 text-sm">THE HOOK</h4>
                  <button onClick={() => copyToClipboard(result.hook, 'Hook')} className="text-xs text-slate-400 hover:text-emerald-600 font-semibold flex items-center gap-1">
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <div className="p-4 bg-white text-lg font-bold text-slate-800 leading-snug">
                  {result.hook}
                </div>
              </div>

              {/* MAIN SCRIPT Section */}
              <div className="bg-white border-2 border-slate-100 rounded-xl overflow-hidden hover:border-emerald-200 transition-colors shadow-sm group">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                  <h4 className="font-bold text-slate-700 text-sm">
                    {platform.toLowerCase().includes('twitter') || platform.toLowerCase().includes('linkedin') ? 'POST CONTENT' : 'VIDEO SCRIPT'}
                  </h4>
                  <button onClick={() => copyToClipboard(result.script, 'Script')} className="text-xs text-slate-400 hover:text-emerald-600 font-semibold flex items-center gap-1">
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <div className="p-6 bg-white text-slate-800 whitespace-pre-wrap leading-relaxed font-mono text-sm">
                  {result.script}
                </div>
              </div>

              {/* CAPTION Section (Conditional) */}
              {result.caption && (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                   <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                    <h4 className="font-bold text-slate-500 text-xs uppercase">Caption / Description</h4>
                    <button onClick={() => copyToClipboard(result.caption || '', 'Caption')} className="text-xs text-slate-400 hover:text-emerald-600 font-semibold flex items-center gap-1">
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                  <div className="p-4 text-slate-600 text-sm whitespace-pre-wrap">
                    {result.caption}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COL: Meta Info */}
            <div className="space-y-4">
              
              {/* CTA Box */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">Call To Action</h4>
                <p className="font-bold text-lg leading-tight text-white">{result.cta}</p>
              </div>

              {/* Pro Tip */}
              <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl">
                 <div className="flex items-center gap-2 text-amber-600 mb-2">
                    <Zap className="w-4 h-4 fill-current" />
                    <h4 className="font-bold text-xs uppercase tracking-wider">Pro Tip</h4>
                 </div>
                <p className="text-slate-700 text-sm leading-relaxed">{result.proTip}</p>
              </div>

              {/* Best Time */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl">
                 <div className="flex items-center gap-2 text-indigo-500 mb-2">
                    <Clock className="w-4 h-4" />
                    <h4 className="font-bold text-xs uppercase tracking-wider">Post Time</h4>
                 </div>
                <p className="text-slate-900 font-bold">{result.bestPostTime}</p>
              </div>

              {/* Hashtags */}
              <div className="bg-white border border-slate-200 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                  <Hash className="w-4 h-4" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Hashtags</h4>
                </div>
                <p className="text-xs text-emerald-700 font-mono leading-relaxed break-words">{result.hashtags}</p>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Rate this result</h3>
            <div className="flex items-center gap-2">
               {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(null)}>
                    <Star className={`w-6 h-6 transition-colors ${ (hoverRating ?? rating ?? 0) >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-200' }`} />
                  </button>
               ))}
               <input 
                  type="text" 
                  value={feedbackText} 
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Any feedback?"
                  className="ml-4 flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
               />
               <button onClick={handleSubmitFeedback} disabled={submittingFeedback} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold">
                 {submittingFeedback ? '...' : 'Send'}
               </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3 justify-end">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-200 transition-colors text-sm">
            Close
          </button>
          <button onClick={handleCopyAll} className="px-6 py-3 rounded-xl text-slate-700 font-semibold border border-slate-300 hover:bg-slate-100 transition-colors text-sm flex items-center gap-2">
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Full Script'}
          </button>
          <button onClick={() => onDownload(result)} className="px-8 py-3 rounded-xl text-white font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-[1.02] shadow-lg shadow-emerald-500/20 transition-all text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Save / Download
          </button>
        </div>
      </div>
    </div>
  )
}
