'use client'

import { supabase } from '../../lib/supabaseClient'
import type { PlanResult } from '../../lib/types'
import { useState } from 'react'
import { X, Download, Copy, Check, Zap, Clock, Hash, Edit2, Save, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'

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
  onRegenerate?: (type: 'full' | 'hook' | 'script' | 'angle') => void
}

interface EditableFieldProps {
  value: string
  onChange: (value: string) => void
  onSave: () => void
  isEditing: boolean
  onEditToggle: () => void
  label: string
  platform: string
  multiline?: boolean
  maxChars?: number
}

function EditableField({ 
  value, 
  onChange, 
  onSave, 
  isEditing, 
  onEditToggle, 
  label, 
  platform,
  multiline = false,
  maxChars 
}: EditableFieldProps) {
  const charCount = value.length
  const isOverLimit = maxChars && charCount > maxChars
  const isNearLimit = maxChars && charCount > maxChars * 0.9 && !isOverLimit
  
  const charColor = isOverLimit ? 'text-red-500' : isNearLimit ? 'text-amber-500' : 'text-slate-400'
  
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-slate-700 text-sm">{label}</h4>
        <div className="flex items-center gap-2">
          {maxChars && (
            <span className={`text-xs ${charColor}`}>
              {charCount}/{maxChars}
            </span>
          )}
          {isEditing ? (
            <button 
              onClick={onSave}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
            >
              <Save className="w-3 h-3" /> Save
            </button>
          ) : (
            <button 
              onClick={onEditToggle}
              className="text-xs text-slate-400 hover:text-emerald-600 font-semibold flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" /> Edit
            </button>
          )}
        </div>
      </div>
      
      {isEditing ? (
        multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full p-3 border-2 rounded-lg text-sm leading-relaxed font-mono focus:outline-none transition-colors
              ${isOverLimit ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'}
            `}
            rows={8}
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full p-3 border-2 rounded-lg text-sm leading-relaxed font-mono focus:outline-none transition-colors
              ${isOverLimit ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'}
            `}
            autoFocus
          />
        )
      ) : (
        <div className={`p-4 text-slate-800 whitespace-pre-wrap leading-relaxed font-mono text-sm rounded-lg
          ${multiline ? 'bg-white border border-slate-200' : 'bg-white border-2 border-slate-100'}
        `}>
          {value}
        </div>
      )}
    </div>
  )
}

export default function ResultModal({
  showModal,
  result,
  niche,
  platform,
  showToast,
  onClose,
  userId,
  onDownload,
  onRegenerate
}: ResultModalProps) {
  const [copied, setCopied] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editedResult, setEditedResult] = useState<PlanResult | null>(null)
  
  // Feedback State
  const [rating, setRating] = useState<number | null>(null)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [submittingFeedback, setSubmittingFeedback] = useState(false)
  
  // Collapsible sections
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())

  // Platform-specific character limits
  const platformLimits: Record<string, number> = {
    twitter: 280,
    linkedin: 3000,
    instagram: 2200,
    facebook: 63206,
    youtube: 5000
  }

  const currentResult = editedResult || result

  if (!showModal || !currentResult) return null

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  const toggleAllSections = (expand: boolean) => {
    if (expand) {
      setCollapsedSections(new Set())
    } else {
      setCollapsedSections(new Set(['hook', 'script', 'caption', 'cta', 'hashtags', 'protip', 'besttime']))
    }
  }

  const handleEdit = (field: keyof PlanResult) => {
    setEditingField(field)
  }

  const handleSave = (field: keyof PlanResult, value: string) => {
    if (editedResult) {
      setEditedResult({ ...editedResult, [field]: value })
    } else {
      setEditedResult({ ...currentResult, [field]: value })
    }
    setEditingField(null)
    showToast('Changes saved')
  }

  const handleRegenerate = (type: 'full' | 'hook' | 'script' | 'angle') => {
    onRegenerate?.(type)
    onClose()
  }

  const getRegenerateTooltip = (type: string) => {
    const tooltips = {
      full: 'Regenerate entire content with new angle',
      hook: 'Generate a new attention-grabbing hook',
      script: 'Rewrite the main content script',
      angle: 'Try a completely different strategy angle'
    }
    return tooltips[type as keyof typeof tooltips] || ''
  }

  const copyToClipboard = (text: string, label: string = 'Text') => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} copied!`)
    })
  }

  const handleCopyAll = () => {
    const textToCopy = `
PLATFORM: ${platform}
HOOK: ${currentResult.hook}
---------------------------
CONTENT SCRIPT:
${currentResult.script}
---------------------------
CAPTION: ${currentResult.caption || 'N/A'}
---------------------------
CTA: ${currentResult.cta}
HASHTAGS: ${currentResult.hashtags}
    `.trim()
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true)
      showToast('Full script copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    })
  }

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
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 fade-in duration-300">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
              Generative Content Script
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Optimized for {platform} • {niche}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Quick Actions */}
            <button 
              onClick={() => toggleAllSections(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Collapse All
            </button>
            <button 
              onClick={() => toggleAllSections(true)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Expand All
            </button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 flex-1">
          
          {/* Strategy Insight */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl overflow-hidden">
            <div
              onClick={() => toggleSection('strategy')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('strategy') }}
              className="w-full px-5 py-4 flex justify-between items-center hover:bg-emerald-100/50 transition-colors cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Strategy Angle</h3>
              {collapsedSections.has('strategy') ? <ChevronDown className="w-4 h-4 text-emerald-600" /> : <ChevronUp className="w-4 h-4 text-emerald-600" />}
            </div>
            {!collapsedSections.has('strategy') && (
              <p className="px-5 pb-5 text-slate-700 text-sm font-medium leading-relaxed">{currentResult.strategy}</p>
            )}
          </div>

          {/* Regenerate Options Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Regenerate</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleRegenerate('full')}
                className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center gap-1.5"
                title={getRegenerateTooltip('full')}
              >
                <RotateCcw className="w-3 h-3" /> Full Content
              </button>
              <button
                onClick={() => handleRegenerate('hook')}
                className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center gap-1.5"
                title={getRegenerateTooltip('hook')}
              >
                <RotateCcw className="w-3 h-3" /> New Hook
              </button>
              <button
                onClick={() => handleRegenerate('script')}
                className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center gap-1.5"
                title={getRegenerateTooltip('script')}
              >
                <RotateCcw className="w-3 h-3" /> New Script
              </button>
              <button
                onClick={() => handleRegenerate('angle')}
                className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center gap-1.5"
                title={getRegenerateTooltip('angle')}
              >
                <Zap className="w-3 h-3" /> Different Angle
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT COL: The Script */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* HOOK Section */}
              <div className="bg-white border-2 border-slate-100 rounded-xl overflow-hidden hover:border-emerald-200 transition-colors group">
                <div
                  onClick={() => toggleSection('hook')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('hook') }}
                  className="w-full bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center hover:bg-slate-100 transition-colors cursor-pointer"
                  role="button"
                  tabIndex={0}
                >
                  <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                    THE HOOK
                    <button
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(currentResult.hook, 'Hook'); }}
                      className="text-xs text-slate-400 hover:text-emerald-600 font-semibold flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </h4>
                  {collapsedSections.has('hook') ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
                </div>
                {!collapsedSections.has('hook') && (
                  <div className="p-4">
                    <EditableField
                      value={currentResult.hook}
                      onChange={(val) => setEditedResult({ ...currentResult, hook: val })}
                      onSave={() => handleSave('hook', currentResult.hook)}
                      isEditing={editingField === 'hook'}
                      onEditToggle={() => handleEdit('hook')}
                      label=""
                      platform={platform}
                      multiline={false}
                      maxChars={platform === 'twitter' ? 50 : 200}
                    />
                  </div>
                )}
              </div>

              {/* MAIN SCRIPT Section */}
              <div className="bg-white border-2 border-slate-100 rounded-xl overflow-hidden hover:border-emerald-200 transition-colors shadow-sm group">
                <div
                  onClick={() => toggleSection('script')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('script') }}
                  className="w-full bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center hover:bg-slate-100 transition-colors cursor-pointer"
                  role="button"
                  tabIndex={0}
                >
                  <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                    {platform.toLowerCase().includes('twitter') || platform.toLowerCase().includes('linkedin') ? 'POST CONTENT' : 'VIDEO SCRIPT'}
                    <button
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(currentResult.script, 'Script'); }}
                      className="text-xs text-slate-400 hover:text-emerald-600 font-semibold flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </h4>
                  {collapsedSections.has('script') ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
                </div>
                {!collapsedSections.has('script') && (
                  <div className="p-6">
                    <EditableField
                      value={currentResult.script}
                      onChange={(val) => setEditedResult({ ...currentResult, script: val })}
                      onSave={() => handleSave('script', currentResult.script)}
                      isEditing={editingField === 'script'}
                      onEditToggle={() => handleEdit('script')}
                      label=""
                      platform={platform}
                      multiline={true}
                      maxChars={platformLimits[platform.toLowerCase()]}
                    />
                  </div>
                )}
              </div>

              {/* CAPTION Section (Conditional) */}
              {currentResult.caption && (
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                   <div
                    onClick={() => toggleSection('caption')}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('caption') }}
                    className="w-full bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center hover:bg-slate-100 transition-colors cursor-pointer"
                    role="button"
                    tabIndex={0}
                  >
                    <h4 className="font-bold text-slate-500 text-xs uppercase flex items-center gap-2">
                      Caption / Description
                      <button
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(currentResult.caption || '', 'Caption'); }}
                        className="text-xs text-slate-400 hover:text-emerald-600 font-semibold flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </h4>
                    {collapsedSections.has('caption') ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
                  </div>
                  {!collapsedSections.has('caption') && (
                    <div className="p-4">
                      <EditableField
                        value={currentResult.caption || ''}
                        onChange={(val) => setEditedResult({ ...currentResult, caption: val })}
                        onSave={() => handleSave('caption', currentResult.caption || '')}
                        isEditing={editingField === 'caption'}
                        onEditToggle={() => handleEdit('caption')}
                        label=""
                        platform={platform}
                        multiline={true}
                        maxChars={platformLimits[platform.toLowerCase()]}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT COL: Meta Info */}
            <div className="space-y-4">
              
              {/* CTA Box */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                <div
                  onClick={() => toggleSection('cta')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('cta') }}
                  className="w-full flex justify-between items-center hover:opacity-80 transition-opacity cursor-pointer"
                  role="button"
                  tabIndex={0}
                >
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Call To Action</h4>
                  {collapsedSections.has('cta') ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
                </div>
                {!collapsedSections.has('cta') && (
                  <p className="font-bold text-lg leading-tight text-white mt-3">{currentResult.cta}</p>
                )}
              </div>

              {/* Pro Tip */}
              <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl overflow-hidden">
                 <div
                  onClick={() => toggleSection('protip')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('protip') }}
                  className="w-full flex justify-between items-center hover:bg-amber-100/50 transition-colors cursor-pointer"
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-2 text-amber-600">
                     <Zap className="w-4 h-4 fill-current" />
                     <h4 className="font-bold text-xs uppercase tracking-wider">Pro Tip</h4>
                  </div>
                  {collapsedSections.has('protip') ? <ChevronDown className="w-4 h-4 text-amber-600" /> : <ChevronUp className="w-4 h-4 text-amber-600" />}
                </div>
                {!collapsedSections.has('protip') && (
                  <p className="text-slate-700 text-sm leading-relaxed mt-3">{currentResult.proTip}</p>
                )}
              </div>

              {/* Best Time */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl overflow-hidden">
                 <div
                  onClick={() => toggleSection('besttime')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('besttime') }}
                  className="w-full flex justify-between items-center hover:bg-slate-50 transition-colors cursor-pointer"
                  role="button"
                  tabIndex={0}
                 >
                  <div className="flex items-center gap-2 text-indigo-500">
                     <Clock className="w-4 h-4" />
                     <h4 className="font-bold text-xs uppercase tracking-wider">Post Time</h4>
                  </div>
                  {collapsedSections.has('besttime') ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
                 </div>
                 {!collapsedSections.has('besttime') && (
                   <p className="text-slate-900 font-bold mt-3">{currentResult.bestPostTime}</p>
                 )}
               </div>

              {/* Hashtags */}
              <div className="bg-white border border-slate-200 p-4 rounded-2xl overflow-hidden">
                <div
                  onClick={() => toggleSection('hashtags')}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSection('hashtags') }}
                  className="w-full flex justify-between items-center hover:bg-slate-50 transition-colors cursor-pointer"
                  role="button"
                  tabIndex={0}
                 >
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Hash className="w-4 h-4" />
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Hashtags</h4>
                  </div>
                  {collapsedSections.has('hashtags') ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
                </div>
                {!collapsedSections.has('hashtags') && (
                  <p className="text-xs text-emerald-700 font-mono leading-relaxed break-words mt-3">{currentResult.hashtags}</p>
                )}
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Rate this result</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
               <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                     <button 
                      key={star} 
                      onClick={() => setRating(star)} 
                      onMouseEnter={() => setHoverRating(star)} 
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-0.5 hover:scale-110 transition-transform"
                    >
                      <span className={`w-6 h-6 transition-colors ${ (hoverRating ?? rating ?? 0) >= star ? 'text-amber-400' : 'text-slate-200' }`}>★</span>
                     </button>
                  ))}
               </div>
               <input 
                  type="text" 
                  value={feedbackText} 
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Any feedback?"
                  className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald-500"
               />
               <button onClick={handleSubmitFeedback} disabled={submittingFeedback} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors whitespace-nowrap">
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
          <button onClick={() => onDownload(currentResult)} className="px-8 py-3 rounded-xl text-white font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-[1.02] shadow-lg shadow-emerald-500/20 transition-all text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Save / Download
          </button>
        </div>
      </div>
    </div>
  )
}
