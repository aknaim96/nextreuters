import Link from 'next/link'
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react'

interface PaywallGateProps {
  requiredTier: 'none' | 'silver' | 'gold'
  userTier: 'none' | 'silver' | 'gold' | string
  isAuthenticated: boolean
  excerpt: string
}

const skeletonLineWidths = ['100%', '95%', '88%', '92%', '60%']

export function PaywallGate({
  requiredTier,
  userTier,
  isAuthenticated,
  excerpt,
}: PaywallGateProps) {
  return (
    <div className="relative border border-gray-200 bg-white overflow-hidden">
<div className="p-5 sm:p-8 pb-0">
        <p className="font-serif text-lg leading-relaxed text-gray-800">{excerpt}</p>
      </div>

<div className="px-5 sm:px-8 pt-6 pb-24 select-none pointer-events-none">
          <div className="space-y-3 filter blur-[3px] opacity-50">
          {skeletonLineWidths.map((width, i) => (
            <div
              key={i}
              className="h-3 bg-gray-300 rounded-sm"
              style={{ width }}
            />
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col">
        {/* Short blend strip — purely a soft visual transition into the blurred teaser text above */}
        <div className="h-14 bg-gradient-to-t from-white to-transparent" />

        {/* Fully solid message panel — never has anything bleeding through it */}
        <div className="bg-white border-t border-gray-100 shadow-[0_-8px_20px_-8px_rgba(0,0,0,0.08)] flex flex-col items-center text-center px-6 pt-5 pb-8">
          <div className="bg-red-600/10 p-3 mb-3 border border-red-200 text-red-600 rounded-sm">
            <Lock className="w-5 h-5" />
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold mb-1">
            Restricted Intelligence Dossier
          </span>
          <h3 className="font-serif font-bold text-xl md:text-2xl text-gray-900 max-w-md">
            This article requires a <span className="text-red-600 uppercase">{requiredTier}</span> subscription.
          </h3>
          <p className="text-xs text-gray-600 mt-2 max-w-sm font-serif">
            {!isAuthenticated
              ? 'Sign in or create an account to upgrade your clearance level and access unencrypted market analysis.'
              : `Your current tier (${userTier}) does not grant clearance for this wire. Upgrade to ${requiredTier} to unlock full access.`}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="flex-1 inline-flex items-center justify-center bg-red-600 text-white text-xs font-mono uppercase tracking-wider py-2.5 hover:bg-red-700 transition-colors"
                >
                  Sign In <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/register"
                  className="flex-1 inline-flex items-center justify-center bg-black text-white text-xs font-mono uppercase tracking-wider py-2.5 hover:bg-red-600 transition-colors"
                >
                  Register
                </Link>
              </>
            ) : (
              <Link
                href="/profile"
                className="w-full inline-flex items-center justify-center bg-red-600 text-white text-xs font-mono uppercase tracking-wider py-2.5 hover:bg-red-700 transition-colors"
              >
                <ShieldAlert className="mr-1.5 w-3.5 h-3.5" /> Upgrade Subscription Tier
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}