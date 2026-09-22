import { Skeleton } from '@/components/skeletons/Skeleton'

export default function HomeLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 w-full space-y-8 sm:space-y-12">
      <div className="flex justify-between items-center border-b-2 border-black pb-3">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8 sm:pb-12 border-b border-zinc-300">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-4 w-32 mb-2" />
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2 pb-6 border-b border-zinc-200 last:border-none">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Skeleton className="h-4 w-56 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border border-zinc-200 p-6 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}