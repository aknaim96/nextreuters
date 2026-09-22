import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import EditArticleForm from './EditArticleForm'

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['author', 'editor', 'admin'].includes(profile.role)) {
    redirect('/')
  }

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (!article) {
    notFound()
  }

  const isEditorOrAdmin = ['editor', 'admin'].includes(profile.role)

  // Authors may only edit their own articles — not other authors' drafts.
  if (!isEditorOrAdmin && article.author_id !== user.id) {
    redirect('/cms')
  }

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
        <h1 className="text-3xl font-serif font-bold mt-1 text-gray-900">Edit Intelligence Report</h1>
      </div>

      <EditArticleForm article={article} canPublishDirectly={isEditorOrAdmin} />
    </div>
  )
}