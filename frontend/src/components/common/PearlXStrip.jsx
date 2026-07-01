import { Gem, ArrowUpRight } from 'lucide-react'

/**
 * Slim brand ribbon shown at the very top of every SchoolBuddy page.
 * Tells students (and parents) that SchoolBuddy is part of the PearlX family
 * and links out to the main PearlX site.
 */
export default function PearlXStrip() {
  return (
    <a
      href="https://www.pearlx.in"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-center gap-2 bg-gradient-to-r from-[#3FA9F5] via-[#A66CFF] to-[#FF6FA5] px-4 py-2 text-center text-xs sm:text-sm font-bold text-white"
    >
      <Gem size={14} className="shrink-0 sb-wiggle-hover" />
      <span className="truncate">
        SchoolBuddy is part of the <span className="underline decoration-white/50 underline-offset-2">Pearlx</span> family
      </span>
      <ArrowUpRight size={14} className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  )
}