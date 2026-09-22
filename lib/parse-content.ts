export type ContentBlock =
  | { type: 'heading'; id: string; text: string }
  | { type: 'paragraph'; text: string }

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  )
}

// Convention: a line starting with "## " marks a section heading. Everything
// else is grouped into paragraphs, split on blank lines — matching how
// authors already write content in the CMS textarea (plain text, blank line
// between paragraphs).
export function parseArticleContent(content: string): ContentBlock[] {
  const lines = (content || '').split('\n')
  const blocks: ContentBlock[] = []
  let paragraphBuffer: string[] = []
  const usedSlugs = new Set<string>()

  const flushParagraph = () => {
    const text = paragraphBuffer.join('\n').trim()
    if (text) blocks.push({ type: 'paragraph', text })
    paragraphBuffer = []
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (line.startsWith('## ')) {
      flushParagraph()
      const headingText = line.slice(3).trim()
      const baseSlug = slugify(headingText)
      let uniqueSlug = baseSlug
      let counter = 2
      while (usedSlugs.has(uniqueSlug)) {
        uniqueSlug = `${baseSlug}-${counter++}`
      }
      usedSlugs.add(uniqueSlug)
      blocks.push({ type: 'heading', id: uniqueSlug, text: headingText })
    } else if (line === '') {
      flushParagraph()
    } else {
      paragraphBuffer.push(rawLine)
    }
  }
  flushParagraph()

  return blocks
}

export function extractHeadings(blocks: ContentBlock[]): { id: string; text: string }[] {
  return blocks
    .filter((b): b is Extract<ContentBlock, { type: 'heading' }> => b.type === 'heading')
    .map(({ id, text }) => ({ id, text }))
}
