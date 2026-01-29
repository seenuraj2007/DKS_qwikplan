import { SupabaseClient } from '@supabase/supabase-js'

export interface CreateFeedbackInput {
  userId: string
  rating?: number
  feedbackText: string
  niche?: string
  platform?: string
}

export interface FeedbackStats {
  total: number
  averageRating: number
  byPlatform: Record<string, { count: number; avgRating: number }>
}

export class FeedbackService {
  constructor(private supabase: SupabaseClient) {}

  async createFeedback(input: CreateFeedbackInput): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase.from('feedback').insert({
      user_id: input.userId,
      rating: input.rating,
      feedback_text: input.feedbackText,
      niche: input.niche,
      platform: input.platform
    })

    if (error) {
      console.error('Error creating feedback:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  async getUserFeedback(userId: string): Promise<{ data: unknown[]; error?: string }> {
    const { data, error } = await this.supabase
      .from('feedback')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user feedback:', error)
      return { data: [], error: error.message }
    }

    return { data }
  }

  async getFeedbackStats(): Promise<FeedbackStats | null> {
    const { data, error } = await this.supabase
      .from('feedback')
      .select('rating, platform')

    if (error) {
      console.error('Error fetching feedback stats:', error)
      return null
    }

    if (!data || data.length === 0) {
      return {
        total: 0,
        averageRating: 0,
        byPlatform: {}
      }
    }

    const total = data.length
    const averageRating = data.reduce((sum, item) => sum + (item.rating || 0), 0) / total

    const byPlatform: Record<string, { count: number; avgRating: number }> = {}

    for (const item of data) {
      const platform = item.platform || 'other'
      if (!byPlatform[platform]) {
        byPlatform[platform] = { count: 0, avgRating: 0 }
      }
      byPlatform[platform].count++
      byPlatform[platform].avgRating += item.rating || 0
    }

    for (const platform in byPlatform) {
      byPlatform[platform].avgRating = byPlatform[platform].avgRating / byPlatform[platform].count
    }

    return {
      total,
      averageRating: Math.round(averageRating * 10) / 10,
      byPlatform
    }
  }

  async deleteFeedback(feedbackId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase
      .from('feedback')
      .delete()
      .eq('id', feedbackId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting feedback:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }
}
