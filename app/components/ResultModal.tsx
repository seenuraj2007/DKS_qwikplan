'use client'
import { supabase } from '../../lib/supabaseClient' 
import { useState } from 'react'
import {
  X,
  Download,
  Copy,
  Check,
  Zap,
  Clock,
  Hash,
  ChevronRight,
  Calendar,
  MessageCircle,
  Star
} from 'lucide-react'

interface PlanResult {
  strategy: string
  proTip?: string
  bestPostTime?: string
  schedule: string[]
  hashtags?: string
}

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

  // --- NEW: Feedback State ---
  const [rating, setRating] = useState<number | null>(null)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [submittingFeedback, setSubmittingFeedback] = useState(false)

  if (!showModal || !result) return null

  // Copy all text to clipboard
  const handleCopyAll = () => {
    const textToCopy = `
Strategy for ${niche} on ${platform}:
--------------------------
 ${result.strategy}

Schedule:
 ${result.schedule.map(s => s).join('\n')}

Pro Tip: ${result.proTip}
Best Time: ${result.bestPostTime}
Hashtags: ${result.hashtags}
    `.trim()

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true)
      showToast('Strategy copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Submit feedback
  // --- REPLACE THIS FUNCTION IN ResultModal.tsx ---

  // 1. Import Supabase at the top of the file
  // import { supabase } from '../../lib/supabaseClient' 
  // (Add this import if it's missing)

  // ... 

  // 2. Replace handleSubmitFeedback function
  const handleSubmitFeedback = async () => {
    if (!rating && !feedbackText.trim()) {
      showToast('Add a rating or short comment before submitting', 'error')
      return
    }

    try {
      setSubmittingFeedback(true)

      // FIX: Get the current session to get the token
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token

      if (!accessToken) {
        showToast('You must be logged in to submit feedback', 'error')
        setSubmittingFeedback(false)
        return
      }

      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // FIX: Explicitly attach the Authorization header
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: userId, // Passed from props
          rating: rating || 0,
          feedbackText: feedbackText, // Keep key name as 'feedbackText'
          niche: niche,
          platform: platform,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to submit')
      }

      showToast('Thanks for your feedback!', 'success')
      setFeedbackText('')
      setRating(null)
    } catch (err: any) {
      console.error(err)
      showToast(err.message || 'Failed to submit feedback. Please try again.', 'error')
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
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
              Strategy Generated
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Context: {niche} • {platform}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">

          {/* Main Strategy Block */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl"></div>
            <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2">Core Strategy</h3>
            <p className="text-slate-700 leading-relaxed font-medium">
              {result.strategy}
            </p>
          </div>

          {/* Schedule List */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-bold text-slate-900">Content Schedule</h3>
            </div>

            <div className="space-y-3">
              {result.schedule.map((day: string, idx: number) => {
                // Split "Day 1: Post" into ["Day 1", "Post"]
                const parts = day.split(':')
                const label = parts[0]
                const content = parts.slice(1).join(':')

                return (
                  <div
                    key={idx}
                    className="flex gap-4 items-center p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-emerald-200 hover:shadow-md transition-all group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-sm group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-400 uppercase mb-0.5">{label}</div>
                      <div className="text-slate-800 font-medium">{content}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Pro Tip */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-yellow-400 mb-3">
                  <Zap className="w-4 h-4 fill-current" />
                  <h4 className="font-bold text-sm uppercase tracking-wider">Pro Tip</h4>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {result.proTip}
                </p>
              </div>
            </div>

            {/* Best Time */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-indigo-500 mb-3">
                <Clock className="w-4 h-4" />
                <h4 className="font-bold text-sm uppercase tracking-wider">Best Time</h4>
              </div>
              <p className="text-slate-700 font-bold text-lg leading-tight">
                {result.bestPostTime}
              </p>
              <div className="mt-3 flex flex-wrap gap-1">
                {result.hashtags && typeof result.hashtags === 'string' && result.hashtags.split(' ').slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
                {result.hashtags && result.hashtags.split(' ').length > 3 && <span className="text-[10px] text-slate-400">+{result.hashtags.split(' ').length - 3}</span>}
              </div>
            </div>

            {/* Hashtags (Full width on mobile) */}
            <div className="md:col-span-2 bg-white border border-slate-200 p-4 rounded-xl flex items-start gap-3">
              <Hash className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900 mb-2">Hashtags</h4>
                <p className="text-sm text-emerald-700 font-mono break-all leading-relaxed">
                  {result.hashtags}
                </p>
              </div>
            </div>
          </div>

          {/* --- NEW: Feedback Section --- */}
          <div className="mt-4 border border-slate-200 rounded-2xl p-6 bg-slate-50">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                How good was this plan?
              </h3>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${(hoverRating ?? rating ?? 0) >= star
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-300'
                      }`}
                  />
                </button>
              ))}
              <span className="text-xs text-slate-500 ml-2">
                {rating ? `${rating}/5` : 'Click to rate'}
              </span>
            </div>

            {/* Text Feedback */}
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={3}
              placeholder="Tell us what was helpful or what should improve..."
              className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white text-slate-800 resize-none shadow-sm"
            />

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleSubmitFeedback}
                disabled={submittingFeedback}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {submittingFeedback ? (
                  'Submitting...'
                ) : (
                  <>
                    <Check className="w-3 h-3" />
                    Send Feedback
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-200 transition-colors text-sm"
          >
            Close
          </button>

          <button
            onClick={handleCopyAll}
            className="px-6 py-3 rounded-xl text-slate-700 font-semibold border border-slate-300 hover:bg-slate-100 transition-colors text-sm flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Text'}
          </button>

          <button
            onClick={() => onDownload(result)}
            className="px-8 py-3 rounded-xl text-white font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02] text-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download CSV
          </button>
        </div>

      </div>

      {/* Inline styles for scrollbar to avoid dependency on parent file */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
      `}</style>
    </div>
  )
}