import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { SearchX } from 'lucide-react'
import { BOARDS, SAMPLE_NOTES } from '../../constants/mockData.js'
import NoteCard from '../../components/cards/NoteCard.jsx'
import PearlXStrip from '../../components/common/PearlXStrip.jsx'
import PearlXFooterCard from '../../components/common/PearlXFooterCard.jsx'
import '../../styles/playful-effects.css'

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
    <div>
      <PearlXStrip />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Helmet><title>Search {q ? `"${q}" ` : ''}Notes | SchoolBuddy</title></Helmet>
        <h1 className="sb-pop-in sb-display text-2xl sm:text-3xl font-extrabold mb-6">
          Search Results {q && <span className="text-pink">"{q}"</span>}
        </h1>

        <div className="sb-pop-in sb-pop-1 flex flex-wrap gap-3 mb-8">
          <select
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            className="rounded-full border-2 border-navy-100 dark:border-navy-700 bg-white dark:bg-surface-darkCard px-4 py-2 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue/20 focus:border-blue transition-all"
          >
            <option value="">All Boards</option>
            {BOARDS.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
          </select>
          <select
            value={klass}
            onChange={(e) => setKlass(e.target.value)}
            className="rounded-full border-2 border-navy-100 dark:border-navy-700 bg-white dark:bg-surface-darkCard px-4 py-2 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue/20 focus:border-blue transition-all"
          >
            <option value="">All Classes</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((c) => (
              <option key={c} value={`class-${c}`}>Class {c}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {results.length ? (
            results.map((n, i) => (
              <div key={n.slug} className={`sb-card sb-pop-in sb-pop-${(i % 6) + 1}`}>
                <NoteCard note={n} index={i} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16 rounded-xl2 border-2 border-dashed border-navy-100 dark:border-navy-700">
              <SearchX size={36} className="mx-auto mb-3 text-navy-400 opacity-50" />
              <p className="text-navy-400 dark:text-navy-100 font-medium">No notes found. Try a different search.</p>
            </div>
          )}
        </div>

        <PearlXFooterCard />
      </div>
    </div>
  )
}