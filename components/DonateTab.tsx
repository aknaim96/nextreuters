'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'

const PRESET_AMOUNTS = [5, 10, 25, 50]

export function DonateTab() {
  const [selected, setSelected] = useState<number | null>(10)
  const [custom, setCustom] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [thanked, setThanked] = useState(false)

  const amount = custom ? Number(custom) : selected

  const handleDonate = () => {
    if (!amount || amount <= 0 || !agreed) return
    setThanked(true)
  }

  if (thanked) {
    return (
      <div className="text-center space-y-3 py-8">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-600 border border-red-200">
          <Heart className="w-5 h-5" />
        </span>
        <h3 className="font-serif text-xl font-bold">Thank you for your support.</h3>
        <p className="text-xs font-mono text-zinc-500 max-w-sm mx-auto">
          Donation processing isn't wired up to a real payment provider yet — this is a placeholder confirmation.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto space-y-5 text-center">
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-red-600 font-bold">Support the Newsroom</span>
        <h2 className="font-serif text-xl font-bold">Make a Donation</h2>
        <p className="text-xs font-mono text-zinc-500 mt-1">
          Independent journalism runs on reader support.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {PRESET_AMOUNTS.map((preset) => (
          <button
            key={preset}
            onClick={() => {
              setSelected(preset)
              setCustom('')
            }}
            className={`py-2.5 text-sm font-mono font-bold border-2 transition-colors ${
              selected === preset && !custom ? 'border-black bg-black text-white' : 'border-zinc-300 hover:border-black'
            }`}
          >
            ${preset}
          </button>
        ))}
      </div>

      <div>
        <input
          type="number"
          min={1}
          value={custom}
          onChange={(e) => {
            setCustom(e.target.value)
            setSelected(null)
          }}
          placeholder="Custom amount ($)"
          className="w-full text-center text-sm px-3 py-2.5 border-2 border-zinc-300 focus:outline-none focus:border-black"
        />
      </div>

      <div className="text-left bg-zinc-50 border border-zinc-200 p-3 space-y-2">
        <p className="text-[10px] font-mono text-zinc-500 leading-relaxed">
          <span className="font-bold text-zinc-700">Financial & Tax Notice:</span> By clicking pay, you
          acknowledge that your voluntary contribution (one-time or recurring) is a support payment to
          Chronicle Khan to keep our news accessible. ChronicleKhan.ca is an independent commercial business entity
          in Ontario, Canada, and does not hold registered charity or non-profit status. Consequently,
          these payments are not tax-deductible and cannot be used for charitable tax receipts.
          Recurring support can be cancelled at any time through your user dashboard.
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
            <Link href="/privacy" target="_blank" className="text-red-600 underline hover:no-underline">Privacy Policy</Link>.
          </span>
        </label>
      </div>

      <button
        onClick={handleDonate}
        disabled={!amount || amount <= 0 || !agreed}
        className="w-full inline-flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700 py-3 text-xs font-mono uppercase tracking-wider font-bold transition-colors disabled:opacity-40"
      >
        <Heart className="w-3.5 h-3.5" />
        Donate ${amount || 0}
      </button>
    </div>
  )
}