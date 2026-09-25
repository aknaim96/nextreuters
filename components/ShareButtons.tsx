'use client'

import { useState } from 'react'
import { Link2, Check, Share2 } from 'lucide-react'

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = window.location.href

    // Check if the browser supports the native Web Share API (WhatsApp, Mail, Messages, etc.)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out this article on Khan Chronicle: ${title}`,
          url,
        })
      } catch (err) {
        // User cancelled the native share sheet or sharing failed
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err)
        }
      }
    } else {
      // Fallback for older desktop browsers: Copy link to clipboard
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center space-x-2 text-xs font-mono select-none">
      {/* Primary Native Share Button (WhatsApp, Email, Socials) */}
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 font-medium transition-colors shadow-2xs"
      >
        <Share2 className="w-3.5 h-3.5 mr-1.5 text-red-600" /> Share Article
      </button>

      {/* Copy Link Direct Button */}
      <button
        type="button"
        onClick={handleCopyLink}
        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 mr-1 text-green-600" /> Link Copied
          </>
        ) : (
          <>
            <Link2 className="w-3.5 h-3.5 mr-1 text-gray-500" /> Copy Link
          </>
        )}
      </button>
    </div>
  )
}