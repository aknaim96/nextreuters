'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Send, Lock } from 'lucide-react'

const INQUIRY_EMAIL = 'ahmed.nk19@gmail.com'

interface InquiryFormProps {
  userEmail: string | null
  userName: string | null
}

export function InquiryForm({ userEmail, userName }: InquiryFormProps) {
  const [message, setMessage] = useState('')

  if (!userEmail) {
    return (
      <div className="flex flex-col items-center text-center gap-3 py-6">
        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-200 text-zinc-500">
          <Lock className="w-4 h-4" />
        </span>
        <p className="text-xs font-mono text-zinc-600 max-w-xs">
          Sign in to send a direct inquiry to the editorial team.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 bg-black text-white hover:bg-red-600 px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold transition-colors"
        >
          Sign In
        </Link>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const bodyLines = [
      `From: ${userName || 'Registered user'} <${userEmail}>`,
      '',
      message,
    ]

    const subject = encodeURIComponent('Editorial Inquiry — CHRONICLE KHAN')
    const body = encodeURIComponent(bodyLines.join('\n'))

    window.location.href = `mailto:${INQUIRY_EMAIL}?subject=${subject}&body=${body}`
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-[10px] font-mono text-zinc-500">
        Sending as <span className="font-bold text-zinc-700">{userEmail}</span>
      </p>
      <textarea
        required
        rows={4}
        minLength={10}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Requests, suggestions, or comments for the editorial team (min 10 characters) *"
        className="w-full border border-zinc-300 bg-white p-2.5 text-xs font-mono focus:border-black focus:outline-none resize-none"
      />
      <button
        type="submit"
        className="w-full bg-black text-white hover:bg-red-600 py-2.5 text-xs font-mono uppercase tracking-wider font-bold transition-colors inline-flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
      >
        <span>Send Inquiry</span>
        <Send className="w-3.5 h-3.5" />
      </button>
    </form>
  )
}