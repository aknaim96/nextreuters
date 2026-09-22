'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfileAction(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized. Please log in.' }
  }

  const fullName = (formData.get('fullName') as string || '').trim()
  const phoneNumber = (formData.get('phoneNumber') as string || '').trim()
  const country = (formData.get('country') as string || '').trim()
  const stateProvince = (formData.get('stateProvince') as string || '').trim()

  if (fullName.length < 2) {
    return { success: false, error: 'Full name must be at least 2 characters.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      phone_number: phoneNumber || null,
      country: country || null,
      state_province: stateProvince || null,
    })
    .eq('id', user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/profile')
  return { success: true, error: '' }
}

// Self-serve tier switch — updates the stored tier directly with no real
// charge. Wire this to actual billing (Stripe, etc.) before launch.
export async function updateTierAction(tier: 'none' | 'silver' | 'gold') {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized. Please log in.' }
  }

  if (!['none', 'silver', 'gold'].includes(tier)) {
    return { success: false, error: 'Invalid tier.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ subscription_tier: tier })
    .eq('id', user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/profile')
  revalidatePath('/pricing')
  return { success: true, error: '' }
}