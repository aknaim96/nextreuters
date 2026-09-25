import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { registerSchema } from '@/lib/schemas'
import { PasswordInput } from '@/components/PasswordInput'
import { TermsAgreementSubmit } from '@/components/TermsAgreementSubmit'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string; redirect?: string }>
}) {
  const params = await searchParams
  const safeRedirect =
    typeof params.redirect === 'string' && params.redirect.startsWith('/') && !params.redirect.startsWith('//')
      ? params.redirect
      : '/'

  const handleRegister = async (formData: FormData) => {
    'use server'

    if (formData.get('agreedToTerms') !== 'on') {
      return redirect(`/register?error=${encodeURIComponent('You must agree to the Terms of Service and Privacy Policy to create an account.')}&redirect=${encodeURIComponent(safeRedirect)}`)
    }

    const result = registerSchema.safeParse({
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      password: formData.get('password'),
      phoneNumber: formData.get('phoneNumber'),
    })

    if (!result.success) {
      return redirect(`/register?error=${encodeURIComponent(result.error.issues[0].message)}&redirect=${encodeURIComponent(safeRedirect)}`)
    }

    const { fullName, email, password, phoneNumber } = result.data
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone_number: phoneNumber || null },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=${encodeURIComponent(safeRedirect)}`,
      },
    })

    if (error) {
      return redirect(`/register?error=${encodeURIComponent(error.message)}&redirect=${encodeURIComponent(safeRedirect)}`)
    }

    return redirect(`/login?message=${encodeURIComponent('Registration successful. Please check your email or sign in.')}&redirect=${encodeURIComponent(safeRedirect)}`)
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-md w-full space-y-6">
        
        <Link
          href="/"
          className="inline-flex items-center text-xs font-mono text-zinc-500 hover:text-red-600 transition-colors"
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Return to Wire Index
        </Link>

        <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6">
          
          <div className="space-y-2 border-b-2 border-black pb-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-600 font-bold">New Account</span>
            <h1 className="font-serif text-2xl font-black tracking-tight">Create Your Account</h1>
          </div>

          {params?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-xs font-mono">
              {params.error}
            </div>
          )}

          {params?.message && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-3 text-xs font-mono">
              {params.message}
            </div>
          )}

          <form action={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-600 block">Full Name</label>
              <input
                name="fullName"
                type="text"
                required
                autoComplete="name"
                className="w-full border border-zinc-300 p-3 text-sm font-mono focus:border-black focus:outline-none"
                placeholder="Jane Doe"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-600 block">Email Address</label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full border border-zinc-300 p-3 text-sm font-mono focus:border-black focus:outline-none"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-600 block">
                Phone Number <span className="text-zinc-400 lowercase">(optional)</span>
              </label>
              <input
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                className="w-full border border-zinc-300 p-3 text-sm font-mono focus:border-black focus:outline-none"
                placeholder="Optional"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-600 block">Password</label>
              <PasswordInput name="password" required placeholder="At least 6 characters" autoComplete="new-password" />
            </div>

            <TermsAgreementSubmit idleLabel="Create Account" pendingLabel="Creating Account…" variant="accent" />
          </form>

          <div className="text-center pt-4 border-t border-zinc-200 text-xs font-mono text-zinc-600">
            Already have an account?{' '}
            <Link href="/login" className="text-red-600 font-bold hover:underline">
              Sign In here
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}