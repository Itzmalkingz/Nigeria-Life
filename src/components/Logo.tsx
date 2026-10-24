export default function Logo({ className = "w-6 h-6", ariaHidden = true }: { className?: string, ariaHidden?: boolean }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg" 
      aria-hidden={ariaHidden}
    >
      <g stroke="#94A0B4" strokeOpacity="0.75" strokeWidth="8" fill="none" strokeLinecap="round">
        <path d="M100 140 C 100 100, 60 100, 60 60" />
        <path d="M100 140 C 100 100, 100 80, 100 40" />
        <path d="M100 140 C 100 100, 140 100, 140 60" />
        <path d="M100 140 C 100 120, 40 120, 40 80" />
        <path d="M100 140 C 100 120, 160 120, 160 80" />
      </g>
      <circle cx="100" cy="160" r="20" fill="#F0443E" />
      <circle cx="60" cy="60" r="10" fill="#626776" />
      <circle cx="100" cy="40" r="10" fill="#2764D8" />
      <circle cx="140" cy="60" r="10" fill="#626776" />
      <circle cx="40" cy="80" r="10" fill="#626776" />
      <circle cx="160" cy="80" r="10" fill="#626776" />
    </svg>
  )
}
