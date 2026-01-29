'use client'

import { Loader2, Brain, Sparkles, CheckCircle, Wand2 } from 'lucide-react'

interface LoadingStateProps {
  stage: 'analyzing' | 'crafting' | 'writing' | 'optimizing' | 'complete'
  progress?: number
  estimatedTime?: number
}

const stages = [
  { id: 'analyzing', label: 'Analyzing niche & audience...', icon: Brain },
  { id: 'crafting', label: 'Crafting attention-grabbing hook...', icon: Wand2 },
  { id: 'writing', label: 'Writing engaging content script...', icon: Sparkles },
  { id: 'optimizing', label: 'Optimizing for platform...', icon: CheckCircle },
  { id: 'complete', label: 'Content ready!', icon: CheckCircle },
]

export default function LoadingState({ stage, progress = 0, estimatedTime = 5 }: LoadingStateProps) {
  const currentStageIndex = stages.findIndex(s => s.id === stage)
  const completedStages = currentStageIndex >= 0 ? currentStageIndex : 0

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Estimated Time */}
      {estimatedTime > 0 && stage !== 'complete' && (
        <div className="text-center">
          <p className="text-sm text-slate-500">
            Estimated time remaining: <span className="font-semibold text-slate-700">~{estimatedTime}s</span>
          </p>
        </div>
      )}

      {/* Stages */}
      <div className="space-y-3">
        {stages.map((item, index) => {
          const Icon = item.icon
          const isCompleted = index < completedStages
          const isCurrent = index === currentStageIndex
          const isPending = index > currentStageIndex

          return (
            <div 
              key={item.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                isCurrent ? 'bg-emerald-50 border-2 border-emerald-200 scale-[1.02]' :
                isCompleted ? 'bg-emerald-50/50 border border-emerald-100' :
                'bg-slate-50 border border-slate-100'
              }`}
            >
              {/* Icon */}
              <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                isCompleted ? 'bg-emerald-500 text-white' :
                isCurrent ? 'bg-emerald-500 text-white animate-pulse' :
                'bg-slate-200 text-slate-400'
              }`}>
                {isPending && <Icon className="w-4 h-4" />}
                {isCurrent && <Loader2 className="w-4 h-4 animate-spin" />}
                {isCompleted && <CheckCircle className="w-4 h-4" />}
              </div>

              {/* Label */}
              <p className={`text-sm font-medium transition-colors ${
                isCurrent ? 'text-emerald-900' :
                isCompleted ? 'text-emerald-700' :
                'text-slate-400'
              }`}>
                {item.label}
              </p>

              {/* Current Stage Indicator */}
              {isCurrent && (
                <div className="ml-auto">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Tips */}
      {stage !== 'complete' && (
        <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500 text-center">
            💡 <span className="font-semibold">Pro tip:</span> You can generate multiple variations later to choose the best one
          </p>
        </div>
      )}
    </div>
  )
}
