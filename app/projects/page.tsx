import { Construction } from 'lucide-react'

export default function ProjectsPage() {
  return (
<div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 w-full text-center space-y-6">
      <div className="inline-flex items-center gap-2 bg-black text-white px-3 py-1 text-xs font-mono uppercase tracking-wider font-bold">
        <Construction className="w-4 h-4" />
        Coming Soon
      </div>
<h1 className="font-serif text-3xl sm:text-4xl font-black tracking-tight">Projects Desk</h1>
      <p className="font-serif text-zinc-600 leading-relaxed">
        This section of the wire is still being built out. Check back soon for in-depth
        project dossiers and long-form investigative work.
      </p>
    </div>
  )
}