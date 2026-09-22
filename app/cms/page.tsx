import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { PlusCircle, Edit3 } from 'lucide-react'
import Link from 'next/link'
import DeleteButton from './DeleteButton'
import PublishButton from './PublishButton'

export default async function CMSPage() {
  const supabase = await createClient()

  // 1. Secure Access Check
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

  // Only admins and editors are allowed to delete or publish articles from this UI.
  const isEditorOrAdmin = ['admin', 'editor'].includes(profile.role)

  // 2. Fetch articles — authors only see their own work, editors/admins see everything.
  let query = supabase.from('articles').select('*').order('created_at', { ascending: false })
  if (!isEditorOrAdmin) {
    query = query.eq('author_id', user.id)
  }
  const { data: articles } = await query

  // 3. Fetch author names/emails separately and map by id.
  const authorIds = Array.from(
    new Set((articles ?? []).map((a) => a.author_id).filter(Boolean))
  )

  const authorMap = new Map<string, string>()
  if (authorIds.length > 0) {
    const { data: authors } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', authorIds)

    authors?.forEach((a) => {
      authorMap.set(a.id, a.full_name || a.email || 'Unknown')
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-xs font-mono tracking-widest text-red-600 uppercase">
            {isEditorOrAdmin ? 'Admin Control Panel' : 'My Submissions'}
          </span>
          <h1 className="text-3xl font-serif font-bold mt-1">Article Registry</h1>
        </div>
        <Link
          href="/cms/create"
          className="inline-flex items-center bg-red-600 text-white text-xs font-mono uppercase tracking-wider px-4 py-2 hover:bg-red-700 transition-colors"
        >
          <PlusCircle className="mr-2 w-4 h-4" /> Create Article
        </Link>
      </div>

      <div className="bg-white border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 uppercase text-xs font-mono text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Author</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles?.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-serif font-medium text-gray-900">{article.title}</td>
                <td className="px-6 py-4 font-mono text-xs text-gray-700">{article.category}</td>
                <td className="px-6 py-4 font-mono text-xs text-gray-700">
                  {authorMap.get(article.author_id) ?? 'Unknown'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {article.status === 'published' ? (
                      <span className="text-[10px] font-mono bg-blue-100 text-blue-700 px-2 py-0.5 uppercase font-bold">Published</span>
                    ) : (
                      <span className="text-[10px] font-mono bg-yellow-100 text-yellow-800 px-2 py-0.5 uppercase font-bold">Draft</span>
                    )}
                    {article.is_premium ? (
                      <span className="text-[10px] font-mono bg-amber-100 text-amber-700 px-2 py-0.5 uppercase">Premium ({article.required_tier})</span>
                    ) : (
                      <span className="text-[10px] font-mono bg-green-100 text-green-700 px-2 py-0.5 uppercase">Public</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {isEditorOrAdmin && article.status === 'draft' && (
                      <PublishButton articleId={article.id} />
                    )}
                    <Link href={`/cms/edit/${article.id}`} className="inline-flex text-gray-400 hover:text-red-600">
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    {isEditorOrAdmin && <DeleteButton articleId={article.id} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {articles?.length === 0 && (
          <p className="px-6 py-8 text-sm font-mono text-gray-500 text-center">No articles yet.</p>
        )}
      </div>
    </div>
  )
}