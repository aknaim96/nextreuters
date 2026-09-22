import { createClient } from '@/utils/supabase/server'
import { ArticleCardGrid } from '@/components/ArticleCardGrid'
import { Pagination } from '@/components/Pagination'

const PAGE_SIZE = 9

export async function CategoryArticles({
  category,
  label,
  page,
}: {
  category: string
  label: string
  page: number
}) {
  const supabase = await createClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data: articles, count } = await supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .eq('category', category)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(from, to)

  const list = articles ?? []
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE))
  const basePath = `/${label === 'Book Club' ? 'book-club' : label.toLowerCase()}`

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 w-full">
      <div className="mb-8 border-b-2 border-black pb-3">
        <span className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold">Section</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight">{label}</h1>
      </div>

      {list.length === 0 ? (
        <p className="font-serif text-zinc-600 text-sm">
          No {label.toLowerCase()} dispatches on the wire yet.
        </p>
      ) : (
        <>
          <ArticleCardGrid articles={list} />
          <Pagination page={page} totalPages={totalPages} count={count ?? 0} buildHref={(p) => `${basePath}?page=${p}`} />
        </>
      )}
    </div>
  )
}