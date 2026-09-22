import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { formatDate } from '@/lib/format-date'
import { ProfileContactForm } from '@/components/ProfileContactForm'
import { TierSelector } from '@/components/TierSelector'
import { DonateTab } from '@/components/DonateTab'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const currentTier = profile?.subscription_tier ?? 'none'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full space-y-6">
      <Link
        href="/"
        className="inline-flex items-center text-xs font-mono text-zinc-500 hover:text-red-600 transition-colors"
      >
        <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Return to Wire Index
      </Link>

      {/* Everything lives inside one Account Dossier box, separated by section dividers */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">

        {/* Header section */}
        <div className="p-5 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-600 font-bold">Subscriber Management</span>
              <h1 className="font-serif text-3xl font-black tracking-tight">Account Dossier</h1>
            </div>
            <span className="text-xs font-mono uppercase bg-red-50 text-red-600 px-3 py-1.5 border border-red-200 font-bold">
              Role: {profile?.role || 'Subscriber'}
            </span>
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-500">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
              <span>Email: <span className="text-zinc-800 font-bold">{user.email}</span></span>
              <span>Member since {formatDate(user.created_at)}</span>
            </div>
            <form action="/auth/signout" method="POST">
              <button
                type="submit"
                className="bg-black text-white hover:bg-red-600 px-4 py-2 uppercase font-bold tracking-wider transition-colors"
              >
                Sign Out of Terminal
              </button>
            </form>
          </div>
        </div>

        {/* Contact information section */}
        <div className="p-5 sm:p-8 border-t-2 border-zinc-100 space-y-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-600 font-bold">Contact Information</span>
            <h2 className="font-serif text-xl font-bold">Your Details</h2>
          </div>
          <ProfileContactForm
            fullName={profile?.full_name ?? ''}
            phoneNumber={profile?.phone_number ?? ''}
            country={profile?.country ?? ''}
            stateProvince={profile?.state_province ?? ''}
          />
        </div>

        {/* Subscription tier section */}
        <div className="p-5 sm:p-8 border-t-2 border-zinc-100 space-y-4">
          <div className="text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-600 font-bold">Subscription</span>
            <h2 className="font-serif text-xl font-bold">Manage Your Tier</h2>
          </div>
          <TierSelector currentTier={currentTier} isAuthenticated={true} />
        </div>

        {/* Donation section */}
        <div className="p-5 sm:p-8 border-t-2 border-zinc-100">
          <DonateTab />
        </div>

      </div>
    </div>
  )
}