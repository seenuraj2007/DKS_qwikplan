'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import { useToast } from '../contexts/ToastContext'
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator'
import { Zap, CheckCircle2, X, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AuthPage() {
  const router = useRouter()
  const { showToast } = useToast()
  
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      } else {
        setIsCheckingSession(false)
      }
    }
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push('/dashboard')
      }
    })

    checkSession()
    
    return () => { subscription.unsubscribe() }
  }, [router, showToast])

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    )
  }

  function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    
    setNameError('')
    setEmailError('')
    setPasswordError('')

    if (!isLogin) {
      if (!name.trim()) {
        setNameError('Please enter your name')
        showToast('Please enter your name', 'error')
        return
      }
      if (!validateEmail(email)) {
        setEmailError('Please enter a valid email')
        showToast('Please enter a valid email', 'error')
        return
      }
      if (password.length < 8) {
        setPasswordError('Password must be at least 8 characters')
        showToast('Password must be at least 8 characters', 'error')
        return
      }
      if (password !== confirmPassword) {
        setPasswordError('Passwords do not match')
        showToast('Passwords do not match', 'error')
        return
      }
    } else {
      if (!validateEmail(email)) {
        setEmailError('Please enter a valid email')
        showToast('Please enter a valid email', 'error')
        return
      }
      if (!password.trim()) {
        setPasswordError('Please enter password')
        showToast('Please enter password', 'error')
        return
      }
    }

    setLoading(true)

    try {
      let authError: Error | null = null

      if (isLogin) {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        authError = loginError
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name }
          }
        })
        authError = signUpError
      }

      if (authError) throw authError

      showToast(isLogin ? 'Welcome back!' : 'Account created successfully!', 'success')
      router.push('/dashboard')

    } catch (err) {
      console.error('Auth Error:', err)
      const errorMsg = (err as Error).message || 'Authentication failed'
      showToast(errorMsg, 'error')
      setEmailError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200">
        
        {/* Left Side - Visuals */}
        <div className="md:w-1/2 bg-slate-900 p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <Link href="/" className="mb-6 inline-flex items-center gap-2 text-white hover:text-emerald-400 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2 mt-4">
              {isLogin ? 'Welcome Back!' : 'Start Planning Today'}
            </h1>
            <p className="text-slate-400 text-base leading-relaxed">
              {isLogin
                ? 'Log in to access your marketing dashboard and start generating strategies.'
                : 'Join thousands of small businesses growing with AI-powered marketing.'}
            </p>
          </div>

          <div className="hidden md:block relative z-10">
            <div className="flex gap-6 text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Secure Login</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-500" />
                <span>AI Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="w-5 h-5 text-emerald-500" />
                <span>Instant Setup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 mb-8">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`pb-4 border-b-2 text-sm font-semibold transition-all duration-200 ${
                isLogin ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`pb-4 border-b-2 text-sm font-semibold transition-all duration-200 ml-8 ${
                !isLogin ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {/* Name Field (Signup Only) */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onFocus={() => setNameError('')}
                  className={`w-full bg-slate-50 border-slate-200 border rounded-lg px-4 py-3 text-sm outline-none transition text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${nameError ? 'border-red-500 text-red-900 placeholder-red-300' : ''}`}
                  placeholder="John Doe"
                />
                {nameError && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <X className="w-3 h-3" />
                    {nameError}
                  </p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                  setEmailError('')
                }}
                onBlur={e => {
                  if (e.target.value && !validateEmail(e.target.value)) {
                    setEmailError('Please enter a valid email address')
                  }
                }}
                onFocus={() => setEmailError('')}
                className={`w-full bg-slate-50 border-slate-200 border rounded-lg px-4 py-3 text-sm outline-none transition text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${emailError ? 'border-red-500 text-red-900 placeholder-red-300' : ''}`}
                placeholder="name@company.com"
                autoComplete="email"
              />
              {emailError && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value)
                    setPasswordError('')
                  }}
                  onFocus={() => setPasswordError('')}
                  className={`w-full bg-slate-50 border-slate-200 border rounded-lg px-4 py-3 text-sm outline-none transition pr-10 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${passwordError ? 'border-red-500 text-red-900 placeholder-red-300' : ''}`}
                  placeholder="•••••"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543-7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {passwordError}
                </p>
              )}
            </div>

            {/* Password Strength Indicator (Signup Only) */}
            {!isLogin && password.length > 0 && (
              <PasswordStrengthIndicator password={password} />
            )}

            {/* Confirm Password (Signup Only) */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => {
                    setConfirmPassword(e.target.value)
                    setPasswordError('')
                  }}
                  onFocus={() => setPasswordError('')}
                  className={`w-full bg-slate-50 border-slate-200 border rounded-lg px-4 py-3 text-sm outline-none transition text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${passwordError && confirmPassword && password !== confirmPassword ? 'border-red-500 text-red-900 placeholder-red-300' : ''}`}
                  placeholder="•••••"
                  autoComplete="new-password"
                />
                {passwordError && confirmPassword && password !== confirmPassword && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <X className="w-3 h-3" />
                    Passwords do not match
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl text-white font-bold py-4 shadow-lg transform transition text-sm uppercase tracking-wide ${
                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  {isLogin ? 'Log In' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">OR CONTINUE WITH</span>
            </div>
          </div>

          {/* Demo Account Notice */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex gap-2 text-sm text-emerald-700">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>
                <strong>Free account:</strong> 5 strategy generations per month. No credit card required.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
