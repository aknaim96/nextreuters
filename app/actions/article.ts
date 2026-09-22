'use server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { parseArticleForm } from '@/lib/article-schema'

export async function createArticleAction(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const parsed = parseArticleForm(formData)
  if (!parsed.success) {
    return { success: false, error: parsed.error }
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized. Please log in.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Authors can never publish directly, no matter what the form submitted —
  // their work always lands as a draft awaiting an editor/admin's review.
  const canPublishDirectly = !!profile && ['editor', 'admin'].includes(profile.role)
  const status = canPublishDirectly ? parsed.data.status : 'draft'

  // Only one article can hold a given featured slot at a time.
  if (parsed.data.featured_slot !== null) {
    await supabase
      .from('articles')
      .update({ featured_slot: null })
      .eq('featured_slot', parsed.data.featured_slot)
  }

  const { error } = await supabase.from('articles').insert({
    ...parsed.data,
    status,
    author_id: user.id,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  redirect('/cms')
}

export async function editArticleAction(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  if (!id) {
    return { success: false, error: 'Missing article ID.' }
  }

  const parsed = parseArticleForm(formData)
  if (!parsed.success) {
    return { success: false, error: parsed.error }
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized. Please log in.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const { data: existing } = await supabase
    .from('articles')
    .select('author_id')
    .eq('id', id)
    .single()

  if (!existing) {
    return { success: false, error: 'Article not found.' }
  }

  const isEditorOrAdmin = !!profile && ['editor', 'admin'].includes(profile.role)
  const isOwnArticle = existing.author_id === user.id

  // Authors may only edit their own drafts, and can never set the status
  // themselves — the field is simply ignored and forced back to draft.
  if (!isEditorOrAdmin) {
    if (!isOwnArticle) {
      return { success: false, error: 'You can only edit your own articles.' }
    }
  }

  const status = isEditorOrAdmin ? parsed.data.status : 'draft'

  // Only one article can hold a given featured slot at a time.
  if (parsed.data.featured_slot !== null) {
    await supabase
      .from('articles')
      .update({ featured_slot: null })
      .eq('featured_slot', parsed.data.featured_slot)
      .neq('id', id)
  }

  const { error } = await supabase
    .from('articles')
    .update({ ...parsed.data, status })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  redirect('/cms')
}

// Quick-publish action for the CMS list — editors/admins only.
export async function publishArticleAction(id: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized. Please log in.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'editor'].includes(profile.role)) {
    return { success: false, error: 'Only admins and editors can publish articles.' }
  }

  const { error } = await supabase.from('articles').update({ status: 'published' }).eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/cms')
  return { success: true }
}

export async function deleteArticleAction(id: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized. Please log in.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'editor'].includes(profile.role)) {
    return { success: false, error: 'Only admins and editors can delete articles.' }
  }

  const { error } = await supabase.from('articles').delete().eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/cms')
  return { success: true }
}