import Link from 'next/link'
import { Heart, MessageCircleQuestion, FileText, ShieldCheck } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t-2 border-black bg-white text-zinc-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <div className="font-serif font-black text-2xl tracking-tighter flex items-center space-x-1">
              <span>KHAN CHRONICLE</span>
              <span className="text-red-600">\</span>
            </div>
            <p className="font-serif text-sm text-zinc-600 max-w-sm leading-relaxed">
              Delivering uncompromising independent journalism since inception.
            </p>
            <Link
              href="/donate"
              className="inline-flex items-center gap-1.5 bg-red-600 text-white hover:bg-red-700 px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold transition-colors"
            >
              <Heart className="w-3.5 h-3.5" /> Support the Newsroom
            </Link>
          </div>

          {/* Sections */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-600 font-bold block">Sections</span>
            <nav className="flex flex-col gap-2 text-sm font-mono text-zinc-600">
              <Link href="/markets" className="hover:text-red-600 transition-colors">Markets</Link>
              <Link href="/opinion" className="hover:text-red-600 transition-colors">Opinion</Link>
              <Link href="/book-club" className="hover:text-red-600 transition-colors">Book Club</Link>
              <Link href="/projects" className="hover:text-red-600 transition-colors">Projects</Link>
            </nav>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-600 font-bold block">Company</span>
            <nav className="flex flex-col gap-2 text-sm font-mono text-zinc-600">
              <Link href="/about" className="hover:text-red-600 transition-colors">About</Link>
              <Link href="/pricing" className="hover:text-red-600 transition-colors">Pricing</Link>
              <Link href="/contact" className="inline-flex items-center gap-1.5 hover:text-red-600 transition-colors">
                <MessageCircleQuestion className="w-3.5 h-3.5" /> Contact & FAQs
              </Link>
            </nav>
          </div>

        </div>

        {/* Legal + copyright bar */}
        <div className="mt-10 pt-6 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono text-zinc-500">
          <div>
            © {new Date().getFullYear()} Khan Chronicle News & Intelligence Inc. All rights reserved.
            <div className="mt-1">Inspiring the world one article at a time.</div>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="inline-flex items-center gap-1.5 text-red-600 hover:underline">
              <FileText className="w-3.5 h-3.5" /> Terms of Service
            </Link>
            <Link href="/privacy" className="inline-flex items-center gap-1.5 text-red-600 hover:underline">
              <ShieldCheck className="w-3.5 h-3.5" /> Privacy Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}