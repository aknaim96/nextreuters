'use client'

import { useFormStatus } from 'react-dom'

interface SubmitButtonProps {
  idleLabel: string
  pendingLabel: string
  variant?: 'primary' | 'accent'
}

export function SubmitButton({ idleLabel, pendingLabel, variant = 'primary' }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  const colorClass = variant === 'accent' ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-red-600'

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full text-white py-3 text-xs font-mono uppercase tracking-wider font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${colorClass}`}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  )
}