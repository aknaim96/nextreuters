'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Crown, Award, Radio, Check } from 'lucide-react'
import { updateTierAction } from '@/app/actions/profile'
import { TIER_PRICING } from '@/lib/pricing'

interface TierSelectorProps {
  currentTier: string
  isAuthenticated: boolean
}

export function TierSelector({ currentTier, isAuthenticated }: TierSelectorProps) {
  const [pending, startTransition] = useTransition()
  const [pendingTier, setPendingTier] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [agreed, setAgreed] = useState(false)

  const handleSelect = (tier: 'none' | 'silver' | 'gold') => {
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }
    if (tier !== 'none' && !agreed) return
    setPendingTier(tier)
    setMessage('')
    startTransition(async () => {
      const result = await updateTierAction(tier)
      if (result?.success) {
        setMessage(tier === 'none' ? 'Switched to free access.' : `Switched to ${tier} tier.`)
      } else {
        setMessage(result?.error || 'Something went wrong.')
      }
      setPendingTier(null)
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
        {/* None / Free */}
        <div
          className={`relative flex flex-col border-2 border-t-4 border-t-zinc-400 p-5 items-center text-center gap-2 ${
            currentTier === 'none' ? 'border-black border-t-zinc-400' : 'border-zinc-200'
          }`}
        >
          {currentTier === 'none' && (
            <span className="absolute top-2 right-2 text-black">
              <Check className="w-4 h-4" />
            </span>
          )}
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-700 ring-2 ring-zinc-200">
            <Radio className="w-4 h-4 text-zinc-100" />
          </span>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold">Free Wire</span>
          <span className="font-serif text-2xl font-black">$0</span>
          <p className="text-[11px] text-zinc-500 font-mono flex-1">Public articles only</p>
          <button
            onClick={() => handleSelect('none')}
            disabled={pending || currentTier === 'none'}
            className="mt-2 w-full text-xs font-mono uppercase tracking-wider py-2 border border-zinc-300 hover:border-black transition-colors disabled:opacity-40"
          >
            {pending && pendingTier === 'none' ? 'Switching…' : currentTier === 'none' ? 'Current Plan' : 'Switch to Free'}
          </button>
        </div>

        {/* Silver */}
        <div
          className={`relative flex flex-col border-2 border-t-4 border-t-slate-400 p-5 items-center text-center gap-2 bg-gradient-to-b from-slate-50 to-white ${
            currentTier === 'silver' ? 'border-slate-500' : 'border-slate-300'
          }`}
        >
          {currentTier === 'silver' && (
            <span className="absolute top-2 right-2 text-slate-600">
              <Check className="w-4 h-4" />
            </span>
          )}
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-600 ring-2 ring-slate-200">
            <Award className="w-4 h-4 text-slate-100" />
          </span>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-600 font-bold">Silver</span>
          <span className="font-serif text-2xl font-black">
            ${TIER_PRICING.silver.monthly}
            <span className="text-xs font-mono text-zinc-400"> / mo</span>
          </span>
          <p className="text-[11px] text-zinc-500 font-mono flex-1">Access to Silver-tier dossiers</p>
          <button
            onClick={() => handleSelect('silver')}
            disabled={pending || currentTier === 'silver' || !agreed}
            className="mt-2 w-full text-xs font-mono uppercase tracking-wider py-2 bg-slate-600 text-white hover:bg-slate-700 transition-colors disabled:opacity-40"
          >
            {pending && pendingTier === 'silver' ? 'Switching…' : currentTier === 'silver' ? 'Current Plan' : 'Choose Silver'}
          </button>
        </div>

        {/* Gold */}
        <div
          className={`relative flex flex-col border-2 border-t-4 border-t-amber-400 p-5 items-center text-center gap-2 bg-gradient-to-b from-amber-50 to-white ${
            currentTier === 'gold' ? 'border-amber-500' : 'border-amber-300'
          }`}
        >
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[9px] font-mono uppercase tracking-widest font-bold px-2 py-0.5 rounded-full shadow-sm">
            Most Popular
          </span>
          {currentTier === 'gold' && (
            <span className="absolute top-2 right-2 text-amber-600">
              <Check className="w-4 h-4" />
            </span>
          )}
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-600 ring-2 ring-amber-200 mt-1">
            <Crown className="w-4 h-4 text-amber-100" />
          </span>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-700 font-bold">Gold</span>
          <span className="font-serif text-2xl font-black">
            ${TIER_PRICING.gold.monthly}
            <span className="text-xs font-mono text-zinc-400"> / mo</span>
          </span>
          <p className="text-[11px] text-zinc-500 font-mono flex-1">Full access to every dossier</p>
          <button
            onClick={() => handleSelect('gold')}
            disabled={pending || currentTier === 'gold' || !agreed}
            className="mt-2 w-full text-xs font-mono uppercase tracking-wider py-2 bg-amber-600 text-white hover:bg-amber-700 transition-colors disabled:opacity-40"
          >
            {pending && pendingTier === 'gold' ? 'Switching…' : currentTier === 'gold' ? 'Current Plan' : 'Choose Gold'}
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto text-left bg-zinc-50 border border-zinc-200 p-3 space-y-2">
        <p className="text-[10px] font-mono text-zinc-500 leading-relaxed">
          <span className="font-bold text-zinc-700">Financial & Tax Notice:</span> Paid tiers are
          recurring monthly support payments to CHRONICLE KHAN, not charitable contributions.
          ChronicleKhan.ca is a commercial business entity in Ontario, Canada, and is not a registered
          charity or non-profit, so these payments are not tax-deductible. Recurring support can be
          cancelled at any time through your account dashboard.
        </p>
        <label className="flex items-start gap-2 text-[11px] font-mono text-zinc-700 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 accent-red-600"
          />
          <span>
            I have read and agree to the{' '}
            <Link href="/terms" target="_blank" className="text-red-600 underline hover:no-underline">Terms of Service</Link>{' '}
            and{' '}
            <Link href="/privacy" target="_blank" className="text-red-600 underline hover:no-underline">Privacy Policy</Link>{' '}
            (required for Silver or Gold).
          </span>
        </label>
      </div>

      {message && <p className="text-center text-xs font-mono text-zinc-600">{message}</p>}
      <p className="text-center text-[10px] font-mono text-zinc-400">
        Self-serve tier switch for now — no payment is charged yet.
      </p>
    </div>
  )
}