'use client'

import { useToast } from '../contexts/ToastContext'
import { CheckCircle2, X, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  const toastIcons = {
    success: <CheckCircle2 className="w-5 h-5" />,
    error: <X className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  }

  const toastColors = {
    success: 'bg-emerald-600',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-600',
  }

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto max-w-md min-w-[320px] px-6 py-4 rounded-xl shadow-2xl font-medium text-white transition-all duration-300 transform animate-slide-in-right flex items-start gap-3 border border-white/10 backdrop-blur-md ${toastColors[toast.type]}`}
          onClick={() => removeToast(toast.id)}
        >
          <div className="flex-shrink-0 mt-0.5">
            {toastIcons[toast.type]}
          </div>
          <span className="flex-1 leading-relaxed">{toast.message}</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              removeToast(toast.id)
            }}
            className="flex-shrink-0 ml-2 hover:bg-white/10 rounded-lg p-1 transition-colors"
            aria-label="Close toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
