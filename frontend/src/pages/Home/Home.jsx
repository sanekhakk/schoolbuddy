import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, Sparkles, BookOpen, Loader2, Eye } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import AdSlot from '../../components/common/AdSlot.jsx'
import API from '../../config/api.js'

function useFetch(url) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch(url).then(r => r.json()).then(d => setData(Array.isArray(d) ? d : [])).catch(() => setData([])).finally(() => setLoading(false))
  }, [url])
  return { data, loading }
}

const ACCENT = ['bg-pink', 'bg-blue', 'bg-orange', 'bg-green', 'bg-purple']
const BORDER = ['border-pink', 'border-blue', 'border-orange', 'border-green', 'border-purple']

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
        <meta name="description" content="Free study notes for school students across all boards." />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue/10 via-pink/10 to-orange/10 dark:from-navy-700 dark:via-surface-dark dark:to-surface-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-purple bg-purple/10 px-3 py-1 rounded-full mb-4">
            <Sparkles size={14} /> Your Buddy in Every Chapter
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 leading-tight">
            Free Study Notes for <span className="text-pink">Every</span> Student
          </h1>
          <p className="text-navy-400 dark:text-navy-100 max-w-xl mx-auto mb-8">
            Clean, simple and free notes for CBSE, ICSE and State Boards — Class 1 to 12.
          </p>
          <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
            <input value={query} onChange={e => setQuery(e.target.value)} type="text"
              placeholder="Search chapters, subjects..."
              className="w-full rounded-full border border-navy-100 dark:border-navy-700 bg-white dark:bg-surface-darkCard px-6 py-4 pr-14 shadow-md focus:outline-none focus:ring-2 focus:ring-blue" />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue text-white p-3 rounded-full hover:bg-blue-light transition-colors">
              <Search size={18} />
            </button>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot position="banner" className="my-8" />

        {/* Boards */}
        <section className="mb-12">
          <h2 className="text-2xl font-extrabold mb-6">Browse by Board</h2>
          {boardsLoading
            ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue" size={28} /></div>
            : boards.length === 0
              ? <p className="text-navy-400 dark:text-navy-100">No boards added yet.</p>
              : <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {boards.map((b, i) => (
                    <Link key={b._id} to={`/board/${b.slug}`}
                      className="card-hover flex flex-col items-center justify-center gap-3 bg-white dark:bg-surface-darkCard rounded-xl2 p-6 shadow-sm text-center">
                      <div className={`w-14 h-14 rounded-full ${ACCENT[i % ACCENT.length]} text-white flex items-center justify-center font-extrabold text-lg`}>
                        {b.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold">{b.name}</span>
                    </Link>
                  ))}
                </div>
          }
        </section>

        {/* Published Notes — clickable cards */}
        <section className="mb-16">
          <h2 className="text-2xl font-extrabold mb-6">Published Notes</h2>
          {notesLoading
            ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue" size={28} /></div>
            : notes.length === 0
              ? <div className="text-center py-12 text-navy-400 dark:text-navy-100">
                  <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
                  <p>No published notes yet. Add notes from Admin and set status to <strong>Published</strong>.</p>
                </div>
              : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {notes.map((n, i) => {
                    const url = n.boardSlug && n.classSlug && n.subjectSlug && n.chapterSlug
                      ? `/board/${n.boardSlug}/${n.classSlug}/${n.subjectSlug}/${n.chapterSlug}`
                      : null
                    const Card = (
                      <div className={`h-full card-hover bg-white dark:bg-surface-darkCard rounded-xl2 border-l-4 ${BORDER[i % BORDER.length]} p-4 shadow-sm flex flex-col`}>
                        <div className="text-xs text-navy-400 dark:text-navy-100 mb-2">
                          {n.boardName} · {n.className} · {n.subjectName}
                        </div>
                        <h3 className="font-bold text-base mb-2 line-clamp-2 flex-1">{n.title}</h3>
                        {n.summary && <p className="text-sm text-navy-400 dark:text-navy-100 line-clamp-2 mb-3">{n.summary}</p>}
                        <div className="flex items-center gap-1 text-xs text-navy-400 dark:text-navy-100 mt-auto">
                          <Eye size={13} /> {n.views ?? 0} views
                        </div>
                      </div>
                    )
                    return url
                      ? <Link key={n._id} to={url} className="block">{Card}</Link>
                      : <div key={n._id}>{Card}</div>
                  })}
                </div>
          }
        </section>

        <AdSlot position="footer" className="mb-10" />
      </div>
    </div>
  )
}