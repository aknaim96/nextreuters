import { Skeleton } from '@/components/skeletons/Skeleton'

export default function PricingLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full">
      <div className="bg-white border-2 border-black p-5 sm:p-8 space-y-8">
        <div className="text-center border-b-2 border-black pb-6 space-y-2">
          <Skeleton className="h-3 w-24 mx-auto" />
          <Skeleton className="h-9 w-72 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}