import Link from 'next/link'
import { formatDate } from '@/lib/format-date'
import { tierCardClasses, tierBadgeClasses } from '@/lib/tier-styles'
import { TierShine } from '@/components/TierShine'

interface ArticleCardData {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  created_at: string
  is_premium: boolean
  required_tier: string
}

export function ArticleCardGrid({ articles }: { articles: ArticleCardData[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {articles.map((article) => (
        <div
          key={article.id}
          className={`relative group overflow-hidden p-6 flex flex-col justify-between transition-colors shadow-sm ${
            article.is_premium
              ? tierCardClasses(article.required_tier, article.is_premium)
              : `hover:border-black ${tierCardClasses(article.required_tier, article.is_premium)}`
          }`}
        >
          {article.is_premium && <TierShine tier={article.required_tier} isPremium={article.is_premium} />}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
              <span className="text-red-600 font-bold uppercase">{article.category}</span>
              <span>{formatDate(article.created_at)}</span>
            </div>
            <h3 className="font-serif font-bold text-xl leading-tight">
              <Link href={`/articles/${article.slug}`} className="hover:text-red-600 transition-colors">
                {article.title}
              </Link>
            </h3>
            <p className="text-xs text-zinc-600 font-serif line-clamp-3">{article.excerpt}</p>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-100 flex justify-between items-center">
            <span
              className={`text-[10px] font-mono uppercase px-1.5 py-0.5 ${
                article.is_premium ? tierBadgeClasses(article.required_tier) : 'text-zinc-400'
              }`}
            >
              {article.is_premium ? `Tier: ${article.required_tier}` : 'Public Wire'}
            </span>
            <Link href={`/articles/${article.slug}`} className="text-xs font-mono text-red-600 font-bold hover:underline">
              Access →
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}