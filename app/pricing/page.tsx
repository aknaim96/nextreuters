import { createClient } from '@/utils/supabase/server'
import { TierSelector } from '@/components/TierSelector'

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; canceled?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let currentTier = 'none'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()
    if (profile) currentTier = profile.subscription_tier ?? 'none'
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full">
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-8 space-y-8">
        <div className="text-center border-b-2 border-black pb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold">Wire Access</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight">Subscription Plans</h1>
          <p className="font-serif text-zinc-600 mt-2 max-w-xl mx-auto">
            Straightforward monthly pricing. Upgrade, downgrade, or cancel anytime.
          </p>
        </div>

        {params.canceled && (
          <div className="bg-zinc-50 border border-zinc-200 text-zinc-600 p-3 text-xs font-mono text-center">
            Checkout was canceled — you can try again anytime.
          </div>
        )}

        <TierSelector currentTier={currentTier} isAuthenticated={!!user} plan={params.plan} />
      </div>
    </div>
  )
}