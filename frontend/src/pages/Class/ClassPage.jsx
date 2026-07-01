import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Loader2 } from 'lucide-react'
import PearlXStrip from '../../components/common/PearlXStrip.jsx'
import PearlXFooterCard from '../../components/common/PearlXFooterCard.jsx'
import '../../styles/playful-effects.css'

const API = import.meta.env.VITE_API_URL;
const COLORS = ['bg-pink', 'bg-blue', 'bg-orange', 'bg-green', 'bg-purple']

export default function ClassPage() {
  const { boardSlug, classSlug } = useParams()
  const [subjects, setSubjects] = useState([])
  const [classInfo, setClassInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/subjects/by-class/${boardSlug}/${classSlug}`)
      .then(r => r.json())
      .then(data => {
        if (data.subjects) {
          setSubjects(data.subjects)
          setClassInfo(data.classInfo)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [boardSlug, classSlug])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <Loader2 className="sb-float animate-spin text-blue" size={36} />
        <p className="text-sm text-navy-400 dark:text-navy-100">Loading subjects…</p>
      </div>
    )
  }

  return (
    <div>
      <PearlXStrip />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Helmet><title>{classInfo?.className || classSlug} Subjects | SchoolBuddy</title></Helmet>

        <nav className="sb-pop-in text-xs text-navy-400 dark:text-navy-100 mb-4 flex gap-1 flex-wrap items-center">
          <Link to={`/board/${boardSlug}`} className="hover:text-blue font-medium">{boardSlug.toUpperCase()}</Link>
          <span>/</span>
          <span className="text-navy dark:text-white font-semibold">{classInfo?.className || classSlug}</span>
        </nav>

        <h1 className="sb-pop-in sb-display text-3xl sm:text-4xl font-extrabold mb-2">{classInfo?.className || classSlug}</h1>
        <p className="sb-pop-in sb-pop-1 text-navy-400 dark:text-navy-100 mb-8">Choose a subject to view chapters and notes.</p>

        {subjects.length === 0 ? (
          <div className="text-center py-12 rounded-xl2 border-2 border-dashed border-navy-100 dark:border-navy-700">
            <p className="text-navy-400 dark:text-navy-100">No subjects added for this class yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {subjects.map((s, i) => (
              <Link
                key={s._id}
                to={`/board/${boardSlug}/${classSlug}/${s.slug}`}
                className={`sb-card sb-pop-in sb-pop-${(i % 6) + 1} bg-white dark:bg-surface-darkCard rounded-xl2 p-6 shadow-sm hover:shadow-xl flex items-center gap-4 border-2 border-transparent hover:border-blue/30`}
              >
                <div className={`w-11 h-11 rounded-full ${COLORS[i % COLORS.length]} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md`}>
                  {s.subjectName.slice(0, 2).toUpperCase()}
                </div>
                <span className="font-semibold">{s.subjectName}</span>
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