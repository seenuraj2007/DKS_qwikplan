'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'
import { useToast } from '../../contexts/ToastContext'
import Link from 'next/link'
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Trash2,
  Shield,
  CheckCircle2,
  X,
  Loader2,
  LogOut,
  AlertTriangle
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const { showToast } = useToast()
  
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState<string>('')
  
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deletingAccount, setDeletingAccount] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/auth')
          return
        }

        setUserEmail(session.user.email || '')
        setUserId(session.user.id)
      } catch (err) {
        console.error('Fetch user error:', err)
        showToast('Failed to load user data', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router, showToast])

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()

    if (newPassword !== confirmNewPassword) {
      showToast('New passwords do not match', 'error')
      return
    }

    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error')
      return
    }

    setChangingPassword(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        showToast(error.message || 'Failed to update password', 'error')
      } else {
        showToast('Password updated successfully!', 'success')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmNewPassword('')
        setShowPasswordForm(false)
      }
    } catch (err) {
      console.error('Password change error:', err)
      showToast('An error occurred. Please try again.', 'error')
    } finally {
      setChangingPassword(false)
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirmText !== 'DELETE') {
      showToast('Please type DELETE to confirm', 'error')
      return
    }

    if (!confirm('This action cannot be undone. Are you absolutely sure?')) {
      return
    }

    setDeletingAccount(true)

    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId)

      if (profileError) {
        console.error('Profile delete error:', profileError)
      }

      const { error } = await supabase.rpc('delete_user', {
        user_id: userId
      })

      if (error) {
        console.error('User delete error:', error)
        showToast('Failed to delete account. Contact support.', 'error')
      } else {
        showToast('Account deleted successfully', 'success')
        setTimeout(() => {
          router.push('/')
        }, 1000)
      }
    } catch (err) {
      console.error('Delete account error:', err)
      showToast('An error occurred. Please try again.', 'error')
    } finally {
      setDeletingAccount(false)
      setShowDeleteConfirm(false)
      setDeleteConfirmText('')
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-slate-500">Loading settings...</p>
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
          <h1 className="text-lg font-bold text-slate-900">Settings</h1>
          <div className="w-20" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Account Info Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Account Information</h2>
                <p className="text-sm text-slate-500">Your basic account details</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <Mail className="w-5 h-5 text-slate-400" />
              <div className="flex-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email Address</div>
                <div className="text-slate-900 font-medium">{userEmail}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <User className="w-5 h-5 text-slate-400" />
              <div className="flex-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">User ID</div>
                <div className="text-slate-900 font-mono text-sm">{userId}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
                  <p className="text-sm text-slate-500">Update your password for better security</p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="text-sm font-semibold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-all"
              >
                {showPasswordForm ? 'Cancel' : 'Change'}
              </button>
            </div>
          </div>
          
          {showPasswordForm && (
            <div className="p-6 bg-slate-50/50">
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                    placeholder="Enter your current password"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                    placeholder="Enter new password (min 8 characters)"
                    required
                    minLength={8}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                    placeholder="Confirm new password"
                    required
                    minLength={8}
                  />
                </div>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="w-full h-12 rounded-xl text-white font-bold text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {changingPassword ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Update Password
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border-2 border-red-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-red-100 bg-red-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-xl text-red-600">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-red-900">Danger Zone</h2>
                <p className="text-sm text-red-700">Irreversible account actions</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-1">Delete Your Account</h3>
                  <p className="text-sm text-red-700 leading-relaxed mb-4">
                    This will permanently delete your account and all associated data including your strategies, usage history, and settings. This action cannot be undone.
                  </p>
                  
                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
                    >
                      Delete Account
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-red-900 mb-2">
                          Type <span className="font-mono font-bold">DELETE</span> to confirm
                        </label>
                        <input
                          type="text"
                          value={deleteConfirmText}
                          onChange={e => setDeleteConfirmText(e.target.value)}
                          className="w-full bg-white border border-red-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all font-mono"
                          placeholder="DELETE"
                          autoComplete="off"
                        />
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(false)
                            setDeleteConfirmText('')
                          }}
                          className="flex-1 px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDeleteAccount}
                          disabled={deletingAccount || deleteConfirmText !== 'DELETE'}
                          className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingAccount ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-5 h-5" />
                              Confirm Delete
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
