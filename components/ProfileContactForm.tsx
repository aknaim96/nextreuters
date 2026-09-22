'use client'

import { useActionState } from 'react'
import { updateProfileAction } from '@/app/actions/profile'
import { Save } from 'lucide-react'

interface ProfileContactFormProps {
  fullName: string
  phoneNumber: string
  country: string
  stateProvince: string
}

const initialState = { success: false, error: '' }

export function ProfileContactForm({ fullName, phoneNumber, country, stateProvince }: ProfileContactFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState)

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 p-3 text-xs font-mono text-red-700">{state.error}</div>
      )}
      {state?.success && (
        <div className="bg-green-50 border border-green-200 p-3 text-xs font-mono text-green-700">Contact info updated.</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">Full Name</label>
          <input
            name="fullName"
            type="text"
            required
            defaultValue={fullName}
            className="w-full text-sm px-3 py-2 bg-white border border-zinc-300 focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">Phone Number</label>
          <input
            name="phoneNumber"
            type="tel"
            defaultValue={phoneNumber}
            placeholder="Optional"
            className="w-full text-sm px-3 py-2 bg-white border border-zinc-300 focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">Country</label>
          <input
            name="country"
            type="text"
            defaultValue={country}
            placeholder="Optional"
            className="w-full text-sm px-3 py-2 bg-white border border-zinc-300 focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">State / Province</label>
          <input
            name="stateProvince"
            type="text"
            defaultValue={stateProvince}
            placeholder="Optional"
            className="w-full text-sm px-3 py-2 bg-white border border-zinc-300 focus:outline-none focus:border-black"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 bg-black text-white hover:bg-red-600 px-5 py-2.5 text-xs font-mono uppercase tracking-wider font-bold transition-colors disabled:opacity-50"
      >
        {isPending ? 'Saving…' : 'Save Contact Info'}
        <Save className="w-3.5 h-3.5" />
      </button>
    </form>
  )
}