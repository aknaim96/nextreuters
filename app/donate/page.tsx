import { Heart } from 'lucide-react'
import { DonateTab } from '@/components/DonateTab'

export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>
}) {
  const params = await searchParams

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 w-full">
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="h-1.5 bg-red-600" />
        <div className="mx-5 sm:mx-8 mt-3 border-t-2 border-dashed border-red-200" />
        <div className="text-center px-5 sm:px-8 pt-6 pb-6 border-b-2 border-black space-y-3">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-600 border border-red-200">
            <Heart className="w-5 h-5" />
          </span>
          <span className="block text-xs font-mono uppercase tracking-widest text-red-600 font-bold">Reader Supported</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight">Support the Newsroom</h1>
          <p className="font-serif text-zinc-700 italic border-l-2 border-red-600 pl-4 max-w-md mx-auto text-left">
            Independent journalism costs money to produce. If CHRONICLE KHAN is worth something to you, a
            direct contribution — of any size — helps keep the wire running. No account required.
          </p>
        </div>

        <div className="p-5 sm:p-8">
          <DonateTab success={params.success === '1'} canceled={params.canceled === '1'} />
        </div>
      </div>
    </div>
  )
}