'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateUserRoleAction } from '@/app/actions/admin'

export function RoleSelect({
  userId,
  currentRole,
  isSelf,
}: {
  userId: string
  currentRole: string
  isSelf: boolean
}) {
  const [role, setRole] = useState(currentRole)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const router = useRouter()

  if (isSelf) {
    return (
      <span className="text-xs font-mono uppercase text-zinc-400" title="You can't change your own role">
        {currentRole} (you)
      </span>
    )
  }

  // Admin status isn't manageable from this UI at all — grant/revoke it
  // directly in the database if that's genuinely needed.
  if (currentRole === 'admin') {
    return (
      <span className="text-xs font-mono uppercase text-red-600 font-bold" title="Admin status can only be changed directly in the database">
        Admin
      </span>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value
    const previousRole = role
    setRole(newRole)
    setError('')

    startTransition(async () => {
      const result = await updateUserRoleAction(userId, newRole)
      if (!result.success) {
        setError(result.error || 'Failed to update role.')
        setRole(previousRole)
      } else {
        // Tells Next.js to re-fetch the Server Component tree so the Audit Log and User list update
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-1">
      <select
        value={role}
        onChange={handleChange}
        disabled={pending}
        className="text-xs font-mono uppercase border border-zinc-300 px-2 py-1.5 focus:outline-none focus:border-black disabled:opacity-50"
      >
        <option value="reader">Reader</option>
        <option value="author">Author</option>
        <option value="editor">Editor</option>
      </select>
      {error && <p className="text-[10px] text-red-600 font-mono">{error}</p>}
    </div>
  )
}