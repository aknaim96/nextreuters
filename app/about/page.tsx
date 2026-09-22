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
          Independent financial journalism, delivered like a wire dispatch — fast, direct, and built to
          be read by people who actually make decisions with the information.
        </p>
      </div>

      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-8 space-y-6">
        <p className="font-serif text-lg text-zinc-800 leading-relaxed italic border-l-2 border-red-600 pl-4">
          Khan Chronicle started as a simple idea: markets move fast, and most coverage doesn't. We
          built a newsroom platform that publishes analysis, opinion, and long-form projects with the
          urgency of a wire feed and the depth of a proper newsroom.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="flex gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-600 border border-red-200 shrink-0">
              <Radio className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-zinc-900">Markets & Opinion</h3>
              <p className="text-sm text-zinc-600 font-serif">
                Real-time market coverage alongside sharp, independent editorial takes — not just headlines.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-600 border border-red-200 shrink-0">
              <PenLine className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-serif font-bold text-zinc-900">Book Club & Projects</h3>
              <p className="text-sm text-zinc-600 font-serif">
                Long-form dossiers and reading picks for readers who want more than a quick take.
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
                Every article moves through a draft-and-review process — authors submit, editors publish.
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
                We're funded by Silver and Gold subscribers and direct reader donations — not ads.
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