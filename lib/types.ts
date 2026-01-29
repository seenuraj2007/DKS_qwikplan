export interface PlanResult {
  strategy: string
  hook: string
  script: string
  caption?: string
  cta: string
  proTip?: string
  bestPostTime?: string
  hashtags?: string
  schedule?: PlanResultSchedule
}

export interface PlanResultSchedule {
  scenes?: string[]
  spoken?: string[]
  content?: string
}

export interface Strategy {
  id: string
  user_id: string
  niche: string
  platform: Platform
  goal: Goal
  strategy_text: string
  schedule: string[] | PlanResult[]
  hashtags: string | null
  created_at: string
}

export type Platform = 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'youtube'
export type Goal = 'sales' | 'brand' | 'engagement' | 'leads'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

export interface GenerateRequestBody {
  niche: string
  audience?: string
  platform: Platform
  goal: Goal
  isDemo?: boolean
}

export interface FeedbackRequestBody {
  userId: string
  feedbackText: string
  niche?: string
  platform?: string
  rating?: number
}

export interface UserProfile {
  id: string
  user_id: string
  plan_usage: number
  monthly_limit: number
  plan_type: 'free' | 'pro' | 'enterprise'
  created_at: string
  updated_at: string
}

export interface UserStreak {
  id: string
  user_id: string
  current_streak: number
  longest_streak: number
  last_active_at: string
  streak_history: unknown[]
  created_at: string
  updated_at: string
}

export interface RateLimitResult {
  success: boolean
  retryAfter?: number
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  status: number
}

export interface RequestWithProfile extends Request {
  profileId: string
  currentUsage: number
}
