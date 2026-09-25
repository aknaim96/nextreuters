'use client'

import { useState, useActionState } from 'react'
import { createArticleAction } from '@/app/actions/article'
import Link from 'next/link'
import { ArrowLeft, Send, Lock, Unlock, FileText, Clock } from 'lucide-react'

const initialState = { success: false, error: '' }

const TIER_META: Record<string, { label: string; price: string }> = {
  none: { label: 'Free Access', price: '$0' },
  silver: { label: 'Silver Tier', price: '$1/mo' },
  gold: { label: 'Gold Tier', price: '$2/mo' },
}

export function CreateArticleForm({ canPublishDirectly }: { canPublishDirectly: boolean }) {
  const [state, formAction, isPending] = useActionState(createArticleAction, initialState)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [isSlugCustomized, setIsSlugCustomized] = useState(false)
  const [requiredTier, setRequiredTier] = useState('none')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTitle(val)
    if (!isSlugCustomized) {
      setSlug(generateSlug(val))
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value)
    setIsSlugCustomized(true)
  }

  const isPaywalled = requiredTier !== 'none'
  const meta = TIER_META[requiredTier] || TIER_META.none

  // Real-time editorial metrics
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full">
      <div className="mb-6">
        <Link
          href="/cms"
          className="inline-flex items-center text-xs font-mono text-gray-500 hover:text-red-600 mb-4 transition-colors"
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Return to CMS Dashboard
        </Link>
        <span className="text-xs font-mono tracking-widest text-red-600 uppercase block">
          Editorial Desk
        </span>
        <h1 className="text-3xl font-serif font-bold mt-1 text-gray-900">Draft Report</h1>
      </div>

      {state?.error && (
        <div className="mb-6 bg-red-50 border border-red-200 p-3 text-sm text-red-700 font-mono">
          {state.error}
        </div>
      )}

      <form action={formAction} className="bg-white border border-gray-200 p-5 sm:p-8 space-y-6 shadow-sm">
        {/* Pass computed isPremium boolean if Server Action relies on it */}
        <input type="hidden" name="isPremium" value={String(isPaywalled)} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 mb-1">
              Headline Title
            </label>
            <input
              name="title"
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g., Global Markets Surge Amid Central Bank Policy Shifts"
              className="w-full text-sm px-3 py-2 bg-transparent border border-gray-300 rounded-none focus:outline-none focus:border-red-600 text-gray-900"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-700">
                URL Slug <span className="text-gray-400 lowercase">(auto-generated)</span>
              </label>
              {isSlugCustomized && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSlugCustomized(false)
                    setSlug(generateSlug(title))
                  }}
                  className="text-[10px] font-mono text-red-600 hover:underline"
                >
                  Reset Slug
                </button>
              )}
            </div>
            <input
              name="slug"
              type="text"
              required
              value={slug}
              onChange={handleSlugChange}
              placeholder="e.g., global-markets-surge-central-bank"
              className="w-full text-sm px-3 py-2 bg-gray-50 border border-gray-300 rounded-none focus:outline-none focus:border-red-600 font-mono text-xs text-gray-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 mb-1">
              Category Section
            </label>
            <select
              name="category"
              className="w-full text-sm px-3 py-2 bg-white border border-gray-300 rounded-none focus:outline-none focus:border-red-600 text-gray-900"
            >
              <option value="Markets">Markets & Finance</option>
              <option value="Opinion">Opinion</option>
              <option value="Book Club">Book Club</option>
              <option value="Projects">Projects</option>
              <option value="World News">World News</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 mb-1">
              Access Tier / Paywall
            </label>
            <select
              name="requiredTier"
              value={requiredTier}
              onChange={(e) => setRequiredTier(e.target.value)}
              className="w-full text-sm px-3 py-2 bg-white border border-gray-300 rounded-none focus:outline-none focus:border-red-600 font-mono text-gray-900"
            >
              <option value="none">None (Free Access)</option>
              <option value="silver">Silver Tier ($1/mo)</option>
              <option value="gold">Gold Tier ($2/mo)</option>
            </select>

            {/* Live paywall preview badge */}
            <div
              className={`mt-2 flex items-center gap-2 px-3 py-2 border text-xs font-mono ${
                isPaywalled
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}
            >
              {isPaywalled ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>
                {isPaywalled
                  ? `Restricted — only ${meta.label} (${meta.price}) subscribers can read the full article.`
                  : 'Free — publicly readable by everyone, no paywall.'}
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 mb-1">
            Homepage Placement
          </label>
          <select
            name="featuredSlot"
            defaultValue="none"
            className="w-full md:w-1/2 text-sm px-3 py-2 bg-white border border-gray-300 rounded-none focus:outline-none focus:border-red-600 font-mono text-gray-900"
          >
            <option value="none">Not Featured</option>
            <option value="1">Main Headline</option>
            <option value="2">Featured Pick #2</option>
            <option value="3">Featured Pick #3</option>
          </select>
          <p className="text-[10px] text-gray-400 font-mono mt-1">
            Picking a slot already in use removes it from that article.
          </p>
        </div>

        {canPublishDirectly ? (
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-700 mb-1">
              Publish Status
            </label>
            <select
              name="status"
              defaultValue="draft"
              className="w-full md:w-1/2 text-sm px-3 py-2 bg-white border border-gray-300 rounded-none focus:outline-none focus:border-red-600 font-mono text-gray-900"
            >
              <option value="draft">Save as Draft</option>
              <option value="published">Publish Now</option>
            </select>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 p-3 text-xs font-mono text-amber-800">
            Your submission will be saved as a <span className="font-bold">draft</span> for an editor to review and publish.
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-700">
              Article Excerpt <span className="text-gray-400 lowercase">(displayed on wire feeds & paywall blur preview)</span>
            </label>
            <span
              className={`text-[10px] font-mono ${
                excerpt.length > 160 ? 'text-amber-600 font-bold' : 'text-gray-400'
              }`}
            >
              {excerpt.length}/160 chars
            </span>
          </div>
          <textarea
            name="excerpt"
            required
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief executive summary of the financial dossier..."
            className="w-full text-sm px-3 py-2 bg-transparent border border-gray-300 rounded-none focus:outline-none focus:border-red-600 font-serif text-gray-900"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-700">
              Full Article Content
            </label>
            <div className="flex items-center space-x-3 text-[11px] font-mono text-gray-500">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" /> {wordCount} words
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {readingTimeMinutes} min read
              </span>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 font-mono mb-1.5">
            Start a line with <span className="font-bold">## </span> for a clickable headline, or{' '}
            <span className="font-bold">### </span> for a sub-headline.
          </p>
          <textarea
            name="content"
            required
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write or paste full market intelligence report content..."
            className="w-full text-sm px-3 py-2 bg-transparent border border-gray-300 rounded-none focus:outline-none focus:border-red-600 font-serif leading-relaxed text-gray-900"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full inline-flex items-center justify-center bg-red-600 text-white text-xs font-mono uppercase tracking-widest py-3 hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Submitting...' : canPublishDirectly ? 'Save Report' : 'Submit Draft for Review'}
          <Send className="ml-2 w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  )
}