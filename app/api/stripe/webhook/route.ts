import { NextResponse } from 'next/server'
import { stripe } from '@/utils/stripe/server'
import { createServiceClient } from '@/utils/supabase/service'

function tierFromSubscription(sub: Stripe.Subscription): 'silver' | 'gold' | null {
  const priceId = sub.items.data[0]?.price?.id
  if (priceId === process.env.STRIPE_PRICE_SILVER) return 'silver'
  if (priceId === process.env.STRIPE_PRICE_GOLD) return 'gold'
  return null
}

function customerId(c: string | Stripe.Customer | null | undefined): string | null {
  if (!c) return null
  return typeof c === 'string' ? c : c.id
}

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature')
  const body = await request.text()
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const userId = session.client_reference_id || session.metadata?.user_id
      const cid = customerId(session.customer as string | Stripe.Customer | null)
      if (userId && cid) {
        await supabase.from('profiles').update({ stripe_customer_id: cid }).eq('id', userId)
      }
      break
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object
      const tier = tierFromSubscription(sub)
      const cid = customerId(sub.customer as string | Stripe.Customer | null)
      if (tier && cid) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', cid)
          .single()
        if (profile) {
          const active = ['active', 'trialing'].includes(sub.status)
          await supabase
            .from('profiles')
            .update({
              subscription_tier: active ? tier : 'none',
              subscription_status: sub.status,
            })
            .eq('id', profile.id)
        }
      }
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object
      const cid = customerId(sub.customer as string | Stripe.Customer | null)
      if (cid) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', cid)
          .single()
        if (profile) {
          await supabase
            .from('profiles')
            .update({ subscription_tier: 'none', subscription_status: 'canceled' })
            .eq('id', profile.id)
        }
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}