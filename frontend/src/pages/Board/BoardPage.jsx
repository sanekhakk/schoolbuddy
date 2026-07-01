import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Loader2, GraduationCap, Frown } from 'lucide-react'
import PearlXStrip from '../../components/common/PearlXStrip.jsx'
import PearlXFooterCard from '../../components/common/PearlXFooterCard.jsx'
import '../../styles/playful-effects.css'

const API = import.meta.env.VITE_API_URL;
const ACCENT_COLORS = ['bg-pink', 'bg-blue', 'bg-orange', 'bg-green', 'bg-purple']

export default function BoardPage() {
  const { boardSlug } = useParams()
  const [board, setBoard] = useState(null)
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API}/boards/${boardSlug}`).then(r => r.json()),
      fetch(`${API}/classes/by-board/${boardSlug}`).then(r => r.json())
    ]).then(([b, c]) => {
      setBoard(b)
      setClasses(Array.isArray(c) ? c : [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [boardSlug])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <Loader2 className="sb-float animate-spin text-blue" size={36} />
        <p className="text-sm text-navy-400 dark:text-navy-100">Fetching classes…</p>
      </div>
    )
  }

  if (!board || board.message) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <Frown size={40} className="mx-auto mb-3 text-navy-400" />
        <p className="text-navy-400 dark:text-navy-100 font-semibold">We couldn't find that board.</p>
        <Link to="/" className="inline-block mt-4 text-blue font-bold hover:underline">Back to Home</Link>
      </div>
    )
  }

  return (
    <div>
      <PearlXStrip />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Helmet><title>{board.name} Notes | SchoolBuddy</title></Helmet>

        <div className="sb-pop-in flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue to-purple text-white flex items-center justify-center shadow-md">
            <GraduationCap size={22} />
          </div>
          <h1 className="sb-display text-3xl sm:text-4xl font-extrabold">{board.name}</h1>
        </div>
        <p className="sb-pop-in sb-pop-1 text-navy-400 dark:text-navy-100 mb-8">{board.description || 'Pick a class below to get started.'}</p>

        <h2 className="sb-display text-xl font-bold mb-4 flex items-center gap-2"><span>🎓</span> Available Classes</h2>
        {classes.length === 0 ? (
          <div className="text-center py-12 rounded-xl2 border-2 border-dashed border-navy-100 dark:border-navy-700">
            <p className="text-navy-400 dark:text-navy-100">No classes added for this board yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {classes.map((c, i) => (
              <Link
                key={c._id}
                to={`/board/${boardSlug}/${c.slug}`}
                className={`sb-card sb-pop-in sb-pop-${(i % 6) + 1} bg-white dark:bg-surface-darkCard rounded-xl2 p-5 text-center font-semibold shadow-sm hover:shadow-xl border-2 border-transparent hover:border-blue/30 relative overflow-hidden`}
              >
                <span className={`absolute -top-2 -right-2 w-8 h-8 rounded-full ${ACCENT_COLORS[i % ACCENT_COLORS.length]} opacity-20`} />
                <span className="relative">{c.className}</span>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-14">
          <PearlXFooterCard />
        </div>
      </div>
    </div>
  )
}