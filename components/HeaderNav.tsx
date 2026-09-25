'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Crown, Award, Tag, Settings, Shield, Users } from 'lucide-react'

interface HeaderNavProps {
  userEmail: string | null
  canAccessCMS: boolean
  isAdmin: boolean
  subscriptionTier: string
}

function ProfileBadge({
  tier,
  email,
  onClick,
}: {
  tier: string
  email: string
  onClick?: () => void
}) {
  if (tier === 'gold') {
    return (
      <Link
        href="/profile"
        onClick={onClick}
        className="group relative inline-flex items-center gap-2 pl-1.5 pr-4 py-1 rounded-md border border-amber-700/40 bg-gradient-to-b from-yellow-200 via-amber-400 to-yellow-600 shadow-md shadow-amber-900/20 hover:brightness-105 transition-all overflow-hidden"
      >
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-black/10" />
        <span className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 ring-2 ring-amber-200/70 shadow-inner -rotate-6">
          <Crown className="w-3.5 h-3.5 text-amber-100" />
        </span>
        <span className="relative z-10 text-xs font-mono font-bold tracking-wide text-amber-900 [text-shadow:0_1px_0_rgba(255,255,255,0.6),0_-1px_0_rgba(120,53,15,0.5)]">
          {email}
        </span>
      </Link>
    )
  }

  if (tier === 'silver') {
    return (
      <Link
        href="/profile"
        onClick={onClick}
        className="group relative inline-flex items-center gap-2 pl-1.5 pr-4 py-1 rounded-md border border-slate-500/40 bg-gradient-to-b from-zinc-100 via-slate-300 to-zinc-400 shadow-md shadow-slate-900/20 hover:brightness-105 transition-all overflow-hidden"
      >
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-black/10" />
        <span className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-slate-600 ring-2 ring-slate-200/70 shadow-inner -rotate-6">
          <Award className="w-3.5 h-3.5 text-slate-100" />
        </span>
        <span className="relative z-10 text-xs font-mono font-bold tracking-wide text-slate-700 [text-shadow:0_1px_0_rgba(255,255,255,0.7),0_-1px_0_rgba(30,41,59,0.4)]">
          {email}
        </span>
      </Link>
    )
  }

  return (
    <Link
      href="/profile"
      onClick={onClick}
      className="text-xs font-mono text-zinc-600 hover:text-red-600 transition-colors underline decoration-dotted underline-offset-4 font-bold"
    >
      {email}
    </Link>
  )
}

export function HeaderNav({ userEmail, canAccessCMS, isAdmin, subscriptionTier }: HeaderNavProps) {
  const [open, setOpen] = useState(false)
  const [adminMenuOpen, setAdminMenuOpen] = useState(false)
  const adminMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setAdminMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="border-b border-zinc-300 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 grid grid-cols-[auto_1fr_auto] items-center gap-4">
        
        {/* Logo with Gold Shimmer Hover Effect */}
        <Link href="/" className="group flex items-center space-x-1 justify-self-start py-1">
          <span className="font-serif font-black text-2xl tracking-tighter text-zinc-900 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-yellow-600 group-hover:via-amber-500 group-hover:to-yellow-700 group-hover:bg-clip-text group-hover:text-transparent">
            KHAN CHRONICLE
          </span>
        </Link>

        {/* Desktop: Primary Nav Centered */}
        <nav className="hidden md:flex items-center justify-center space-x-6 font-mono text-xs uppercase tracking-wider text-zinc-700 font-medium">
          <Link href="/markets" className="hover:text-red-600 transition-colors">Markets</Link>
          <Link href="/opinion" className="hover:text-red-600 transition-colors">Opinion</Link>
          <Link href="/book-club" className="hover:text-red-600 transition-colors">Book Club</Link>
          <Link href="/projects" className="hover:text-red-600 transition-colors">Projects</Link>
          <Link href="/about" className="hover:text-red-600 transition-colors">About</Link>
          <Link href="/search" className="hover:text-red-600 transition-colors">Search</Link>
        </nav>

        {/* Desktop: Account Area */}
        <div className="hidden md:flex items-center gap-4 justify-self-end">
          {subscriptionTier !== 'silver' && subscriptionTier !== 'gold' && (
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest font-bold text-zinc-600 border border-zinc-300 hover:border-black hover:text-black px-3.5 py-1.5 rounded-full transition-colors"
            >
              <Tag className="w-3 h-3" />
              Pricing
            </Link>
          )}

          {/* Your Original Unaltered Donate Button */}
          <Link
            href="/donate"
            className="inline-flex items-center text-[11px] font-mono uppercase tracking-widest font-bold text-red-600 border border-red-600 hover:bg-red-600 hover:text-white px-3.5 py-1.5 rounded-full transition-colors"
          >
            Donate
          </Link>

          {userEmail ? (
            <div className="flex items-center space-x-3">
              {/* Editorial Desk & Users Dropdown Settings Toggle */}
              {(canAccessCMS || isAdmin) && (
                <div className="relative" ref={adminMenuRef}>
                  <button
                    onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                    aria-label="Management Settings"
                    className="p-1.5 rounded-md border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 hover:text-red-600 transition-colors shadow-2xs flex items-center justify-center"
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  {adminMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-300 shadow-lg rounded-xs py-1.5 z-50 font-mono text-xs uppercase tracking-wider">
                      {canAccessCMS && (
                        <Link
                          href="/cms"
                          onClick={() => setAdminMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-red-600 font-bold transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5 text-red-600" />
                          Editorial Desk
                        </Link>
                      )}
                      {isAdmin && (
                        <Link
                          href="/admin/users"
                          onClick={() => setAdminMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-black font-bold transition-colors border-t border-zinc-100"
                        >
                          <Users className="w-3.5 h-3.5 text-black" />
                          Users
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}

              <ProfileBadge tier={subscriptionTier} email={userEmail} />

              <form action="/auth/signout" method="POST">
                <button
                  type="submit"
                  className="bg-black text-white text-xs font-mono uppercase tracking-wider px-3 py-1.5 hover:bg-red-600 transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="bg-orange-500 text-white text-xs font-mono uppercase tracking-wider px-3 py-1.5 hover:bg-red-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-black text-white text-xs font-mono uppercase tracking-wider px-3 py-1.5 hover:bg-red-600 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-zinc-700 hover:text-red-600 transition-colors justify-self-end"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden absolute left-0 right-0 top-16 bg-white border-b border-zinc-300 shadow-lg">
          <nav className="flex flex-col px-4 py-4 space-y-3 font-mono text-xs uppercase tracking-wider text-zinc-700">
            <Link href="/markets" onClick={() => setOpen(false)} className="hover:text-red-600 transition-colors">Markets</Link>
            <Link href="/opinion" onClick={() => setOpen(false)} className="hover:text-red-600 transition-colors">Opinion</Link>
            <Link href="/book-club" onClick={() => setOpen(false)} className="hover:text-red-600 transition-colors">Book Club</Link>
            <Link href="/projects" onClick={() => setOpen(false)} className="hover:text-red-600 transition-colors">Projects</Link>
            <Link href="/about" onClick={() => setOpen(false)} className="hover:text-red-600 transition-colors">About</Link>
            <Link href="/search" onClick={() => setOpen(false)} className="hover:text-red-600 transition-colors">Search</Link>
            
            <div className="flex items-center gap-2 pt-1">
              {subscriptionTier !== 'silver' && subscriptionTier !== 'gold' && (
                <Link
                  href="/pricing"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-zinc-600 border border-zinc-300 px-3.5 py-1.5 rounded-full"
                >
                  <Tag className="w-3 h-3" />
                  Pricing
                </Link>
              )}
              <Link
                href="/donate"
                onClick={() => setOpen(false)}
                className="inline-flex items-center text-[11px] font-bold text-red-600 border border-red-600 px-3.5 py-1.5 rounded-full"
              >
                Donate
              </Link>
            </div>

            {(canAccessCMS || isAdmin) && (
              <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100">
                {canAccessCMS && (
                  <Link href="/cms" onClick={() => setOpen(false)} className="text-red-600 font-bold flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> Editorial Desk
                  </Link>
                )}
                {isAdmin && (
                  <Link href="/admin/users" onClick={() => setOpen(false)} className="text-black font-bold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Users Management
                  </Link>
                )}
              </div>
            )}
          </nav>
          
          <div className="px-4 pb-4 border-t border-zinc-100 pt-4">
            {userEmail ? (
              <div className="flex flex-col gap-3">
                <ProfileBadge tier={subscriptionTier} email={userEmail} onClick={() => setOpen(false)} />
                <form action="/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="w-full bg-black text-white text-xs font-mono uppercase tracking-wider px-3 py-2 hover:bg-red-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center bg-orange-500 text-white text-xs font-mono uppercase tracking-wider px-3 py-2 hover:bg-red-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center bg-black text-white text-xs font-mono uppercase tracking-wider px-3 py-2 hover:bg-red-600 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}