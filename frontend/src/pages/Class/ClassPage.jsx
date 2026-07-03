import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Loader2 } from 'lucide-react'

import API from '../../config/api.js'
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

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue" size={32} /></div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Helmet><title>{classInfo?.className || classSlug} Subjects | SchoolBuddy</title></Helmet>
      <h1 className="text-3xl font-extrabold mb-2">{classInfo?.className || classSlug}</h1>
      <p className="text-navy-400 dark:text-navy-100 mb-8">Choose a subject to view chapters and notes.</p>

      {subjects.length === 0 ? (
        <p className="text-navy-400 dark:text-navy-100">No subjects added for this class yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((s, i) => (
            <Link
              key={s._id}
              to={`/board/${boardSlug}/${classSlug}/${s.slug}`}
              className="card-hover bg-white dark:bg-surface-darkCard rounded-xl2 p-6 shadow-sm flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-full ${COLORS[i % COLORS.length]} text-white flex items-center justify-center font-bold text-sm shrink-0`}>
                {s.subjectName.slice(0, 2).toUpperCase()}
              </div>
              <span className="font-semibold">{s.subjectName}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}