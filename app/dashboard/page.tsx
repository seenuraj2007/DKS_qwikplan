'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

// --- IMPORT COMPONENTS ---
import UsageCard from '../../app/components/UsageCard'
import ResultModal from '../../app/components/ResultModal'
import WelcomeAnimation from '../../app/components/WelcomeAnimation'

import Link from 'next/link'
import {
  ArrowRight,
  Zap,
  CheckCircle2,
  Globe,
  Users,
  Target,
  TrendingUp,
  Loader2,
  LogOut,
  History,
  Download,
  FileText,
  X
} from 'lucide-react'

interface PlanResult {
  strategy: string
  proTip?: string
  bestPostTime?: string
  schedule: string[]
  hashtags?: string
}

interface Toast {
  show: boolean
  msg: string
  type: 'success' | 'error'
}

interface HistoryItem {
  id: number
  user_id: string
  niche: string
  platform: string
  goal: string
  strategy_text: string
  schedule: string[]
  hashtags: string
  created_at: string
}

export default function Dashboard() {
  const router = useRouter()

  // --- User Info State ---
  const [userEmail, setUserEmail] = useState('')
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  // --- Tool State ---
  const [niche, setNiche] = useState('')
  const [audience, setAudience] = useState('')
  const [platform, setPlatform] = useState('instagram')
  const [goal, setGoal] = useState('sales')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PlanResult | null>(null)

  // --- Pop-up Modal State ---
  const [showModal, setShowModal] = useState(false)

  // --- Toast Notification State ---
  const [toast, setToast] = useState<Toast>({ show: false, msg: '', type: 'success' })

  // --- Real Usage States ---
  const [realUsage, setRealUsage] = useState(0)
  const [realLimit, setRealLimit] = useState(50)

  // --- Usage Ref ---
  const usageRef = useRef(0)

  // --- History States ---
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  // 1. Check Session
  useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          router.push('/')
          return
        } else {
          setUserEmail(session.user.email ?? '')
          setUserId(session.user.id)

          const { data: profiles, error } = await supabase
            .from('profiles')
            .select('id, plan_usage, monthly_limit')
            .eq('user_id', session.user.id)

          if (error) {
            console.error("DB Fetch Error:", error.message)
            setRealUsage(usageRef.current)
          } else {
            if (profiles && profiles.length > 0) {
              const profile = profiles[0]
              const usageValue = profile.plan_usage || 0
              const limitValue = profile.monthly_limit || 50
              setRealUsage(usageValue)
              setRealLimit(limitValue)
              usageRef.current = usageValue
            } else {
              setRealUsage(0)
              setRealLimit(50)
              usageRef.current = 0
            }
          }
        }
      } catch (err) {
        console.error('Session Check Exception:', err)
        setRealUsage(usageRef.current)
      } finally {
        setTimeout(() => {
          setLoadingAuth(false)
        }, 1500)
      }
    }
    checkSession()
  }, [router])

  // 2. Fetch History (Updated to limit to 1 week)
  useEffect(() => {
    async function fetchHistory() {
      if (!userId) return
      setLoadingHistory(true)
      
      // Calculate date: 1 week ago (7 days * 24 hours * 60 mins * 60 secs * 1000 ms)
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

      const { data, error } = await supabase
        .from('strategies')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .gt('created_at', oneWeekAgo.toISOString()) // <--- KEY CHANGE: Only fetch items newer than 1 week ago
        // .limit(5) // Optional: Keep limit(5) as a safety net, though the date filter handles it

      if (data) {
        setHistory(data as HistoryItem[])
      } else {
        console.error("History Fetch Error:", error)
      }
      setLoadingHistory(false)
    }
    fetchHistory()
  }, [userId])

  // Show WelcomeAnimation while loading
  if (loadingAuth) {
    return <WelcomeAnimation />
  }

  // 3. Toast Helper
  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ show: true, msg: message, type })
    setTimeout(() => {
      setToast({ show: false, msg: '', type })
    }, 3000)
  }

  // 4. Logout
  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  // 5. CSV Export Function
  function downloadCSV(data: PlanResult, name: string) {
    if (!data.schedule) return

    // Create CSV Header
    const csvContent = [
      ["Day", "Content Idea"],
      ...data.schedule.map((day: string) => {
        const parts = day.split(':')
        return [parts[0], parts.slice(1).join(':') || parts[0]]
      })
    ]
    .map(e => e.join(","))
    .join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${name.replace(/\s+/g, '_')}_plan.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('CSV Downloaded successfully!', 'success')
  }

  // 6. Generate Plan
  async function handleGenerate() {
    if (!niche.trim()) {
      showToast('Please enter your business niche', 'error')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token
      
      if (!accessToken) {
        showToast('Session expired. Please log in again.', 'error')
        router.push('/auth')
        return
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          niche,
          audience,
          platform,
          goal,
        }),
      })

      if (!res.ok) {
        let errorData: Record<string, unknown> = {}
        try {
          errorData = await res.json()
        } catch { errorData = {} }

        showToast((errorData.error as string) || 'Something went wrong', 'error')

        if (res.status === 401) {
          router.push('/auth')
        }
        return
      }

      const data = await res.json()
      setResult(data)
      setShowModal(true)
      showToast('Marketing Plan Generated Successfully!', 'success')

      // Refresh History
      const { data: newHistory } = await supabase
        .from('strategies')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)
      if (newHistory) setHistory(newHistory as HistoryItem[])

      // Update Local Usage
      const newUsage = realUsage + 1
      setRealUsage(newUsage)
      usageRef.current = newUsage
      setRealLimit(realLimit)

    } catch (err) {
      console.error('Fetch error:', err)
      showToast('Network error.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // 7. Render
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans relative">

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-[100] px-6 py-4 rounded-xl shadow-2xl font-medium text-white transition-all duration-300 transform animate-bounce-in flex items-center gap-3 min-w-[320px] border border-white/10 backdrop-blur-md ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'}`}>
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <X className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-all duration-300">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="text-slate-900 group-hover:text-emerald-600 transition-colors">DKS QwikPlan</span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-slate-600">{realUsage}/{realLimit} Credits</span>
            </div>

            <div className="hidden md:block text-sm font-medium text-slate-500">
              {userEmail}
            </div>
            
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Sidebar (Usage + History) */}
          <div className="lg:col-span-3 space-y-6">
            <UsageCard
              userEmail={userEmail}
              usage={realUsage}
              limit={realLimit}
            />
            
            {/* NEW: History Section */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <History className="w-4 h-4 text-emerald-600" />
                    Recent Strategies
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Your saved library</p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {loadingHistory ? (
                  <div className="text-center text-sm text-slate-400 py-4">Loading...</div>
                ) : history.length === 0 ? (
                  <div className="text-center text-sm text-slate-400 py-10">
                     <FileText className="w-8 h-8 mx-auto mb-2 opacity-20" />
                     No strategies yet.
                  </div>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors group cursor-default">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded-full">
                          {item.platform}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mb-1 truncate">
                        {item.niche}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                        {item.strategy_text}
                      </p>
                      
                      {/* Quick Actions for History Item */}
                      <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                             setResult({
                               strategy: item.strategy_text,
                               schedule: item.schedule,
                               hashtags: item.hashtags
                             })
                             setShowModal(true)
                          }}
                          className="flex-1 bg-white border border-slate-200 text-xs font-semibold py-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => downloadCSV({
                             strategy: item.strategy_text,
                             schedule: item.schedule,
                             hashtags: item.hashtags
                          }, item.niche)}
                          className="flex-1 bg-white border border-slate-200 text-xs font-semibold py-1.5 rounded hover:bg-slate-100 text-slate-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <Download className="w-3 h-3" /> CSV
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Generator Tool */}
          <div className="lg:col-span-9 space-y-8 animate-fade-in-up">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Your Strategy</h1>
              <p className="text-slate-500 mt-2">Fill in the details below and let our AI build your content calendar.</p>
            </div>

            {/* Main Generator Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
              
              {/* Decorative Top Bar */}
              <div className="h-2 w-full bg-gradient-to-r from-emerald-500 to-teal-600"></div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Section 1: Business Context */}
                  <div className="space-y-6 md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                        <Target className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg font-bold text-slate-900">1. Business Profile</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">Your Niche / Business</label>
                        <div className="relative">
                          <input
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm hover:bg-white"
                            placeholder="e.g. Boutique Coffee Shop"
                            value={niche}
                            onChange={e => setNiche(e.target.value)}
                          />
                          <Globe className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">Target Audience</label>
                        <div className="relative">
                          <input
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm hover:bg-white"
                            placeholder="e.g. IT Professionals"
                            value={audience}
                            onChange={e => setAudience(e.target.value)}
                          />
                          <Users className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Campaign Settings */}
                  <div className="space-y-6 md:col-span-2 border-t border-slate-100 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 bg-teal-100 text-teal-700 rounded-lg">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg font-bold text-slate-900">2. Campaign Settings</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">Primary Platform</label>
                        <div className="relative">
                          <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm hover:bg-white appearance-none cursor-pointer"
                            value={platform} onChange={e => setPlatform(e.target.value)}
                          >
                            <option value="instagram">Instagram</option>
                            <option value="facebook">Facebook</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="twitter">Twitter / X</option>
                            <option value="youtube">YouTube</option>
                          </select>
                          {/* Custom Arrow */}
                          <div className="absolute right-4 top-3.5 pointer-events-none text-slate-500">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                          </div>
                          {/* Placeholder Icon */}
                          <Globe className="absolute left-3 top-3.5 text-slate-400 w-5 h-5 opacity-50" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">Main Goal</label>
                        <div className="relative">
                          <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm hover:bg-white appearance-none cursor-pointer"
                            value={goal} onChange={e => setGoal(e.target.value)}
                          >
                            <option value="sales">Drive Sales</option>
                            <option value="brand">Brand Awareness</option>
                            <option value="engagement">Boost Engagement</option>
                            <option value="leads">Generate Leads</option>
                          </select>
                          <div className="absolute right-4 top-3.5 pointer-events-none text-slate-500">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                          </div>
                          <Target className="absolute left-3 top-3.5 text-slate-400 w-5 h-5 opacity-50" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <div className="md:col-span-2 pt-4">
                    <button
                      onClick={handleGenerate}
                      disabled={loading}
                      className={`w-full h-14 rounded-xl text-white font-bold text-base uppercase tracking-wide transition-all duration-300 transform flex items-center justify-center gap-2 ${
                        loading
                          ? 'bg-slate-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-[1.01]'
                      }`}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Generating Strategy...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Generate Marketing Plan
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-3">
                      This will use 1 credit from your monthly limit.
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Component */}
      {/* Passing onDownload prop to allow CSV export from the modal */}
      {userId && (
        <ResultModal
          showModal={showModal}
          result={result}
          niche={niche}
          platform={platform}
          showToast={showToast}
          onClose={() => setShowModal(false)}
          userId={userId}
          userEmail={userEmail}
          onDownload={(data) => downloadCSV(data, niche)}
        />
      )}
      
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.9); }
          50% { transform: scale(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounceIn 0.4s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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