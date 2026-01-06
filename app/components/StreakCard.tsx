'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Flame, Crown, Calendar } from 'lucide-react'

interface StreakData {
  current_streak: number
  longest_streak: number
  total_generations: number
  last_active_date: string
}

interface StreakCardProps {
  userId?: string | null
}

export default function StreakCard({ userId }: StreakCardProps) {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const safeUserId = userId || null

    const fetchStreak = async () => {
      if (!safeUserId) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', safeUserId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Streak fetch error:', error)
      }

      setStreak(data || null)
      setLoading(false)
    }

    fetchStreak()
  }, [userId])

  // Guest / loading state
  if (!userId || loading) {
    return (
      <div className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 p-6 rounded-3xl shadow-lg border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-slate-300 rounded-xl flex items-center justify-center">
            <Flame className="w-5 h-5 text-slate-500" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Daily Streak</h3>
            <p className="text-sm text-slate-500">Generate today to start your 🔥 streak</p>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Come back every day and generate at least one script to build your streak.
        </p>
      </div>
    )
  }

  const currentStreak = streak?.current_streak || 0
  const longestStreak = streak?.longest_streak || 0
  const totalDays = streak?.total_generations || 0

  return (
    <div
      className={`
        relative bg-gradient-to-br 
        ${currentStreak >= 7 ? 'from-purple-500 to-pink-600' : 
          currentStreak >= 3 ? 'from-orange-500 to-red-600' : 
          'from-emerald-500 to-teal-600'}
        text-white p-6 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between h-48
      `}
    >
      <div className="flex items-center gap-3 relative z-10">
        <div className="p-2 rounded-xl bg-black/10 shadow-lg">
          <Flame className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg leading-tight">Daily Streak</h3>
          <p className="text-xs opacity-90">Keep generating to keep the fire alive 🔥</p>
        </div>
      </div>

      <div className="space-y-2 relative z-10">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black">{currentStreak}</span>
          <span className="text-sm opacity-80">days</span>
        </div>
        <div className="flex items-center gap-2 text-xs opacity-90">
          <Crown className="w-3 h-3" />
          <span>Best: {longestStreak} days</span>
        </div>
        <div className="flex items-center gap-2 text-xs opacity-80">
          <Calendar className="w-3 h-3" />
          <span>Total active days: {totalDays}</span>
        </div>
      </div>

      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
      <div className="absolute -top-6 -left-10 w-24 h-24 bg-black/10 rounded-full blur-3xl"></div>
    </div>
  )
}
