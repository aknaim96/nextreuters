import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ScrollText } from 'lucide-react'
import { RoleSelect } from '@/components/admin/RoleSelect'
import { DeleteUserButton } from '@/components/admin/DeleteUserButton'
import { formatDate } from '@/lib/format-date'

const PAGE_SIZE = 15

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data: users, count } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, subscription_tier, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 w-full">
      <Link
        href="/cms"
        className="inline-flex items-center text-xs font-mono text-gray-500 hover:text-red-600 mb-6 transition-colors"
      >
        <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Return to CMS Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono tracking-widest text-red-600 uppercase">Admin Control Panel</span>
          <h1 className="text-3xl font-serif font-bold mt-1">User Management</h1>
          <p className="text-sm font-mono text-gray-500 mt-2">
            Only admins can view this page, change a user's role, or delete an account.
          </p>
        </div>
        <Link
          href="/admin/audit-log"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-zinc-700 border border-zinc-300 hover:border-black px-3.5 py-2 transition-colors"
        >
          <ScrollText className="w-3.5 h-3.5" /> Audit Log
        </Link>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 uppercase text-xs font-mono text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Tier</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users?.map((u) => {
              const isSelf = u.id === user.id
              const isAdminRow = u.role === 'admin'
              return (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-serif font-medium text-gray-900">{u.full_name || '—'}</td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-700">{u.email}</td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-700 uppercase">{u.subscription_tier}</td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{formatDate(u.created_at)}</td>
                  <td className="px-6 py-4">
                    <RoleSelect userId={u.id} currentRole={u.role} isSelf={isSelf} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!isSelf && !isAdminRow && (
                      <DeleteUserButton userId={u.id} userEmail={u.email} />
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {users?.length === 0 && (
          <p className="px-6 py-8 text-sm font-mono text-gray-500 text-center">No users yet.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-xs font-mono">
          <Link
            href={`/admin/users?page=${page - 1}`}
            className={`px-3 py-1.5 border border-gray-300 ${page <= 1 ? 'pointer-events-none opacity-40' : 'hover:border-black'}`}
          >
            ← Previous
          </Link>
          <span className="text-gray-500">Page {page} of {totalPages} · {count} total</span>
          <Link
            href={`/admin/users?page=${page + 1}`}
            className={`px-3 py-1.5 border border-gray-300 ${page >= totalPages ? 'pointer-events-none opacity-40' : 'hover:border-black'}`}
          >
            Next →
          </Link>
        </div>
      )}
    </div>
  )
}