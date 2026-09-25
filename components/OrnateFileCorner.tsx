// components/OrnateFiligreeCorner.tsx
export const OrnateFiligreeCorner = ({ position = "top-left" }: { position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) => {
  const getTransform = () => {
    switch (position) {
      case 'top-right': return 'scale-x-[-1]'
      case 'bottom-left': return 'scale-y-[-1]'
      case 'bottom-right': return 'scale-[-1]'
      default: return ''
    }
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right': return 'top-0 right-0'
      case 'bottom-left': return 'bottom-0 left-0'
      case 'bottom-right': return 'bottom-0 right-0'
      default: return 'top-0 left-0'
    }
  }

  return (
    <div className={`absolute ${getPositionClasses()} w-14 h-14 pointer-events-none z-20 text-[#E6C657] transition-transform duration-300 ${getTransform()}`}>
      <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
        <path d="M 4,4 C 4,35 12,55 35,75 C 20,60 12,40 10,20 C 10,12 8,8 4,4 Z" fill="url(#goldGradient)" opacity="0.9" />
        <path d="M 4,4 C 35,4 55,12 75,35 C 60,20 40,12 20,10 C 12,10 8,8 4,4 Z" fill="url(#goldGradient)" opacity="0.9" />
        <circle cx="28" cy="28" r="7" fill="#FDF6E2" stroke="#9A7B1C" strokeWidth="2" />
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#9A7B1C" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}