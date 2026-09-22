import Link from 'next/link'

export function Pagination({
  page,
  totalPages,
  buildHref,
  count,
}: {
  page: number
  totalPages: number
  buildHref: (page: number) => string
  count?: number
}) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-between items-center mt-8 text-xs font-mono">
      <Link
        href={buildHref(page - 1)}
        className={`px-3 py-1.5 border border-zinc-300 ${page <= 1 ? 'pointer-events-none opacity-40' : 'hover:border-black'}`}
      >
        ← Previous
      </Link>
      <span className="text-zinc-500">
        Page {page} of {totalPages}
        {typeof count === 'number' ? ` · ${count} total` : ''}
      </span>
      <Link
        href={buildHref(page + 1)}
        className={`px-3 py-1.5 border border-zinc-300 ${page >= totalPages ? 'pointer-events-none opacity-40' : 'hover:border-black'}`}
      >
        Next →
      </Link>
    </div>
  )
}