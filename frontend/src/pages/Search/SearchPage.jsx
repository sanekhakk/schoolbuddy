import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { BOARDS, SAMPLE_NOTES } from '../../constants/mockData.js'
import NoteCard from '../../components/cards/NoteCard.jsx'

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [board, setBoard] = useState('')
  const [klass, setKlass] = useState('')

  const results = SAMPLE_NOTES.filter((n) => {
    const matchesQuery = !q || n.title.toLowerCase().includes(q.toLowerCase()) || n.summary.toLowerCase().includes(q.toLowerCase())
    const matchesBoard = !board || n.boardSlug === board
    const matchesClass = !klass || n.classSlug === klass
    return matchesQuery && matchesBoard && matchesClass
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Helmet><title>Search {q ? `"${q}" ` : ''}Notes | SchoolBuddy</title></Helmet>
      <h1 className="text-2xl font-extrabold mb-6">Search Results {q && <span className="text-pink">"{q}"</span>}</h1>

      <div className="flex flex-wrap gap-3 mb-8">
        <select value={board} onChange={(e) => setBoard(e.target.value)} className="rounded-full border border-navy-100 dark:border-navy-700 bg-white dark:bg-surface-darkCard px-4 py-2 text-sm">
          <option value="">All Boards</option>
          {BOARDS.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
        </select>
        <select value={klass} onChange={(e) => setKlass(e.target.value)} className="rounded-full border border-navy-100 dark:border-navy-700 bg-white dark:bg-surface-darkCard px-4 py-2 text-sm">
          <option value="">All Classes</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((c) => (
            <option key={c} value={`class-${c}`}>Class {c}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {results.length ? results.map((n, i) => <NoteCard key={n.slug} note={n} index={i} />) : (
          <p className="text-navy-400 dark:text-navy-100">No notes found. Try a different search.</p>
        )}
      </div>
    </div>
  )
}
