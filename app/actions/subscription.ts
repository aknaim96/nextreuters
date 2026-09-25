'use server'

import { createClient } from '@/utils/supabase/server'
import { stripe, APP_URL } from '@/utils/stripe/server'

export async function createCheckoutSession(tier: 'silver' | 'gold') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false as const, error: 'Unauthorized. Please log in.' }

  const priceId = tier === 'silver' ? process.env.STRIPE_PRICE_SILVER : process.env.STRIPE_PRICE_GOLD
  if (!priceId) return { success: false as const, error: 'This tier is not configured yet.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: user.id,
    metadata: { user_id: user.id, tier },
    subscription_data: { metadata: { user_id: user.id, tier } },
    ...(profile?.stripe_customer_id
      ? { customer: profile.stripe_customer_id }
      : { customer_email: user.email ?? undefined }),
    success_url: `${APP_URL}/profile?checkout=success`,
    cancel_url: `${APP_URL}/pricing?canceled=1`,
    allow_promotion_codes: true,
  })

  return { success: true as const, url: session.url }
}

export async function createPortalSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false as const, error: 'Unauthorized. Please log in.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (!profile?.stripe_customer_id) {
    return { success: false as const, error: 'No active subscription found.' }
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${APP_URL}/profile`,
  })

  return { success: true as const, url: session.url }
}