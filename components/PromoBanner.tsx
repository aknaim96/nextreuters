import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Crown, Award, ArrowRight } from 'lucide-react'

export async function PromoBanner() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let tier = 'none'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()
    if (profile) tier = profile.subscription_tier ?? 'none'
  }

  // Gold is the top tier — nothing left to upsell.
  if (tier === 'gold') return null

  // Logged out: register/subscribe CTA.
  if (!user) {
    return (
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-center gap-3 text-center">
          <span className="text-xs font-mono uppercase tracking-widest">
            Join CHRONICLE KHAN for full wire access
          </span>
          <Link
            href="/register"
            className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1 transition-colors"
          >
            Register / Subscribe <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    )
  }

  // Logged in, free tier: upgrade to either Silver or Gold.
  if (tier === 'none') {
    return (
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-center gap-3 text-center">
          <span className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-slate-300">
            <Award className="w-3.5 h-3.5" /> Silver
          </span>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">or</span>
          <span className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-amber-400">
            <Crown className="w-3.5 h-3.5" /> Gold
          </span>
          <span className="text-xs font-mono uppercase tracking-widest">— unlock full wire access</span>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1 transition-colors"
          >
            Upgrade Now <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    )
  }

  // Logged in, silver tier: upgrade to Gold specifically.
  return (
    <div className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-center gap-3 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest font-bold text-amber-400">
          <Crown className="w-3.5 h-3.5" /> Upgrade to Gold for full access
        </span>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest font-bold text-black bg-amber-400 hover:bg-amber-300 px-3 py-1 transition-colors"
        >
          Go Gold <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}