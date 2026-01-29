import { SupabaseClient } from '@supabase/supabase-js'
import type { UserStreak } from '../types'

export class StreakService {
  constructor(private supabase: SupabaseClient) {}

  async getUserStreak(userId: string): Promise<UserStreak | null> {
    const { data, error } = await this.supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('Error fetching user streak:', error)
      }
      return null
    }

    return data as UserStreak
  }

  async createStreak(userId: string): Promise<UserStreak | null> {
    const { data, error } = await this.supabase
      .from('user_streaks')
      .insert({
        user_id: userId,
        current_streak: 1,
        longest_streak: 1,
        last_active_at: new Date().toISOString(),
        streak_history: [new Date().toISOString()]
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating streak:', error)
      return null
    }

    return data as UserStreak
  }

  async updateStreak(userId: string): Promise<UserStreak | null> {
    const currentStreak = await this.getUserStreak(userId)

    if (!currentStreak) {
      return this.createStreak(userId)
    }

    const now = new Date()
    const lastActive = new Date(currentStreak.last_active_at)
    const daysDiff = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))

    let newCurrentStreak = currentStreak.current_streak
    let newLongestStreak = currentStreak.longest_streak
    const newStreakHistory = [...(currentStreak.streak_history as string[]), now.toISOString()]

    if (daysDiff === 0) {
      return currentStreak
    } else if (daysDiff === 1) {
      newCurrentStreak += 1
      newLongestStreak = Math.max(newCurrentStreak, newLongestStreak)
    } else {
      newCurrentStreak = 1
    }

    const { data, error } = await this.supabase
      .from('user_streaks')
      .update({
        current_streak: newCurrentStreak,
        longest_streak: newLongestStreak,
        last_active_at: now.toISOString(),
        streak_history: newStreakHistory.slice(-30)
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating streak:', error)
      return null
    }

    return data as UserStreak
  }

  async getLeaderboard(limit: number = 10): Promise<UserStreak[]> {
    const { data, error } = await this.supabase
      .from('user_streaks')
      .select('*')
      .order('longest_streak', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching leaderboard:', error)
      return []
    }

    return data as UserStreak[]
  }

  async resetStreak(userId: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase
      .from('user_streaks')
      .update({
        current_streak: 0
      })
      .eq('user_id', userId)

    if (error) {
      console.error('Error resetting streak:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }
}
