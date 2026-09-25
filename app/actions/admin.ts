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
  try {
    const adminClient = createAdminClient()
    const { error } = await adminClient.from('admin_audit_log').insert({
      actor_id: params.actorId,
      actor_email: params.actorEmail,
      action: params.action,
      target_id: params.targetId,
      target_email: params.targetEmail,
      details: params.details ?? null,
    })

    if (error) {
      console.error('[Audit Log Error]:', error.message)
    }
  } catch (err) {
    console.error('[Audit Log Exception]:', err)
  }
}

export async function updateUserRoleAction(targetUserId: string, newRole: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized. Please log in.' }
  }

  const { data: callerProfile } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', user.id)
    .single()

  if (!callerProfile || callerProfile.role !== 'admin') {
    return { success: false, error: 'Only admins can change user roles.' }
  }

  if (!VALID_ROLES.includes(newRole)) {
    return { success: false, error: 'Invalid role.' }
  }

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
    actorEmail: callerProfile.email || user.email || 'unknown',
    action: 'role_change',
    targetId: targetUserId,
    targetEmail: targetProfile?.email ?? 'unknown',
    details: { from: targetProfile?.role ?? null, to: newRole },
  })

  revalidatePath('/admin/users')
  revalidatePath('/admin/audit-log')
  return { success: true }
}

export async function deleteUserAction(targetUserId: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized. Please log in.' }
  }

  const { data: callerProfile } = await supabase
    .from('profiles')
    .select('role, email')
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

  await adminClient.from('profiles').delete().eq('id', targetUserId)

  const { error } = await adminClient.auth.admin.deleteUser(targetUserId)
  if (error) {
    return { success: false, error: error.message }
  }

  await logAdminAction({
    actorId: user.id,
    actorEmail: callerProfile.email || user.email || 'unknown',
    action: 'account_delete',
    targetId: targetUserId,
    targetEmail: targetProfile?.email ?? 'unknown',
  })

  revalidatePath('/admin/users')
  revalidatePath('/admin/audit-log')
  return { success: true }
}