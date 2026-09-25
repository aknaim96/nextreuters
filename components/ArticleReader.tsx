'use client'

import { useState, useEffect, useRef } from 'react'
import { Type, Link2, Check, Share2, Palette, Sliders, X } from 'lucide-react'

type FontLevel = 'sm' | 'md' | 'lg' | 'xl'
type ReadingTheme = 'default' | 'dark' | 'green' | 'peach'
type FontMode = 'serif' | 'times' | 'sans' | 'mono'

const FONT_SIZE_CLASSES: Record<FontLevel, string> = {
  sm: 'text-base leading-relaxed',
  md: 'text-lg leading-relaxed',
  lg: 'text-xl leading-relaxed',
  xl: 'text-2xl leading-loose',
}

const FONT_FAMILY_CLASSES: Record<FontMode, string> = {
  serif: 'font-serif tracking-normal',
  times: 'font-serif font-normal tracking-normal',
  sans: 'font-sans tracking-tight',
  mono: 'font-mono text-sm tracking-normal',
}

interface Block {
  id: string
  type: string
  text: string
}

interface ArticleReaderProps {
  title: string
  blocks: Block[]
  requiredTier?: string | null
  isPremium?: boolean
}

export function ArticleReader({ title, blocks, requiredTier, isPremium }: ArticleReaderProps) {
  const [fontSize, setFontSize] = useState<FontLevel>('md')
  const [fontMode, setFontMode] = useState<FontMode>('serif')
  const [theme, setTheme] = useState<ReadingTheme>('default')
  const [copied, setCopied] = useState(false)
  
  const [showFloatingButton, setShowFloatingButton] = useState(false)
  const [isFloatingExpanded, setIsFloatingExpanded] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const isGold = isPremium && requiredTier === 'gold'
  const isSilver = isPremium && requiredTier === 'silver'

  useEffect(() => {
    const handleScroll = () => {
      if (toolbarRef.current) {
        const rect = toolbarRef.current.getBoundingClientRect()
        setShowFloatingButton(rect.bottom < 0)
        if (rect.bottom >= 0) {
          setIsFloatingExpanded(false)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getCanvasStyles = () => {
    if (theme === 'dark') return 'bg-zinc-950 text-zinc-100 border border-zinc-800 p-6 rounded-xs shadow-inner font-serif'
    if (theme === 'green') return 'bg-[#eaf2e8] text-zinc-900 border border-[#c2d7c0] p-6 rounded-xs shadow-inner font-serif'
    if (theme === 'peach') return 'bg-[#fcf1eb] text-zinc-900 border border-[#f4d8cc] p-6 rounded-xs shadow-inner font-serif'
    return 'bg-transparent text-gray-900 p-0 font-serif'
  }

  const getToolbarStyles = () => {
    if (theme === 'dark') return 'bg-zinc-900 border-zinc-700 text-zinc-200'
    if (theme === 'green') return 'bg-[#dbebd8] border-[#b4d0b0] text-zinc-900'
    if (theme === 'peach') return 'bg-[#fae2d6] border-[#e9bcab] text-zinc-900'
    if (isGold) return 'bg-amber-100/70 border-amber-300 text-amber-950'
    if (isSilver) return 'bg-slate-200/70 border-slate-300 text-slate-900'
    return 'bg-gray-50 border-gray-200 text-gray-800'
  }

  const getActiveButtonStyles = () => {
    if (theme === 'dark') return 'bg-zinc-700 text-white font-bold border-zinc-600'
    if (theme === 'green') return 'bg-[#5b8a58] text-white font-bold border-[#497046]'
    if (theme === 'peach') return 'bg-[#d07452] text-white font-bold border-[#b45e3e]'
    if (isGold) return 'bg-amber-600 text-white font-bold border-amber-700'
    if (isSilver) return 'bg-slate-700 text-white font-bold border-slate-800'
    return 'bg-red-600 text-white font-bold'
  }

  const getInactiveButtonStyles = () => {
    if (theme === 'dark') return 'hover:bg-zinc-800 text-zinc-300 border-zinc-700 bg-zinc-900'
    if (theme === 'green') return 'hover:bg-[#cbe3c8] text-zinc-800 border-[#b4d0b0] bg-white/70'
    if (theme === 'peach') return 'hover:bg-[#f3cdc0] text-zinc-800 border-[#e9bcab] bg-white/70'
    if (isGold) return 'hover:bg-amber-200/80 text-amber-900 border-amber-300 bg-white/60'
    if (isSilver) return 'hover:bg-slate-300/80 text-slate-800 border-slate-300 bg-white/60'
    return 'hover:bg-gray-100 text-gray-700 border-gray-300 bg-white'
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `Check out this report on Khan Chronicle: ${title}`, url })
      } catch (err: any) {
        if (err.name !== 'AbortError') console.error('Error sharing:', err)
      }
    } else {
      await handleCopyLink()
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  return (
    <div className="space-y-6 relative">
      {/* Original In-Flow Toolbar */}
      <div ref={toolbarRef} className={`flex flex-col xl:flex-row xl:items-center justify-between gap-3 py-3 px-4 border font-mono select-none rounded-xs shadow-2xs transition-colors duration-300 ${getToolbarStyles()}`}>
        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] uppercase font-bold opacity-70">Font:</span>
          <div className="inline-flex rounded-xs overflow-hidden border">
            {(['serif', 'times', 'sans', 'mono'] as FontMode[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFontMode(f)}
                className={`px-2 py-1 text-[10px] uppercase transition-colors border-r last:border-r-0 ${
                  fontMode === f ? getActiveButtonStyles() : getInactiveButtonStyles()
                }`}
              >
                {f === 'times' ? 'Times' : f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <Type className="w-3.5 h-3.5 opacity-70" />
          <span className="text-[10px] uppercase font-bold opacity-70">Size:</span>
          <div className="inline-flex rounded-xs overflow-hidden border">
            {(['sm', 'md', 'lg', 'xl'] as FontLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setFontSize(level)}
                className={`px-2 py-1 text-[10px] uppercase transition-colors border-r last:border-r-0 ${
                  fontSize === level ? getActiveButtonStyles() : getInactiveButtonStyles()
                }`}
              >
                {level === 'sm' ? 'A-' : level === 'md' ? 'A' : level === 'lg' ? 'A+' : 'A++'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <Palette className="w-3.5 h-3.5 opacity-70" />
          <span className="text-[10px] uppercase font-bold opacity-70">Mode:</span>
          <div className="inline-flex rounded-xs overflow-hidden border">
            {(['default', 'dark', 'green', 'peach'] as ReadingTheme[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={`px-2 py-1 text-[10px] uppercase transition-colors border-r last:border-r-0 font-bold ${
                  theme === t ? getActiveButtonStyles() : getInactiveButtonStyles()
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button type="button" onClick={handleShare} className={`px-2.5 py-1 border rounded-xs transition-colors inline-flex items-center gap-1 text-xs ${getInactiveButtonStyles()}`}>
            <Share2 className="w-3 h-3" /> Share
          </button>
          <button type="button" onClick={handleCopyLink} className={`px-2.5 py-1 border rounded-xs transition-colors inline-flex items-center gap-1 text-xs ${getInactiveButtonStyles()}`}>
            {copied ? <Check className="w-3 h-3 text-green-600" /> : <Link2 className="w-3 h-3" />}
            {copied ? 'Copied' : 'Link'}
          </button>
        </div>
      </div>

      {/* Highly Visible Floating Trigger & Panel (Bottom-Left) */}
      {showFloatingButton && (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {isFloatingExpanded && (
            <div className="p-3 border font-mono select-none rounded-xs flex flex-col gap-3 max-w-sm bg-zinc-900 text-zinc-100 border-zinc-700 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 opacity-80 text-[11px] font-bold uppercase">
                <span>Reading Controls</span>
                <button onClick={() => setIsFloatingExpanded(false)} className="p-1 hover:text-red-400 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold opacity-70">Font:</span>
                <div className="inline-flex rounded-xs overflow-hidden border border-zinc-700">
                  {(['serif', 'times', 'sans', 'mono'] as FontMode[]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFontMode(f)}
                      className={`px-2 py-1 text-[10px] uppercase transition-colors border-r border-zinc-700 last:border-r-0 ${
                        fontMode === f ? 'bg-red-600 text-white font-bold' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {f === 'times' ? 'Times' : f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold opacity-70">Size:</span>
                <div className="inline-flex rounded-xs overflow-hidden border border-zinc-700">
                  {(['sm', 'md', 'lg', 'xl'] as FontLevel[]).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFontSize(level)}
                      className={`px-2 py-1 text-[10px] uppercase transition-colors border-r border-zinc-700 last:border-r-0 ${
                        fontSize === level ? 'bg-red-600 text-white font-bold' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {level === 'sm' ? 'A-' : level === 'md' ? 'A' : level === 'lg' ? 'A+' : 'A++'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold opacity-70">Mode:</span>
                <div className="inline-flex rounded-xs overflow-hidden border border-zinc-700">
                  {(['default', 'dark', 'green', 'peach'] as ReadingTheme[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTheme(t)}
                      className={`px-1.5 py-1 text-[10px] uppercase transition-colors border-r border-zinc-700 last:border-r-0 font-bold ${
                        theme === t ? 'bg-red-600 text-white font-bold' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Striking High-Contrast Floating Button */}
          <button
            onClick={() => setIsFloatingExpanded(!isFloatingExpanded)}
            className="px-4 py-2.5 bg-zinc-950 text-white border-2 border-amber-500 font-mono text-xs uppercase font-extrabold tracking-widest inline-flex items-center gap-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-105 hover:bg-zinc-900"
            title="Toggle Reading Settings"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Settings</span>
          </button>
        </div>
      )}

      {/* Body Content Wrapper */}
      <div className={`transition-colors duration-300 ${getCanvasStyles()}`}>
        <div className={`${fontMode === 'times' ? '[font-family:Times_New_Roman,Times,serif]' : FONT_FAMILY_CLASSES[fontMode]} space-y-6 ${fontSize === 'sm' ? 'text-sm leading-relaxed' : fontSize === 'md' ? 'text-base leading-relaxed' : fontSize === 'lg' ? 'text-lg leading-relaxed' : 'text-xl leading-loose'}`}>
          {blocks.map((block, i) =>
            block.type === 'heading' ? (
              <h2
                key={block.id}
                id={block.id}
                className={`font-black text-xl md:text-2xl pt-4 scroll-mt-24 border-b pb-2 ${
                  theme === 'dark' ? 'border-zinc-800 text-zinc-100' : 'border-gray-200'
                }`}
              >
                {block.text}
              </h2>
            ) : (
              <div key={i} className="whitespace-pre-wrap leading-relaxed opacity-95">
                {block.text}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}