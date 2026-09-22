import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { PaywallGate } from '@/components/PaywallGate'
import { ArticleTOCLayout } from '@/components/ArticleTOCLayout'
import { Clock } from 'lucide-react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { formatDate } from '@/lib/format-date'
import { tierCardClasses, tierBadgeClasses } from '@/lib/tier-styles'
import { TierShine } from '@/components/TierShine'
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

  // Don't leak title/excerpt for drafts or missing articles into page metadata —
  // social previews and search engines only ever see generic text here.
  if (!article || article.status !== 'published') {
    return { title: 'Article Not Found | Khan Chronicle' }
  }

  const title = `${article.title} | Khan Chronicle`

  return {
    title,
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

  // 1. Fetch article by slug
  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !article) {
    notFound()
  }

  // 2. Fetch authenticated user and profile tier
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

  // 2a. Drafts are only visible to their author or an editor/admin — everyone
  // else gets a 404, exactly as if the article didn't exist.
  if (article.status !== 'published') {
    const isOwnDraft = !!user && article.author_id === user.id
    const isEditorOrAdmin = ['editor', 'admin'].includes(userRole)
    if (!isOwnDraft && !isEditorOrAdmin) {
      notFound()
    }
  }

  // 2b. Fetch the author's display name, if the article has one on record.
  let authorName: string | null = null
  if (article.author_id) {
    const { data: authorProfile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', article.author_id)
      .single()
    authorName = authorProfile?.full_name || authorProfile?.email || null
  }

  // 3. Decide access server-side, before anything is rendered.
  // This is the actual gate — if hasAccess is false, article.content
  // is never referenced below, so it never reaches the client's HTML.
  const hasAccess =
    !article.is_premium ||
    (!!user && tierRank[userTier] >= tierRank[article.required_tier])

  // Only parse headings out of content the reader is actually allowed to see,
  // so the paywalled article's structure isn't exposed via the index either.
  const blocks = hasAccess ? parseArticleContent(article.content) : []
  const headings = hasAccess ? extractHeadings(blocks) : []

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f7]">

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 sm:py-12 w-full">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-mono text-gray-500 hover:text-red-600 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Return to Wire Index
        </Link>

        <ArticleTOCLayout headings={headings}>
          {article.status !== 'published' && (
            <div className="mb-4 bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold text-center">
              Draft Preview — Not Yet Published
            </div>
          )}
          <article
            className={`bg-white p-5 sm:p-8 md:p-12 shadow-sm space-y-6 ${
              article.is_premium ? tierCardClasses(article.required_tier, article.is_premium) : 'border border-gray-200'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-4">
              <span className="text-xs font-mono tracking-widest text-red-600 uppercase font-bold">
                {article.category}
              </span>
              <div className="flex items-center space-x-3 text-xs font-mono text-gray-500">
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  {formatDate(article.created_at)}
                </span>
                {article.is_premium && (
                  <span className={`px-2 py-0.5 uppercase text-[10px] ${tierBadgeClasses(article.required_tier)}`}>
                    Required: {article.required_tier}
                  </span>
                )}
              </div>
            </div>

            <h1 className="font-serif text-3xl md:text-5xl font-black tracking-tight leading-tight scroll-mt-24">
              {article.title}
            </h1>

            {authorName && (
              <p className="text-xs font-mono uppercase tracking-wider text-gray-500">
                By <span className="text-gray-800 font-bold">{authorName}</span>
              </p>
            )}

            <p className="font-serif text-xl text-gray-600 leading-relaxed italic border-l-2 border-red-600 pl-4">
              {article.excerpt}
            </p>

            <div className="pt-6 border-t border-gray-100">
              {hasAccess ? (
                <div className="font-serif text-lg leading-relaxed space-y-6 text-gray-800">
                  {blocks.map((block, i) =>
                    block.type === 'heading' ? (
                      <h2 key={block.id} id={block.id} className="font-serif font-black text-2xl md:text-3xl text-gray-900 pt-2 scroll-mt-24">
                        {block.text}
                      </h2>
                    ) : (
                      <div key={i} className="whitespace-pre-wrap">{block.text}</div>
                    )
                  )}
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
        </ArticleTOCLayout>
      </main>

    </div>
  )
}