import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Loader2, ChevronRight } from 'lucide-react'
import PearlXStrip from '../../components/common/PearlXStrip.jsx'
import PearlXFooterCard from '../../components/common/PearlXFooterCard.jsx'
import '../../styles/playful-effects.css'

const API = import.meta.env.VITE_API_URL;
const BADGE_COLORS = ['bg-blue', 'bg-pink', 'bg-orange', 'bg-green', 'bg-purple']

export default function SubjectPage() {
  const { boardSlug, classSlug, subjectSlug } = useParams()
  const [chapters, setChapters] = useState([])
  const [subjectInfo, setSubjectInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/chapters/by-subject/${boardSlug}/${classSlug}/${subjectSlug}`)
      .then(r => r.json())
      .then(data => {
        if (data.chapters) {
          setChapters(data.chapters)
          setSubjectInfo(data.subjectInfo)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [boardSlug, classSlug, subjectSlug])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <Loader2 className="sb-float animate-spin text-blue" size={36} />
        <p className="text-sm text-navy-400 dark:text-navy-100">Loading chapters…</p>
      </div>
    )
  }

  return (
    <div>
      <PearlXStrip />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Helmet><title>{subjectInfo?.subjectName || subjectSlug} Chapters | SchoolBuddy</title></Helmet>

        <nav className="sb-pop-in text-xs text-navy-400 dark:text-navy-100 mb-4 flex gap-1 flex-wrap items-center">
          <Link to={`/board/${boardSlug}`} className="hover:text-blue font-medium">{boardSlug.toUpperCase()}</Link>
          <span>/</span>
          <Link to={`/board/${boardSlug}/${classSlug}`} className="hover:text-blue font-medium">{classSlug.replace('class-', 'Class ')}</Link>
          <span>/</span>
          <span className="text-navy dark:text-white font-semibold capitalize">{subjectInfo?.subjectName || subjectSlug}</span>
        </nav>

        <h1 className="sb-pop-in sb-display text-3xl sm:text-4xl font-extrabold mb-2">{subjectInfo?.subjectName || subjectSlug}</h1>
        <p className="sb-pop-in sb-pop-1 text-navy-400 dark:text-navy-100 mb-8">
          {chapters.length} chapter{chapters.length !== 1 ? 's' : ''} on your learning trail
        </p>

        {chapters.length === 0 ? (
          <div className="text-center py-12 rounded-xl2 border-2 border-dashed border-navy-100 dark:border-navy-700">
            <p className="text-navy-400 dark:text-navy-100">No chapters added for this subject yet.</p>
          </div>
        ) : (
          <div className="relative">
            {/* dashed trail line connecting every stepping-stone */}
            <div
              aria-hidden="true"
              className="absolute left-[19px] top-6 bottom-6 border-l-2 border-dashed border-blue/30 dark:border-blue/20"
            />
            <ol className="space-y-4">
              {chapters.map((ch, i) => (
                <li key={ch._id} className={`sb-pop-in sb-pop-${(i % 6) + 1} relative pl-[52px]`}>
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full ${BADGE_COLORS[i % BADGE_COLORS.length]} text-white font-extrabold text-sm flex items-center justify-center shadow-md ring-4 ring-white dark:ring-surface-dark`}
                  >
                    {ch.chapterNumber || i + 1}
                  </span>
                  <Link
                    to={`/board/${boardSlug}/${classSlug}/${subjectSlug}/${ch.slug}`}
                    className="sb-card group flex items-center justify-between gap-4 bg-white dark:bg-surface-darkCard rounded-xl2 p-4 shadow-sm hover:shadow-xl border-2 border-transparent hover:border-blue/30"
                  >
                    <span className="font-medium">{ch.chapterName}</span>
                    <ChevronRight size={18} className="text-navy-400 group-hover:text-blue group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mt-14">
          <PearlXFooterCard />
        </div>
      </div>
    </div>
  )
}