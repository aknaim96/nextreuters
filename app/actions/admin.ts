'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

// Admin cannot be granted through this UI — promoting someone to admin
// must be done directly in the database.
const VALID_ROLES = ['reader', 'author', 'editor']

// Writes an audit entry using the service-role client so it never depends on
// RLS policies being present on the audit table itself.
async function logAdminAction(params: {
  actorId: string
  actorEmail: string
  action: 'role_change' | 'account_delete'
  targetId: string
  targetEmail: string
  details?: Record<string, unknown>
}) {
  const adminClient = createAdminClient()
  await adminClient.from('admin_audit_log').insert({
    actor_id: params.actorId,
    actor_email: params.actorEmail,
    action: params.action,
    target_id: params.targetId,
    target_email: params.targetEmail,
    details: params.details ?? null,
  })
}

export async function updateUserRoleAction(targetUserId: string, newRole: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized. Please log in.' }
  }

  const { data: callerProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!callerProfile || callerProfile.role !== 'admin') {
    return { success: false, error: 'Only admins can change user roles.' }
  }

  if (!VALID_ROLES.includes(newRole)) {
    return { success: false, error: 'Invalid role.' }
  }

  // Prevent an admin from locking themselves (or the last admin) out by
  // demoting their own account — role changes must come from another admin.
  if (targetUserId === user.id) {
    return { success: false, error: 'You cannot change your own role.' }
  }

  const { data: targetProfile } = await supabase
    .from('profiles')
    .select('email, role')
    .eq('id', targetUserId)
    .single()

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', targetUserId)

  if (error) {
    return { success: false, error: error.message }
  }

  await logAdminAction({
    actorId: user.id,
    actorEmail: user.email ?? 'unknown',
    action: 'role_change',
    targetId: targetUserId,
    targetEmail: targetProfile?.email ?? 'unknown',
    details: { from: targetProfile?.role ?? null, to: newRole },
  })

  revalidatePath('/admin/users')
  revalidatePath('/admin/audit-log')
  return { success: true }
}

// Permanently deletes a user's account (auth + profile). Admin-only, and
// requires the service-role key since deleting another person's auth
// account is outside what the anon/authenticated client is ever allowed to do.
export async function deleteUserAction(targetUserId: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized. Please log in.' }
  }

  const { data: callerProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!callerProfile || callerProfile.role !== 'admin') {
    return { success: false, error: 'Only admins can delete user accounts.' }
  }

  if (targetUserId === user.id) {
    return { success: false, error: 'You cannot delete your own account from here.' }
  }

  const { data: targetProfile } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', targetUserId)
    .single()

  const adminClient = createAdminClient()

  // Delete the profile row first (child record) before the auth user (parent),
  // in case there's no cascading delete configured between them.
  await adminClient.from('profiles').delete().eq('id', targetUserId)

  const { error } = await adminClient.auth.admin.deleteUser(targetUserId)
  if (error) {
    return { success: false, error: error.message }
  }

  await logAdminAction({
    actorId: user.id,
    actorEmail: user.email ?? 'unknown',
    action: 'account_delete',
    targetId: targetUserId,
    targetEmail: targetProfile?.email ?? 'unknown',
  })

  revalidatePath('/admin/users')
  revalidatePath('/admin/audit-log')
  return { success: true }
}