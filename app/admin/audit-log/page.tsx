import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { formatAuditTimestamp } from '@/lib/format-date'

const PAGE_SIZE = 20

export default async function AdminAuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
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

  const { data: logs, count } = await supabase
    .from('admin_audit_log')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 w-full">
      <Link
        href="/admin/users"
        className="inline-flex items-center text-xs font-mono text-gray-500 hover:text-red-600 mb-6 transition-colors"
      >
        <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Return to User Management
      </Link>

      <div className="mb-8">
        <span className="text-xs font-mono tracking-widest text-red-600 uppercase">Admin Control Panel</span>
        <h1 className="text-3xl font-serif font-bold mt-1">Audit Log</h1>
        <p className="text-sm font-mono text-gray-500 mt-2">
          A permanent record of every role change and account deletion performed by an admin.
        </p>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 uppercase text-xs font-mono text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">When</th>
              <th className="px-6 py-4">Admin</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Target</th>
              <th className="px-6 py-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs?.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-xs text-gray-500">
                  {formatAuditTimestamp(log.created_at)}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-gray-700">{log.actor_email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 font-bold ${
                      log.action === 'account_delete' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {log.action === 'account_delete' ? 'Deleted Account' : 'Changed Role'}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-gray-700">{log.target_email}</td>
                <td className="px-6 py-4 font-mono text-xs text-gray-500">
                  {log.details?.from && log.details?.to ? `${log.details.from} → ${log.details.to}` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs?.length === 0 && (
          <p className="px-6 py-8 text-sm font-mono text-gray-500 text-center">No admin actions recorded yet.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-xs font-mono">
          <Link
            href={`/admin/audit-log?page=${page - 1}`}
            className={`px-3 py-1.5 border border-gray-300 ${page <= 1 ? 'pointer-events-none opacity-40' : 'hover:border-black'}`}
          >
            ← Previous
          </Link>
          <span className="text-gray-500">
            Page {page} of {totalPages} · {count} total
          </span>
          <Link
            href={`/admin/audit-log?page=${page + 1}`}
            className={`px-3 py-1.5 border border-gray-300 ${page >= totalPages ? 'pointer-events-none opacity-40' : 'hover:border-black'}`}
          >
            Next →
          </Link>
        </div>
      )}
    </div>
  )
}