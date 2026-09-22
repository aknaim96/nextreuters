'use client'

import { useTransition } from 'react'
import { CheckCircle } from 'lucide-react'
import { publishArticleAction } from '@/app/actions/article'

export default function PublishButton({ articleId }: { articleId: string }) {
  const [isPending, startTransition] = useTransition()

  const handlePublish = () => {
    startTransition(async () => {
      await publishArticleAction(articleId)
    })
  }

  return (
    <button
      onClick={handlePublish}
      disabled={isPending}
      className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 px-2 py-1 disabled:opacity-50 transition-colors"
    >
      <CheckCircle className="w-3 h-3" />
      {isPending ? 'Publishing…' : 'Publish'}
    </button>
  )
}