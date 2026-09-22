import { z } from 'zod'

export const articleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  slug: z.string().min(3, 'Slug is required (e.g., global-markets-surge).'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters long.'),
  content: z.string().min(30, 'Content must be at least 30 characters long.'),
  category: z.enum(['Book Club', 'Opinion', 'Projects', 'Markets', 'World News']),
  isPremium: z.string().nullish(), // 'on' or undefined from checkbox forms
  requiredTier: z.enum(['none', 'silver', 'gold']),
  featuredSlot: z.enum(['none', '1', '2', '3']).default('none'),
  status: z.enum(['draft', 'published']).default('draft'),
})

export type ArticleFormValues = z.infer<typeof articleSchema>

export function parseArticleForm(formData: FormData) {
  const rawData = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    category: formData.get('category'),
    isPremium: formData.get('isPremium'),
    requiredTier: formData.get('requiredTier'),
    featuredSlot: formData.get('featuredSlot') || 'none',
    status: formData.get('status') || 'draft',
  }

  const result = articleSchema.safeParse(rawData)
  if (!result.success) {
    return { success: false as const, error: result.error.issues[0].message }
  }

  return {
    success: true as const,
    data: {
      title: result.data.title,
      slug: result.data.slug,
      excerpt: result.data.excerpt,
      content: result.data.content,
      category: result.data.category,
      is_premium: result.data.isPremium === 'on',
      required_tier: result.data.requiredTier,
      featured_slot: result.data.featuredSlot === 'none' ? null : Number(result.data.featuredSlot),
      status: result.data.status,
    },
  }
}