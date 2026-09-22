import { Skeleton } from '@/components/skeletons/Skeleton'

export default function ArticleLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f7]">
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 sm:py-12 w-full">
        <Skeleton className="h-4 w-40 mb-8" />
        <div className="bg-white border border-gray-200 p-5 sm:p-8 md:p-12 space-y-6">
          <div className="flex justify-between border-b border-gray-100 pb-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-full" />
          <div className="pt-6 border-t border-gray-100 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </main>
    </div>
  )
}