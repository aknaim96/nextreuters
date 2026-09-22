import { Skeleton } from '@/components/skeletons/Skeleton'

export default function CMSLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 w-full">
      <div className="flex justify-between items-end mb-8">
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-9 w-56" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>
      <div className="bg-white border border-gray-200">
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <Skeleton className="h-3 w-full" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 border-b border-gray-100 flex gap-4">
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}