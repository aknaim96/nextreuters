import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowRight, Clock, Terminal, PlusCircle } from 'lucide-react'
import { formatDate } from '@/lib/format-date'
import { tierCardClasses, tierAccentClasses, tierBadgeClasses } from '@/lib/tier-styles'
import { TierShine } from '@/components/TierShine'
import { ArticleCardGrid } from '@/components/ArticleCardGrid'
import { Pagination } from '@/components/Pagination'

const PAGE_SIZE = 9

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const supabase = await createClient()

  // Fetch all published articles from Supabase
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  const all = articles ?? []

  // Hand-picked homepage placements, set by admins/editors in the CMS.
  const pickedMain = all.find((a) => a.featured_slot === 1)
  const pickedSecondary = [2, 3]
    .map((slot) => all.find((a) => a.featured_slot === slot))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))

  const featuredIds = new Set(
    [pickedMain, ...pickedSecondary].filter(Boolean).map((a) => a!.id)
  )
  const fallbackPool = all.filter((a) => !featuredIds.has(a.id))

  const featured = pickedMain ?? fallbackPool[0]
  if (featured) featuredIds.add(featured.id)

  const secondaryArticles = [...pickedSecondary]
  for (const candidate of all) {
    if (secondaryArticles.length >= 2) break
    if (featuredIds.has(candidate.id)) continue
    secondaryArticles.push(candidate)
    featuredIds.add(candidate.id)
  }

  const wireFeeds = all.filter((a) => !featuredIds.has(a.id))
  const hasArticles = all.length > 0

  // Paginate wire feeds
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1)
  const totalPages = Math.max(1, Math.ceil(wireFeeds.length / PAGE_SIZE))
  const pagedWireFeeds = wireFeeds.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 w-full space-y-8 sm:space-y-12 min-h-[75vh] flex flex-col justify-between">
      
      <div className="space-y-12">
        {/* Top Dateline / Wire Status Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-black pb-3 gap-2">
          <div className="flex items-center space-x-3 font-mono text-xs uppercase tracking-widest text-zinc-600">
            <span className="w-2 h-2 bg-red-600 animate-pulse rounded-full"></span>
            <span>Live Intelligence Wire</span>
            <span>•</span>
            <span>Global Edition</span>
          </div>
          <div className="font-mono text-xs text-zinc-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Top Grid: Featured Lead Story & Secondary Analysis */}
        {hasArticles && featured ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8 sm:pb-12 border-b border-zinc-300">
            
            {/* Lead Story (2 Columns) - Unified with slow metallic glide & hover lift */}
            <div
              className={`lg:col-span-2 space-y-4 pr-0 lg:pr-8 lg:border-r lg:border-zinc-300 relative group overflow-hidden p-6 rounded-xs transition-all duration-700 ease-out flex flex-col justify-between shadow-sm hover:shadow-md ${
                featured.is_premium
                  ? tierAccentClasses(featured.required_tier, featured.is_premium)
                  : 'bg-white border border-zinc-200 hover:border-zinc-400'
              }`}
            >
              {featured.is_premium && <TierShine tier={featured.required_tier} isPremium={featured.is_premium} />}
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-xs font-mono">
                  <span className="uppercase tracking-widest font-bold text-red-600 bg-red-50 px-2 py-0.5 border border-red-200">
                    {featured.category}
                  </span>
                  {featured.is_premium && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-xs ${tierBadgeClasses(featured.required_tier)}`}>
                      Premium Dossier ({featured.required_tier})
                    </span>
                  )}
                </div>

                <h1 className="font-serif text-3xl md:text-5xl font-black tracking-tight leading-tight hover:text-red-600 transition-colors">
                  <Link href={`/articles/${featured.slug}`}>{featured.title}</Link>
                </h1>

                <p className="font-serif text-lg text-zinc-700 leading-relaxed">
                  {featured.excerpt}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-mono text-zinc-500 border-t border-zinc-100/80 mt-6">
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
                  {formatDate(featured.created_at)}
                </span>
                <Link
                  href={`/articles/${featured.slug}`}
                  className="inline-flex items-center text-red-600 font-bold hover:underline"
                >
                  Read Full Dossier <ArrowRight className="ml-1 w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Secondary Analysis / Editor's Picks Column */}
            <div className="flex flex-col h-full space-y-4">
              <h2 className="font-mono text-xs uppercase tracking-widest text-zinc-900 font-bold border-b-2 border-black pb-2 flex items-center justify-between shrink-0">
                <span>Editor&apos;s Picks</span>
                <span className="text-[10px] font-normal text-zinc-500">FEATURED</span>
              </h2>
              
              <div className="flex flex-col flex-1 gap-4 justify-between">
                {secondaryArticles.map((article) => (
                  <div
                    key={article.id}
                    className={`relative group flex flex-col justify-between flex-1 transition-all ${
                      article.is_premium
                        ? `overflow-hidden ${tierAccentClasses(article.required_tier, article.is_premium)}`
                        : 'pb-6 border-b border-zinc-200 last:border-none'
                    }`}
                  >
                    {article.is_premium && (
                      <TierShine tier={article.required_tier} isPremium={article.is_premium} />
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-red-600 font-bold">
                          {article.category}
                        </span>
                        {article.is_premium && (
                          <span
                            className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-xs ${tierBadgeClasses(
                              article.required_tier
                            )}`}
                          >
                            {article.required_tier}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-serif font-bold text-lg leading-snug">
                        <Link
                          href={`/articles/${article.slug}`}
                          className="hover:text-red-600 transition-colors"
                        >
                          {article.title}
                        </Link>
                      </h3>
                      
                      <p className="text-xs text-zinc-600 font-serif line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* Empty Standby Terminal */
          <div className="bg-white border-2 border-black p-10 md:p-16 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-red-600 text-white px-3 py-1 text-xs font-mono uppercase tracking-wider font-bold">
                <Terminal className="w-4 h-4" />
                <span>Wire Terminal Standing By</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-black tracking-tight leading-tight">
                No intelligence reports transmitted to the wire yet.
              </h2>
              <p className="font-serif text-zinc-600 text-sm leading-relaxed">
                The global news desk is currently idle. Authorized analysts, editors, and correspondents can dispatch breaking market wire briefs, opinion essays, and deep-dive dossiers directly via the CMS control panel.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/cms"
                  className="bg-black text-white hover:bg-red-600 px-5 py-3 text-xs font-mono uppercase tracking-wider font-bold transition-colors inline-flex items-center shadow-sm"
                >
                  <PlusCircle className="mr-2 w-4 h-4" /> Open CMS Admin Console
                </Link>
                <Link
                  href="/login"
                  className="border border-black text-black hover:bg-zinc-100 px-5 py-3 text-xs font-mono uppercase tracking-wider font-bold transition-colors inline-flex items-center"
                >
                  Correspondent Sign In
                </Link>
              </div>
            </div>

            <div className="bg-zinc-950 text-zinc-100 p-6 font-mono text-xs space-y-3 rounded-none border border-zinc-800 shadow-inner">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-zinc-400">
                <span>SYSTEM STATUS: ONLINE</span>
                <span className="text-green-400 font-bold">● CONNECTED</span>
              </div>
              <p className="text-zinc-400">&gt; Database: Supabase Connected</p>
              <p className="text-zinc-400">&gt; Auth Gate: Active</p>
              <p className="text-zinc-400">&gt; Paywall Engine: Standby</p>
              <p className="text-red-500">&gt; Waiting for first editorial dispatch...</p>
              <div className="pt-4 border-t border-zinc-800 text-[11px] text-zinc-500">
                Tip: Log in with an account assigned the author or editor role to publish your first article instantly.
              </div>
            </div>
          </div>
        )}

        {/* Bottom Wire Grid */}
        {wireFeeds.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-2">
              <h2 className="font-mono text-xs uppercase tracking-widest font-bold">Global Wire Feed Archive</h2>
              <Link href="/opinion" className="text-xs font-mono text-red-600 font-bold hover:underline">View All Sections →</Link>
            </div>

            <ArticleCardGrid articles={pagedWireFeeds} />
            <Pagination page={page} totalPages={totalPages} count={wireFeeds.length} buildHref={(p) => `/?page=${p}`} />
          </div>
        )}

      </div>
    </div>
  )
}