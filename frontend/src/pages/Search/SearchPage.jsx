import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Loader2, Search } from 'lucide-react'

import API from '../../config/api.js'
const BORDER_COLORS = ['border-pink', 'border-blue', 'border-orange', 'border-green', 'border-purple']

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q) return
    setLoading(true)
    fetch(`${API}/notes/search?q=${encodeURIComponent(q)}`)
      .then(r => r.json())
      .then(data => setResults(Array.isArray(data) ? data : []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [q])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Helmet><title>Search {q ? `"${q}" ` : ''}| SchoolBuddy</title></Helmet>
      <h1 className="text-2xl font-extrabold mb-6">
        {q ? <>Search results for <span className="text-pink">"{q}"</span></> : 'Search Notes'}
      </h1>

      {!q && (
        <p className="text-navy-400 dark:text-navy-100">Use the search bar above to find notes.</p>
      )}

      {loading && <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue" size={30} /></div>}

      {!loading && q && results.length === 0 && (
        <div className="text-center py-16">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-navy-400 dark:text-navy-100">No published notes found for "{q}".</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {results.map((n, i) => (
          <div key={n._id} className={`card-hover bg-white dark:bg-surface-darkCard rounded-xl2 border-l-4 ${BORDER_COLORS[i % BORDER_COLORS.length]} p-4 shadow-sm`}>
            <h3 className="font-bold text-base mb-1 line-clamp-2">{n.title}</h3>
            <p className="text-sm text-navy-400 dark:text-navy-100 line-clamp-2">{n.summary}</p>
          </div>
        ))}
      </div>
    </div>
  )
}