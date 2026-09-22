'use client'

import { useState, useTransition } from 'react'
import { Trash2, AlertTriangle } from 'lucide-react'
import { deleteUserAction } from '@/app/actions/admin'

export function DeleteUserButton({ userId, userEmail }: { userId: string; userEmail: string }) {
  const [confirming, setConfirming] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [error, setError] = useState('')
  const [pending, startTransition] = useTransition()

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 px-2 py-1 transition-colors"
      >
        <Trash2 className="w-3 h-3" />
        Delete
      </button>
    )
  }

  const canConfirm = confirmText === userEmail

  const handleDelete = () => {
    if (!canConfirm) return
    setError('')
    startTransition(async () => {
      const result = await deleteUserAction(userId)
      if (!result.success) {
        setError(result.error || 'Failed to delete account.')
      }
    })
  }

  return (
    <div className="bg-red-50 border border-red-300 p-2 space-y-1.5 w-56">
      <p className="text-[10px] font-mono text-red-700 flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" /> This cannot be undone.
      </p>
      <p className="text-[10px] font-mono text-zinc-600">
        Type <span className="font-bold">{userEmail}</span> to confirm.
      </p>
      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder="Enter email"
        className="w-full text-[10px] font-mono border border-zinc-300 px-1.5 py-1 focus:outline-none focus:border-red-600"
      />
      <div className="flex gap-1">
        <button
          onClick={handleDelete}
          disabled={!canConfirm || pending}
          className="flex-1 text-[10px] font-mono uppercase font-bold text-white bg-red-600 hover:bg-red-700 px-2 py-1 disabled:opacity-40 transition-colors"
        >
          {pending ? 'Deleting…' : 'Confirm'}
        </button>
        <button
          onClick={() => {
            setConfirming(false)
            setConfirmText('')
            setError('')
          }}
          className="flex-1 text-[10px] font-mono uppercase font-bold text-zinc-600 border border-zinc-300 hover:border-black px-2 py-1 transition-colors"
        >
          Cancel
        </button>
      </div>
      {error && <p className="text-[10px] text-red-700 font-mono">{error}</p>}
    </div>
  )
}