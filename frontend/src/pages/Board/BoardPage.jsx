import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Loader2 } from 'lucide-react'

const API = 'http://localhost:5000/api'

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

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue" size={32} /></div>
  if (!board || board.message) return <div className="max-w-2xl mx-auto px-4 py-20 text-center text-navy-400">Board not found.</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Helmet><title>{board.name} Notes | SchoolBuddy</title></Helmet>
      <h1 className="text-3xl font-extrabold mb-2">{board.name}</h1>
      <p className="text-navy-400 dark:text-navy-100 mb-8">{board.description || 'Browse classes below.'}</p>

      <h2 className="text-xl font-bold mb-4">Available Classes</h2>
      {classes.length === 0 ? (
        <p className="text-navy-400 dark:text-navy-100">No classes added for this board yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {classes.map((c) => (
            <Link
              key={c._id}
              to={`/board/${boardSlug}/${c.slug}`}
              className="card-hover bg-white dark:bg-surface-darkCard rounded-xl2 p-5 text-center font-semibold shadow-sm"
            >
              {c.className}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}