import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { PaywallGate } from '@/components/PaywallGate'
import { ArticleTOCLayout } from '@/components/ArticleTOCLayout'
import { ArticleReader } from '@/components/ArticleReader'
import { Clock, BookOpen, ArrowLeft, ArrowRight, Crown } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/format-date'
import { tierBadgeClasses, tierCardClasses } from '@/lib/tier-styles'
import { parseArticleContent, extractHeadings } from '@/lib/parse-content'
import type { Metadata } from 'next'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

const tierRank: Record<string, number> = {
  none: 0,
  silver: 1,
  gold: 2,
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: article } = await supabase
    .from('articles')
    .select('title, excerpt, category, created_at, status')
    .eq('slug', slug)
    .single()

  if (!article || article.status !== 'published') {
    return { title: 'Article Not Found | Khan Chronicle' }
  }

  return {
    title: `${article.title} | Khan Chronicle`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.created_at,
      section: article.category,
      siteName: 'Khan Chronicle',
    },
    twitter: {
      card: 'summary',
      title: article.title,
      description: article.excerpt,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // 1. Fetch article
  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !article) {
    notFound()
  }

  // 2. Fetch authenticated user profile
  const { data: { user } } = await supabase.auth.getUser()
  let userTier = 'none'
  let userRole = 'none'

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, role')
      .eq('id', user.id)
      .single()
    if (profile) {
      userTier = profile.subscription_tier
      userRole = profile.role
    }
  }

  // Draft check
  if (article.status !== 'published') {
    const isOwnDraft = !!user && article.author_id === user.id
    const isEditorOrAdmin = ['editor', 'admin'].includes(userRole)
    if (!isOwnDraft && !isEditorOrAdmin) {
      notFound()
    }
  }

  // Fetch Author Profile
  let authorProfile: { full_name: string | null; email: string; role: string } | null = null
  if (article.author_id) {
    const { data: author } = await supabase
      .from('profiles')
      .select('full_name, email, role')
      .eq('id', article.author_id)
      .single()
    authorProfile = author
  }

  const authorDisplayName = authorProfile?.full_name || authorProfile?.email || 'Editorial Staff'

  // Access check
  const hasAccess =
    !article.is_premium ||
    (!!user && tierRank[userTier] >= tierRank[article.required_tier])

  const blocks = hasAccess ? parseArticleContent(article.content) : []
  const headings = hasAccess ? extractHeadings(blocks) : []

  // Word count & Reading Time
  const wordCount = article.content ? article.content.trim().split(/\s+/).length : 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  // Fetch Related Articles
  const { data: relatedArticles } = await supabase
    .from('articles')
    .select('id, title, slug, excerpt, created_at, is_premium, required_tier')
    .eq('category', article.category)
    .eq('status', 'published')
    .neq('id', article.id)
    .limit(2)

  const isGoldTier = article.is_premium && article.required_tier === 'gold'
  const isSilverTier = article.is_premium && article.required_tier === 'silver'

  const getContainerClasses = () => {
    if (isGoldTier) {
      return 'relative bg-gradient-to-br from-amber-50/70 via-amber-100/30 to-yellow-50/80 p-5 sm:p-8 md:p-12 space-y-6 text-gray-900 border-2 border-amber-500 outline outline-1 outline-amber-400/70 outline-offset-[-5px] shadow-[0_4px_20px_rgba(245,158,11,0.08)]'
    }
    if (isSilverTier) {
      return 'relative bg-gradient-to-br from-slate-100/80 via-slate-50/50 to-zinc-100/70 p-5 sm:p-8 md:p-12 space-y-6 text-gray-900 border-2 border-slate-400 outline outline-1 outline-slate-300 outline-offset-[-5px] shadow-[0_4px_20px_rgba(100,116,139,0.08)]'
    }
    return 'relative bg-white p-5 sm:p-8 md:p-12 space-y-6 text-zinc-900 border border-zinc-300 shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f7]">
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 sm:py-12 w-full">
        {/* Professional Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-xs font-mono text-zinc-600 hover:text-red-600 mb-8 transition-colors font-semibold"
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Return to Article Registry
        </Link>

        <ArticleTOCLayout headings={headings}>
          {article.status !== 'published' && (
            <div className="mb-4 bg-amber-100 border border-amber-300 text-amber-900 px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold text-center">
              Draft Preview — Not Yet Published
            </div>
          )}

          {/* Main Article Container */}
          <article
            data-premium={article.is_premium}
            className={getContainerClasses()}
          >
            {/* Category & Time Bar — Dynamically styled for Gold, Silver, or Default */}
            <div className={`flex flex-wrap items-center justify-between gap-3 pb-4 ${
              isGoldTier ? 'border-b-2 border-amber-400/80' : isSilverTier ? 'border-b-2 border-slate-300' : 'border-b border-zinc-200'
            }`}>
              <span className={`text-xs font-mono tracking-widest uppercase font-black px-2.5 py-1 border shadow-2xs ${
                isGoldTier ? 'text-red-700 bg-white/80 border-amber-300' :
                isSilverTier ? 'text-slate-800 bg-white/80 border-slate-300' :
                'text-zinc-800 bg-white/80 border-zinc-300'
              }`}>
                {article.category}
              </span>

              <div className="flex items-center space-x-3 text-xs font-mono text-zinc-800 font-medium">
                <span className={`flex items-center bg-white/80 px-2.5 py-1 border shadow-2xs ${
                  isGoldTier ? 'border-amber-300 text-amber-900' :
                  isSilverTier ? 'border-slate-300 text-slate-800' :
                  'border-zinc-300 text-zinc-700'
                }`}>
                  <Clock className={`w-3.5 h-3.5 mr-1.5 ${isGoldTier ? 'text-amber-700' : isSilverTier ? 'text-slate-600' : 'text-zinc-500'}`} />
                  {formatDate(article.created_at)}
                </span>
                <span className={`flex items-center bg-white/80 px-2.5 py-1 border shadow-2xs ${
                  isGoldTier ? 'border-amber-300 text-amber-900' :
                  isSilverTier ? 'border-slate-300 text-slate-800' :
                  'border-zinc-300 text-zinc-700'
                }`}>
                  <BookOpen className={`w-3.5 h-3.5 mr-1.5 ${isGoldTier ? 'text-amber-700' : isSilverTier ? 'text-slate-600' : 'text-zinc-500'}`} />
                  {readingTime} min read
                </span>
                {article.is_premium && (
                  <span
                    className={`px-2.5 py-1 uppercase text-[10px] shadow-2xs ${tierBadgeClasses(
                      article.required_tier
                    )}`}
                  >
                    Tier: {article.required_tier}
                  </span>
                )}
              </div>
            </div>

            {/* Headline Title */}
            <h1 className="font-serif text-3xl md:text-5xl font-black tracking-tight leading-tight text-zinc-900">
              {article.title}
            </h1>

            {/* Correspondent Byline — Clean name without admin role tag */}
            <div className={`py-3 px-3 bg-white/55 flex items-center justify-between text-xs font-mono uppercase tracking-wider border ${
              isGoldTier ? 'border-amber-300/90 shadow-2xs' : isSilverTier ? 'border-slate-300 shadow-2xs' : 'border-zinc-200'
            }`}>
              <p className="text-zinc-600 flex items-center gap-1.5">
                <Crown className={`w-3.5 h-3.5 ${isGoldTier ? 'text-amber-600' : isSilverTier ? 'text-slate-500' : 'text-zinc-500'}`} />
                <span>Correspondent:</span> 
                <span className={`text-zinc-900 font-black underline underline-offset-2 ${isGoldTier ? 'decoration-amber-400' : isSilverTier ? 'decoration-slate-400' : 'decoration-zinc-400'}`}>
                  {authorDisplayName}
                </span>
              </p>
              <span className="text-zinc-600 text-[10px] hidden sm:inline font-bold">Khan Chronicle Bureau</span>
            </div>

            {/* Excerpt */}
            <p className={`font-serif text-xl text-zinc-800 leading-relaxed italic border-l-4 pl-4 py-1 ${
              isGoldTier ? 'border-l-red-600 bg-amber-50/30' : isSilverTier ? 'border-l-slate-600 bg-slate-50/30' : 'border-l-zinc-600 bg-zinc-50/30'
            }`}>
              {article.excerpt}
            </p>

            {/* Content Reader */}
            <div className={`pt-4 ${isGoldTier ? 'border-t-2 border-amber-400/80' : isSilverTier ? 'border-t-2 border-slate-300' : 'border-t border-zinc-200'}`}>
              {hasAccess ? (
                <div className="space-y-10">
                  <ArticleReader 
                    title={article.title} 
                    blocks={blocks} 
                    requiredTier={article.required_tier}
                    isPremium={article.is_premium}
                  />

                  {/* Editorial Support Callout */}
                  <div className={`p-6 border-2 border-l-4 border-l-red-600 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 my-8 rounded-r-xs ${
                    isGoldTier ? 'bg-amber-50/90 border-amber-300 text-zinc-900' :
                    isSilverTier ? 'bg-slate-50/90 border-slate-300 text-zinc-900' :
                    'bg-white border-zinc-200 text-zinc-900'
                  }`}>
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center space-x-1.5 text-red-700 text-xs font-mono uppercase tracking-widest font-bold">
                        <Crown className={`w-3.5 h-3.5 ${isGoldTier ? 'text-amber-600' : isSilverTier ? 'text-slate-600' : 'text-zinc-600'}`} />
                        <span>Independent Press Fund</span>
                      </div>

                      <h4 className="font-serif text-lg font-bold tracking-tight">
                        Support The Khan Chronicle
                      </h4>

                      <p className="font-serif text-sm text-zinc-700 leading-relaxed">
                        Our financial reporting remains independent and free from corporate bias.
                        If you value our coverage, consider supporting our editorial desk.
                      </p>
                    </div>

                    <Link
                      href="/donate"
                      className="group shrink-0 px-5 py-2.5 bg-red-600 hover:bg-gradient-to-r hover:from-amber-300 hover:via-yellow-400 hover:to-amber-500 text-white hover:text-zinc-950 border border-amber-400/60 font-mono text-[11px] uppercase font-extrabold tracking-widest transition-all duration-300 shadow-xs inline-flex items-center space-x-2 rounded-xs"
                    >
                      <span className="transition-colors">Support Our Work</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </div>
                </div>
              ) : (
                <PaywallGate
                  requiredTier={article.required_tier}
                  userTier={userTier}
                  isAuthenticated={!!user}
                  excerpt={article.excerpt}
                />
              )}
            </div>
          </article>

          {/* Related Articles */}
          {relatedArticles && relatedArticles.length > 0 && (
            <section className="mt-12 pt-8 border-t-2 border-zinc-300">
              <span className="text-xs font-mono tracking-widest text-red-600 uppercase block mb-4 font-bold flex items-center gap-2">
                <Crown className="w-3.5 h-3.5 text-zinc-700" /> More Dispatches in {article.category}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/articles/${rel.slug}`}
                    className={`p-5 transition-all duration-700 ease-out group block space-y-3 shadow-sm hover:shadow-md ${tierCardClasses(rel.required_tier, rel.is_premium)}`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600 font-semibold">
                      <span>{formatDate(rel.created_at)}</span>
                      {rel.is_premium && (
                        <span
                          className={`px-1.5 py-0.5 uppercase font-bold rounded-xs ${tierBadgeClasses(
                            rel.required_tier
                          )}`}
                        >
                          {rel.required_tier}
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-zinc-900 group-hover:text-red-600 transition-colors line-clamp-2 text-lg leading-snug">
                      {rel.title}
                    </h3>

                    <p className="text-xs font-serif text-zinc-700 line-clamp-2 leading-relaxed">
                      {rel.excerpt}
                    </p>

                    <div className="inline-flex items-center text-xs font-mono text-red-600 font-bold pt-1">
                      Read Report <ArrowRight className="ml-1 w-3 h-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </ArticleTOCLayout>
      </main>
    </div>
  )
}