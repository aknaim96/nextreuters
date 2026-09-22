'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteArticleAction } from '@/app/actions/article'

export default function DeleteButton({ articleId }: { articleId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!window.confirm('Delete this article? This cannot be undone.')) {
      return
    }
    startTransition(async () => {
      await deleteArticleAction(articleId)
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex text-gray-400 hover:text-red-600 disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}