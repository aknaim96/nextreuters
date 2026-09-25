// Used for articles & news feeds (e.g., "September 24, 2026")
export function formatDate(dateString: string | Date) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Used for audit log timestamps in 24-hour military format (e.g., "2026-09-24 15:08:28")
export function formatAuditTimestamp(dateString: string | Date) {
  if (!dateString) return '—'
  const date = new Date(dateString)

  const pad = (n: number) => String(n).padStart(2, '0')

  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}