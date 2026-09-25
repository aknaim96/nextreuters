import Link from 'next/link'
import { Radio, ShieldCheck, PenLine, Heart } from 'lucide-react'

export const metadata = {
  title: 'About | Khan Chronicle',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full space-y-8">
      <div className="text-center border-b-2 border-black pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-red-600 font-bold">Our Story</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight mt-1">About Khan Chronicle</h1>
        <p className="font-serif text-zinc-600 mt-3 max-w-xl mx-auto">
          Redefining independent journalism through deep, thought-provoking reporting. We promote valuable knowledge for readers who live to learn and challenge their perspectives, one story at a time. Designed for readers who want to understand the world, not just watch it.
        </p>
      </div>

      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-8 space-y-6">
        <p className="Calibri text-lg text-zinc-800 leading-relaxed border-l-2 border-red-600 pl-4">
          Khan Chronicle started as a simple idea: markets move fast, and true coverage doesn't. We
          built a newsroom platform that publishes analysis, opinion, and projects with the
          urgency of offering a framework to endure present-day dilemma.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="flex gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-600 border border-red-200 shrink-0">
              <Radio className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-zinc-900">Read and Subscribe</h3>
              <p className="text-sm text-zinc-600 font-serif">
                Offering both free learning opportunity and premium experience through exclusive memberships. Explore sharp opinions and deep worldly analysis. 
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-600 border border-red-200 shrink-0">
              <PenLine className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-zinc-900">Book Club</h3>
              <p className="text-sm text-zinc-600 font-serif">
                Read smarter, not longer. In-depth book analysis and efficient summaries. Explore our online book club.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-600 border border-red-200 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-zinc-900">Editorial Standards</h3>
              <p className="text-sm text-zinc-600 font-serif">
                No corporate backing, no institutional bias. Just transparent, uncompromised reporting.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-600 border border-red-200 shrink-0">
              <Heart className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-zinc-900">Reader Supported</h3>
              <p className="text-sm text-zinc-600 font-serif">
                We're funded by our subscribers and direct reader donations — not ads.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center bg-black text-white hover:bg-red-600 px-5 py-2.5 text-xs font-mono uppercase tracking-wider font-bold transition-colors"
          >
            View Subscriptions
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center border border-black text-black hover:bg-zinc-100 px-5 py-2.5 text-xs font-mono uppercase tracking-wider font-bold transition-colors"
          >
            Contact & FAQs
          </Link>
        </div>
      </div>
    </div>
  )
}