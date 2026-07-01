import { Gem, ExternalLink } from 'lucide-react'

/**
 * Bottom-of-page card advertising the parent brand, PearlX.
 * Drop this in at the end of any page's main content.
 */
export default function PearlXFooterCard() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#1B2340] px-6 py-10 sm:px-10 sm:py-12 text-center">
      <div className="sb-blob sb-float-slow -top-10 -left-10 h-40 w-40 bg-[#FF6FA5]" />
      <div className="sb-blob sb-float -bottom-14 -right-10 h-48 w-48 bg-[#3FA9F5]" />
      <div className="sb-blob sb-float-slow top-1/2 left-1/2 h-32 w-32 bg-[#FFC93C]" />

      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3FA9F5] via-[#A66CFF] to-[#FF6FA5] sb-pulse-glow">
          <Gem size={26} className="text-white" />
        </div>
        <h2 className="sb-display text-2xl sm:text-3xl font-extrabold text-white mb-2">
          One family, lots of good stuff
        </h2>
        <p className="text-sm sm:text-base text-white/70 mb-6">
          SchoolBuddy is built and looked after by <span className="font-bold text-white">Pearlx</span> — the same
          team behind other free, friendly tools for students and families.
        </p>
        <a
          href="https://www.pearlx.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#1B2340] shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          Visit pearlx.in
          <ExternalLink size={16} />
        </a>
        <p className="mt-4 text-[11px] uppercase tracking-widest text-white/40">
          schoolbuddy.pearlx.in
        </p>
      </div>
    </section>
  )
}