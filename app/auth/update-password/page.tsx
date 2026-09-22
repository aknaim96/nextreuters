'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { PasswordInput } from '@/components/PasswordInput'
import { KeyRound } from 'lucide-react'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setPending(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setPending(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/login?message=Password updated. Please sign in.'), 1500)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-8 sm:py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 border border-gray-200 shadow-sm">
        <div className="space-y-1">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-600 border border-red-200 mb-2">
            <KeyRound className="h-4 w-4" />
          </span>
          <h2 className="text-2xl font-serif font-bold text-gray-900">Set a New Password</h2>
          <p className="mt-1 text-sm text-gray-600">
            Choose a new password for your account.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-3 text-sm text-red-700 font-mono">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 p-3 text-sm text-green-700 font-mono">
            Password updated. Redirecting to sign in…
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 mb-1">New Password</label>
            <PasswordInput name="password" required placeholder="At least 6 characters" autoComplete="new-password" />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 mb-1">Confirm Password</label>
            <PasswordInput name="confirmPassword" required placeholder="Re-enter password" autoComplete="new-password" />
          </div>

          <button
            type="submit"
            disabled={pending || success}
            className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-colors disabled:opacity-50"
          >
            {pending ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}