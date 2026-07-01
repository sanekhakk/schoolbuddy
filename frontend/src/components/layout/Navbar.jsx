import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Sun, Moon, Menu, X } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext.jsx'

const NAV_LINKS = [
  { label: 'CBSE', to: '/board/cbse' },
  { label: 'ICSE', to: '/board/icse' },
  { label: 'Search', to: '/search' }
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-surface-dark/90 backdrop-blur border-b border-navy-100 dark:border-navy-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* ── Logo ── Replace schoolbuddy-logo.png with your actual logo filename */}
        <Link to="/" className="flex items-center shrink-0">
          <img
            src="/logo.svg"
            alt="SchoolBuddy"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* ── Search bar (desktop) ── */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search chapters, subjects, keywords..."
            className="w-full rounded-full border border-navy-100 dark:border-navy-700 bg-surface dark:bg-navy-700/40 px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue"
          />
          <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-blue">
            <Search size={18} />
          </button>
        </form>

        {/* ── Nav links (desktop) ── */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-pink transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* ── Dark mode + hamburger ── */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 rounded-full bg-navy-50 dark:bg-navy-700 text-navy dark:text-orange hover:scale-105 transition-transform"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {open && (
        <div className="lg:hidden border-t border-navy-100 dark:border-navy-700 px-4 py-3 space-y-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search notes..."
              className="w-full rounded-full border border-navy-100 dark:border-navy-700 bg-surface dark:bg-navy-700/40 px-4 py-2 pr-10 text-sm"
            />
            <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-blue">
              <Search size={18} />
            </button>
          </form>
          <div className="flex flex-col gap-2 text-sm font-semibold">
            {NAV_LINKS.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-1">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}