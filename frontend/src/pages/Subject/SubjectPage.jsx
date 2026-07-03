import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Loader2 } from 'lucide-react'

import API from '../../config/api.js'

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

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue" size={32} /></div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Helmet><title>{subjectInfo?.subjectName || subjectSlug} Chapters | SchoolBuddy</title></Helmet>
      <h1 className="text-3xl font-extrabold mb-2">{subjectInfo?.subjectName || subjectSlug}</h1>
      <p className="text-navy-400 dark:text-navy-100 mb-8">{chapters.length} chapter{chapters.length !== 1 ? 's' : ''}</p>

      {chapters.length === 0 ? (
        <p className="text-navy-400 dark:text-navy-100">No chapters added for this subject yet.</p>
      ) : (
        <div className="space-y-3">
          {chapters.map((ch, i) => (
            <Link
              key={ch._id}
              to={`/board/${boardSlug}/${classSlug}/${subjectSlug}/${ch.slug}`}
              className="card-hover flex items-center gap-4 bg-white dark:bg-surface-darkCard rounded-xl2 p-4 shadow-sm"
            >
              <span className="w-8 h-8 rounded-full bg-blue/10 text-blue font-bold flex items-center justify-center text-sm shrink-0">
                {ch.chapterNumber || i + 1}
              </span>
              <span className="font-medium">{ch.chapterName}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}