'use client'

import { useEffect } from 'react'

export function ContentProtection() {
  useEffect(() => {
    // 1. Dynamic Attribution on Copy
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection()
      if (!selection || selection.toString().trim().length < 20) return // Only trigger for meaningful excerpts

      const text = selection.toString()
      const currentUrl = window.location.href
      const attribution = `\n\n— Read full report at Khan Chronicle: ${currentUrl}`
      
      const copyData = text + attribution

      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', copyData)
        e.preventDefault()
      }
    }

    // 2. Disable Right-Click Context Menu ONLY on Premium Articles
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-premium="true"]')) {
        e.preventDefault()
      }
    }

    document.addEventListener('copy', handleCopy)
    document.addEventListener('contextmenu', handleContextMenu)

    return () => {
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  return null
}