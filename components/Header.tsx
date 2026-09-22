import { createClient } from '@/utils/supabase/server'
import { HeaderNav } from './HeaderNav'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userRole = 'none'
  let subscriptionTier = 'none'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, subscription_tier')
      .eq('id', user.id)
      .single()
    if (profile) {
      userRole = profile.role
      subscriptionTier = profile.subscription_tier ?? 'none'
    }
  }

  const canAccessCMS = ['author', 'editor', 'admin'].includes(userRole)
  const isAdmin = userRole === 'admin'

  return (
    <HeaderNav
      userEmail={user?.email ?? null}
      canAccessCMS={canAccessCMS}
      isAdmin={isAdmin}
      subscriptionTier={subscriptionTier}
    />
  )
}