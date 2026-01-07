'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'
import type { Strategy } from '../../../lib/types'
import Link from 'next/link'
import {
  ArrowLeft,
  Trash2,
  Download,
  Filter,
  Calendar,
  Hash,
  Globe,
  Loader2
} from 'lucide-react'

export default function HistoryPage() {
  const router = useRouter()
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'youtube'>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStrategies() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/auth')
          return
        }

        const { data, error } = await supabase
          .from('strategies')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Fetch strategies error:', error)
        } else if (data) {
          setStrategies(data)
        }
      } catch (err) {
        console.error('Unexpected error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStrategies()
  }, [router])

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this strategy?')) {
      return
    }

    setDeletingId(id)
    
    try {
      const { error } = await supabase
        .from('strategies')
        .delete()
        .eq('id', id)

      if (error) {
        alert('Failed to delete strategy')
      } else {
        setStrategies(prev => prev.filter(s => s.id !== id))
      }
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete strategy')
    } finally {
      setDeletingId(null)
    }
  }

  function downloadCSV(strategy: Strategy) {
    let scheduleText = ''
    try {
      const schedule = typeof strategy.schedule === 'string' 
        ? JSON.parse(strategy.schedule) 
        : strategy.schedule
      
      if (Array.isArray(schedule)) {
        scheduleText = schedule.join('\n')
      }
    } catch (err) {
      console.error('Failed to parse schedule:', err)
    }

    const csvContent = [
      ['Component', 'Content'],
      ['Niche', strategy.niche],
      ['Platform', strategy.platform],
      ['Goal', strategy.goal],
      ['Strategy', strategy.strategy_text],
      ['Schedule', scheduleText],
      ['Hashtags', strategy.hashtags || ''],
      ['Created At', new Date(strategy.created_at).toLocaleDateString()],
    ]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${strategy.niche.replace(/\s+/g, '_')}_strategy.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredStrategies = filter === 'all' 
    ? strategies 
    : strategies.filter(s => s.platform === filter)

  const platformColors: Record<string, string> = {
    instagram: 'bg-pink-100 text-pink-700 border-pink-200',
    facebook: 'bg-blue-100 text-blue-700 border-blue-200',
    linkedin: 'bg-blue-100 text-blue-800 border-blue-200',
    twitter: 'bg-sky-100 text-sky-700 border-sky-200',
    youtube: 'bg-red-100 text-red-700 border-red-200',
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-500">Loading your strategies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans">
      {/* Header */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-lg font-bold text-slate-900">Strategy History</h1>
          <div className="w-20" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="mb-8 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-600 mr-2">Filter by platform:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === 'all'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({strategies.length})
              </button>
              {['instagram', 'facebook', 'linkedin', 'twitter', 'youtube'].map(platform => (
                <button
                  key={platform}
                  onClick={() => setFilter(platform as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                    filter === platform
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {platform} ({strategies.filter(s => s.platform === platform).length})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Strategies List */}
        {filteredStrategies.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Hash className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No strategies yet</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              {filter === 'all' 
                ? 'You haven\'t generated any strategies yet. Generate your first strategy to get started!'
                : `No strategies found for ${filter}. Try selecting a different filter.`}
            </p>
            {filter !== 'all' ? (
              <button
                onClick={() => setFilter('all')}
                className="px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
              >
                Show All Strategies
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700 shadow-lg transition-all"
              >
                Generate Your First Strategy
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStrategies.map(strategy => (
              <div
                key={strategy.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all p-6 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${platformColors[strategy.platform]}`}
                      >
                        {strategy.platform}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(strategy.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">
                      {strategy.niche}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                      {strategy.strategy_text}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(strategy.id)}
                    disabled={deletingId === strategy.id}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    title="Delete strategy"
                  >
                    {deletingId === strategy.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => downloadCSV(strategy)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <Link
                    href={`/dashboard?regenerate=${strategy.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md transition-all text-center"
                  >
                    <Globe className="w-4 h-4" />
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
