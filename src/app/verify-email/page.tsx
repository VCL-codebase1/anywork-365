'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { sendVerificationEmail, reloadUser } from '@/lib/firebase/auth'
import { useCurrentUser } from '@/hooks/useCurrentUser'

export default function VerifyEmailPage() {
  const router = useRouter()
  const { user, loading } = useCurrentUser()
  const [resent, setResent] = useState(false)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')
  const [polling, setPolling] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!polling) return
    const interval = setInterval(async () => {
      const { emailVerified } = await reloadUser()
      if (emailVerified) {
        setPolling(false)
        router.push('/dashboard')
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [polling, router])

  async function handleResend() {
    setError('')
    const { error: err } = await sendVerificationEmail()
    if (err) {
      setError(err)
    } else {
      setResent(true)
      setPolling(true)
    }
  }

  async function handleCheckNow() {
    setChecking(true)
    setError('')
    const { emailVerified, error: err } = await reloadUser()
    setChecking(false)
    if (err) {
      setError(err)
      return
    }
    if (emailVerified) {
      router.push('/dashboard')
    } else {
      setError('Email not verified yet. Please check your inbox and click the link.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-dvh bg-ui-bg flex items-center justify-center">
        <p className="text-text-secondary">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-ui-bg flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 text-6xl">✉️</div>

        <div className="card">
          <h1 className="font-display text-xl sm:text-2xl font-semibold text-center mb-1">Verify your email</h1>
          <p className="text-sm text-text-secondary text-center mt-3 mb-2 leading-relaxed">
            We sent a verification email to <strong className="text-text-primary">{user?.email}</strong>
          </p>
          <p className="text-sm text-text-secondary text-center mb-6">
            Click the link in the email to activate your account.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          {resent && (
            <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl mb-5">
              Verification email resent. Check your inbox.
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleCheckNow}
              disabled={checking}
              className="btn-primary w-full py-3 text-base justify-center"
            >
              {checking ? 'Checking...' : 'I\'ve verified, continue →'}
            </button>

            <button
              onClick={handleResend}
              className="w-full py-3 text-sm text-brand-primary font-medium bg-transparent border border-ui-border rounded-xl hover:bg-ui-bg transition-colors"
            >
              Resend verification email
            </button>
          </div>

          <p className="text-xs text-text-secondary text-center mt-6">
            Didn&apos;t receive the email? Check your spam folder.
          </p>
        </div>
      </div>
    </div>
  )
}
