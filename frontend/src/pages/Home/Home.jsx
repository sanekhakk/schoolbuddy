import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, Sparkles, BookOpen, Loader2, Gem, Rocket, Star } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import AdSlot from '../../components/common/AdSlot.jsx'
import PearlXStrip from '../../components/common/PearlXStrip.jsx'
import PearlXFooterCard from '../../components/common/PearlXFooterCard.jsx'
import '../../styles/playful-effects.css'

const API = import.meta.env.VITE_API_URL;

function useFetch(url) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch(url).then(r => r.json()).then(setData).catch(() => setData([])).finally(() => setLoading(false))
  }, [url])
  return { data, loading }
}

const ACCENT_COLORS = ['bg-pink', 'bg-blue', 'bg-orange', 'bg-green', 'bg-purple']
const BORDER_COLORS = ['border-pink', 'border-blue', 'border-orange', 'border-green', 'border-purple']
const BLOB_COLORS = ['#FF6FA5', '#3FA9F5', '#FFC93C', '#4CD787', '#A66CFF']

export default function Home() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { data: boards, loading: boardsLoading } = useFetch(`${API}/boards`)
  const { data: notes, loading: notesLoading } = useFetch(`${API}/notes/published`)

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div>
      <Helmet>
        <title>SchoolBuddy | Free Study Notes for CBSE, ICSE & State Boards</title>
        <meta name="description" content="Free study notes, summaries and important questions for school students. A PearlX product." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <PearlXStrip />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue/10 via-pink/10 to-orange/10 dark:from-navy-700 dark:via-surface-dark dark:to-surface-dark">
        <div className="sb-blob sb-float-slow -top-16 -left-10 h-64 w-64" style={{ background: BLOB_COLORS[1] }} />
        <div className="sb-blob sb-float -bottom-20 right-0 h-72 w-72" style={{ background: BLOB_COLORS[0] }} />
        <div className="sb-blob sb-float-slow top-1/3 right-1/4 h-40 w-40" style={{ background: BLOB_COLORS[2] }} />

        <Star size={22} className="sb-float absolute left-[8%] top-[22%] text-orange hidden sm:block" fill="currentColor" />
        <Sparkles size={26} className="sb-float-slow absolute right-[12%] top-[18%] text-purple hidden sm:block" />
        <Rocket size={24} className="sb-float absolute right-[8%] bottom-[16%] text-pink hidden sm:block rotate-45" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <span className="sb-pop-in inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-purple bg-purple/10 px-3 py-1 rounded-full mb-4">
            <Sparkles size={14} /> Your Buddy in Every Chapter
          </span>
          <h1 className="sb-pop-in sb-pop-1 sb-display text-4xl sm:text-6xl font-extrabold mb-4 leading-tight">
            Free Study Notes for <span className="text-pink">Every</span> Student
          </h1>
          <p className="sb-pop-in sb-pop-2 text-navy-400 dark:text-navy-100 max-w-xl mx-auto mb-8 text-base sm:text-lg">
            Clean, simple and free notes, summaries and important questions for CBSE, ICSE and State Boards — Class 1 to 12.
          </p>
          <form onSubmit={handleSearch} className="sb-pop-in sb-pop-3 max-w-xl mx-auto relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search chapters, subjects..."
              className="w-full rounded-full border-2 border-navy-100 dark:border-navy-700 bg-white dark:bg-surface-darkCard px-6 py-4 pr-16 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue/30 focus:border-blue transition-all text-base"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue text-white p-3.5 rounded-full hover:bg-blue-light transition-all hover:scale-110 active:scale-95 shadow-md"
            >
              <Search size={18} />
            </button>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot position="banner" className="my-8" />

        {/* Boards */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xl">🎒</span>
            <h2 className="sb-display text-2xl sm:text-3xl font-extrabold">Browse by Board</h2>
          </div>
          {boardsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="sb-shimmer rounded-xl2 h-32" />
              ))}
            </div>
          ) : boards.length === 0 ? (
            <div className="text-center py-12 rounded-xl2 border-2 border-dashed border-navy-100 dark:border-navy-700">
              <p className="text-navy-400 dark:text-navy-100">No boards added yet. Add boards from the Admin Dashboard.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {boards.map((b, i) => (
                <Link
                  key={b._id}
                  to={`/board/${b.slug}`}
                  className={`sb-card sb-pop-in sb-pop-${(i % 6) + 1} group flex flex-col items-center justify-center gap-3 bg-white dark:bg-surface-darkCard rounded-xl2 p-6 shadow-sm hover:shadow-xl text-center border-2 border-transparent hover:border-blue/30`}
                >
                  <div className={`w-14 h-14 rounded-full ${ACCENT_COLORS[i % ACCENT_COLORS.length]} text-white flex items-center justify-center font-extrabold text-lg shadow-md group-hover:sb-wiggle-hover transition-transform`}>
                    {b.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="font-semibold">{b.name}</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Published Notes */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xl">📚</span>
            <h2 className="sb-display text-2xl sm:text-3xl font-extrabold">Published Notes</h2>
          </div>
          {notesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="sb-shimmer rounded-xl2 h-32" />
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-14 rounded-xl2 border-2 border-dashed border-navy-100 dark:border-navy-700 text-navy-400 dark:text-navy-100">
              <BookOpen size={40} className="sb-float mx-auto mb-3 opacity-40" />
              <p>No published notes yet. Add notes from the Admin Dashboard and set status to <strong>Published</strong>.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {notes.map((n, i) => (
                <div key={n._id} className={`sb-card sb-pop-in sb-pop-${(i % 6) + 1} bg-white dark:bg-surface-darkCard rounded-xl2 border-l-4 ${BORDER_COLORS[i % BORDER_COLORS.length]} p-4 shadow-sm hover:shadow-xl`}>
                  <h3 className="font-bold text-base mb-1 line-clamp-2">{n.title}</h3>
                  <p className="text-sm text-navy-400 dark:text-navy-100 line-clamp-2">{n.summary}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-navy-400 dark:text-navy-100">
                    <Star size={12} fill="currentColor" className="text-orange" /> {n.views ?? 0} views
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <AdSlot position="footer" className="mb-10" />

        <div className="mb-12">
          <PearlXFooterCard />
        </div>
      </div>
    </div>
  )
}