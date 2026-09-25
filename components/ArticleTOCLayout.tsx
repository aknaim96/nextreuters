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
  const [collapsed, setCollapsed] = useState(true)

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

      {/* The sidebar panel */}
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

      {/* Hugs the left edge (left-0), centered vertically, slimmer width (w-7) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Expand story contents' : 'Collapse story contents'}
        className={`fixed top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-1.5 w-7 py-3 bg-red-600 hover:bg-red-700 rounded-r-md shadow-md transition-all duration-200 ${
          collapsed ? 'left-0' : 'left-72 max-[400px]:left-[80vw]'
        }`}
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-white" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 text-white" />
        )}
        <span className="font-mono text-[8px] uppercase tracking-wider text-white [writing-mode:vertical-rl] rotate-180">
          Contents
        </span>
      </button>

      {/* Content layout shift */}
      <div className={`transition-[padding] duration-200 ${!collapsed ? 'lg:pl-80' : ''}`}>
        {children}
      </div>
    </div>
  )
}