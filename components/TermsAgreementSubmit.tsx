'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useFormStatus } from 'react-dom'

interface TermsAgreementSubmitProps {
  idleLabel: string
  pendingLabel: string
  variant?: 'primary' | 'accent'
}

export function TermsAgreementSubmit({ idleLabel, pendingLabel, variant = 'primary' }: TermsAgreementSubmitProps) {
  const { pending } = useFormStatus()
  const [agreed, setAgreed] = useState(false)

  const colorClass = variant === 'accent' ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-red-600'

  return (
    <div className="space-y-3">
      <label className="flex items-start gap-2 text-[11px] font-mono text-zinc-600 cursor-pointer">
        <input
          type="checkbox"
          name="agreedToTerms"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-3.5 w-3.5 accent-red-600"
        />
        <span>
          I have read and agree to the{' '}
          <Link href="/terms" target="_blank" className="text-red-600 underline hover:no-underline">Terms of Service</Link>{' '}
          and{' '}
          <Link href="/privacy" target="_blank" className="text-red-600 underline hover:no-underline">Privacy Policy</Link>.
        </span>
      </label>

      <button
        type="submit"
        disabled={pending || !agreed}
        className={`w-full text-white py-3 text-xs font-mono uppercase tracking-wider font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${colorClass}`}
      >
        {pending ? pendingLabel : idleLabel}
      </button>
    </div>
  )
}