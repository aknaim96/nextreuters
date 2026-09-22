'use client'

import { useActionState } from 'react'
import { forgotPasswordAction } from '@/app/actions/auth'
import Link from 'next/link'
import { Mail, ArrowLeft, Send } from 'lucide-react'

const initialState = {
  success: false,
  error: '',
  message: '',
}

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, initialState)

  return (
<div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-8 sm:py-12">      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 border border-gray-200 shadow-sm">
        <div>
          <Link
            href="/login"
            className="inline-flex items-center text-xs font-mono text-gray-500 hover:text-red-600 mb-6 transition-colors"
          >
            <ArrowLeft className="mr-1 h-3 w-3" /> Back to Sign In
          </Link>
          <h2 className="text-2xl font-serif font-bold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Enter your email address and we will send you a secure recovery link.
          </p>
        </div>

        {state?.error && (
          <div className="bg-red-50 border border-red-200 p-3 text-sm text-red-700 font-mono">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="bg-green-50 border border-green-200 p-3 text-sm text-green-700 font-mono">
            {state.message}
          </div>
        )}

        <form action={formAction} className="mt-8 space-y-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail className="h-4 w-4" />
              </span>
              <input
                name="email"
                type="email"
                required
                className="block w-full pl-10 pr-3 py-2 text-sm bg-transparent border border-gray-300 rounded-none text-gray-900 focus:outline-none focus:border-red-600"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-colors disabled:opacity-50"
          >
            {isPending ? 'Sending Link...' : 'Send Recovery Link'}
            <Send className="ml-2 h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  )
}