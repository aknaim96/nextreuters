'use server'

import { createClient } from '@/utils/supabase/server'
import { stripe, APP_URL } from '@/utils/stripe/server'

export async function createDonationSession(amount: number) {
  if (!amount || amount < 1) {
    return { success: false as const, error: 'Enter a valid amount (minimum $1).' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      quantity: 1,
      price_data: {
        currency: 'cad',
        unit_amount: Math.round(amount * 100),
        product_data: { name: 'Reader Donation' },
      },
    }],
    metadata: { type: 'donation', ...(user ? { user_id: user.id } : {}) },
    ...(user?.email ? { customer_email: user.email } : {}),
    success_url: `${APP_URL}/donate?success=1`,
    cancel_url: `${APP_URL}/donate?canceled=1`,
  })

  return { success: true as const, url: session.url }
}