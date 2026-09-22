import { CategoryArticles } from '@/components/CategoryArticles'

export default async function MarketsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1)
  return <CategoryArticles category="Markets" label="Markets" page={page} />
}