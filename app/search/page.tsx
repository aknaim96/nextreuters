import { createClient } from '@/utils/supabase/server'
import { ArticleCardGrid } from '@/components/ArticleCardGrid'
import { Pagination } from '@/components/Pagination'
import { Search } from 'lucide-react'

const PAGE_SIZE = 9

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q, page: pageParam } = await searchParams
  const query = (q ?? '').trim()
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  let articles: any[] = []
  let count = 0

  if (query) {
    // Escape Postgres ILIKE wildcards so a literal % or _ in someone's
    // search doesn't get interpreted as a pattern.
    const escaped = query.replace(/[%_]/g, '\\$&')
    const { data, count: total } = await supabase
      .from('articles')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .or(`title.ilike.%${escaped}%,excerpt.ilike.%${escaped}%`)
      .order('created_at', { ascending: false })
      .range(from, to)
    articles = data ?? []
    count = total ?? 0
  }

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 w-full">
      <div className="mb-8 border-b-2 border-black pb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold">Search</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight mt-1">Search the Wire</h1>
        <form action="/search" method="GET" className="mt-4 flex gap-2 max-w-lg">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search articles..."
            className="flex-1 text-sm px-4 py-2.5 border-2 border-zinc-300 focus:outline-none focus:border-black"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 bg-black text-white hover:bg-red-600 px-4 py-2.5 text-xs font-mono uppercase tracking-wider font-bold transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {!query && (
        <p className="font-serif text-zinc-600 text-sm">Enter a search term above to find articles.</p>
      )}

      {query && articles.length === 0 && (
        <p className="font-serif text-zinc-600 text-sm">No results for &ldquo;{query}&rdquo;.</p>
      )}

      {query && articles.length > 0 && (
        <>
          <p className="text-xs font-mono text-zinc-500 mb-6">
            {count} result{count === 1 ? '' : 's'} for &ldquo;{query}&rdquo;
          </p>
          <ArticleCardGrid articles={articles} />
          <Pagination
            page={page}
            totalPages={totalPages}
            count={count}
            buildHref={(p) => `/search?q=${encodeURIComponent(query)}&page=${p}`}
          />
        </>
      )}
    </div>
  )
}