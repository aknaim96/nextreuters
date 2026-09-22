import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the session — required so server components downstream
  // always see an up-to-date user, not a stale/expired cookie.
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // /profile — any authenticated user
  if (path.startsWith('/profile') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // /cms and everything under it — author/editor/admin only.
  // Same rule that was previously duplicated in cms/page.tsx and
  // cms/edit/[id]/page.tsx; this is now the single source of truth.
  if (path.startsWith('/cms')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || !['author', 'editor', 'admin'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/profile/:path*', '/cms/:path*'],
}