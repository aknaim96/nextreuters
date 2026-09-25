import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CreateArticleForm } from '@/components/CreateArticleForm'

export default async function CreateArticlePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['author', 'editor', 'admin'].includes(profile.role)) {
    redirect('/')
  }

  const canPublishDirectly = ['editor', 'admin'].includes(profile.role)

  return <CreateArticleForm canPublishDirectly={canPublishDirectly} />
}