import Link from 'next/link'
import { ArrowLeft, Radio } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 w-full text-center space-y-6">
      <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 text-red-600 border border-red-200">
        <Radio className="w-6 h-6" />
      </span>
      <div>
        <span className="block text-xs font-mono uppercase tracking-widest text-red-600 font-bold">Wire Error 404</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight">Signal Lost</h1>
      </div>
      <p className="font-serif text-zinc-600 max-w-md mx-auto">
        The dossier you&apos;re looking for doesn&apos;t exist, was retracted, or the wire connection dropped somewhere along the way.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 bg-black text-white hover:bg-red-600 px-5 py-2.5 text-xs font-mono uppercase tracking-wider font-bold transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Return to Wire Index
      </Link>
    </div>
  )
}