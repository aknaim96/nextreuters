import { Skeleton } from '@/components/skeletons/Skeleton'

export default function ProfileLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 w-full space-y-6">
      <Skeleton className="h-4 w-40" />
      <div className="bg-white border-2 border-black">
        <div className="p-5 sm:p-8 space-y-4">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-8 w-56" />
          <div className="pt-6 border-t border-zinc-200 flex justify-between">
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-9 w-40" />
          </div>
        </div>
        <div className="p-5 sm:p-8 border-t-2 border-zinc-100 space-y-4">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="p-5 sm:p-8 border-t-2 border-zinc-100 space-y-4">
          <Skeleton className="h-6 w-40 mx-auto" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}