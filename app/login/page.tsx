import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PasswordInput } from '@/components/PasswordInput'
import { SubmitButton } from '@/components/SubmitButton'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string; redirect?: string }>
}) {
  const params = await searchParams
  const safeRedirect =
    typeof params.redirect === 'string' && params.redirect.startsWith('/') && !params.redirect.startsWith('//')
      ? params.redirect
      : '/'

  const handleLogin = async (formData: FormData) => {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      return redirect(`/login?error=${encodeURIComponent(error.message)}&redirect=${encodeURIComponent(safeRedirect)}`)
    }

    return redirect(safeRedirect)
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
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-600 font-bold">Secure Access</span>
            <h1 className="font-serif text-2xl font-black tracking-tight">Subscriber Sign In</h1>
          </div>

          {params?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 text-xs font-mono">
              {params.error}
            </div>
          )}

          <form action={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-600 block">Email Address</label>
              <input
                name="email"
                type="email"
                required
                className="w-full border border-zinc-300 p-3 text-sm font-mono focus:border-black focus:outline-none"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-600 block">Password</label>
                <Link href="/forgot-password" className="text-xs font-mono text-red-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <PasswordInput name="password" required placeholder="••••••••" autoComplete="current-password" />
            </div>

            <SubmitButton idleLabel="Sign In" pendingLabel="Signing In…" />
          </form>

          <div className="text-center pt-4 border-t border-zinc-200 text-xs font-mono text-zinc-600">
            Don't have an account?{' '}
            <Link href={`/register?redirect=${encodeURIComponent(safeRedirect)}`} className="text-red-600 font-bold hover:underline">
  Register here
</Link>
          </div>

        </div>
      </div>
    </div>
  )
}