'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, AlignLeft } from 'lucide-react'

function TOCList({ headings }: { headings: { id: string; text: string }[] }) {
  return (
    <ul>
      {headings.map((h, idx) => {
        const isLast = idx === headings.length - 1
        return (
          <li
            key={h.id}
            className={'group relative pl-4 border-l-2 ' + (isLast ? 'border-transparent' : 'border-zinc-200')}
          >
            <span className="absolute top-2.5 -left-[5px] w-2.5 h-2.5 rounded-full border-2 border-zinc-300 bg-white z-10 transition-colors group-hover:border-red-600 group-hover:bg-red-600" />
            <a href={`#${h.id}`} className="block py-2 pr-1 font-mono text-xs leading-snug">
              <span className="font-bold text-zinc-800 transition-colors group-hover:text-red-600">{h.text}</span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export function ArticleTOCLayout({
  headings,
  children,
}: {
  headings: { id: string; text: string }[]
  children: React.ReactNode
}) {
  // Starts collapsed on every screen size — on mobile the panel is a full overlay,
  // so opening it automatically on page load would hide the article on arrival.
  const [collapsed, setCollapsed] = useState(true)

  // Nothing to index — just render the article with no layout changes.
  if (headings.length === 0) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {/* Dimmed backdrop behind the panel on small screens only — tap to close. */}
      {!collapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setCollapsed(true)}
          aria-hidden="true"
        />
      )}

      {/* The panel: on large screens it's a sidebar that pushes content; on small
          screens it's the same fixed panel but overlays on top instead. */}
      {!collapsed && (
        <aside className="fixed left-0 top-20 bottom-6 z-30 w-72 max-w-[80vw]">
          <nav className="h-full flex flex-col bg-white border border-zinc-300 shadow-lg">
            <div className="px-4 py-3 bg-black shrink-0">
              <span className="font-mono text-[11px] uppercase tracking-widest text-white font-bold flex items-center gap-2">
                <AlignLeft className="w-3.5 h-3.5 text-red-500" />
                Story Contents
              </span>
            </div>
            <div className="flex-1 overflow-y-auto py-4 pl-6 pr-3">
              <TOCList headings={headings} />
            </div>
          </nav>
        </aside>
      )}

      {/* One consistent red pull-tab for both states, at every screen size,
          vertically centered on the left edge, sliding to the panel's edge when open. */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Expand story contents' : 'Collapse story contents'}
        className={`fixed top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 w-9 py-4 bg-red-600 hover:bg-red-700 rounded-r-md shadow-lg transition-all duration-200 ${
          collapsed ? 'left-0' : 'left-72 max-[400px]:left-[80vw]'
        }`}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-white" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-white" />
        )}
        <span className="font-mono text-[9px] uppercase tracking-widest text-white [writing-mode:vertical-rl] rotate-180">
          Contents
        </span>
      </button>

      {/* Content only shifts right on large screens, where the panel pushes rather than overlays. */}
      <div className={`transition-[padding] duration-200 ${!collapsed ? 'lg:pl-80' : ''}`}>
        {children}
      </div>
    </div>
  )
}