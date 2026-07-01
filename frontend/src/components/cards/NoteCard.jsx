import { Link } from 'react-router-dom'
import { Eye, BookOpen } from 'lucide-react'

const ACCENTS = ['border-pink', 'border-blue', 'border-orange', 'border-green', 'border-purple']

export default function NoteCard({ note, index = 0 }) {
  const accent = ACCENTS[index % ACCENTS.length]
  return (
    <Link
      to={`/board/${note.boardSlug}/${note.classSlug}/${note.subjectSlug}/${note.slug}`}
      className={`card-hover block bg-white dark:bg-surface-darkCard rounded-xl2 border-l-4 ${accent} p-4 shadow-sm`}
    >
      <div className="flex items-center gap-2 text-xs text-navy-400 dark:text-navy-100 mb-2">
        <BookOpen size={14} />
        <span>{note.subjectName} · {note.className}</span>
      </div>
      <h3 className="font-bold text-base mb-1 line-clamp-2">{note.title}</h3>
      <p className="text-sm text-navy-400 dark:text-navy-100 line-clamp-2">{note.summary}</p>
      <div className="flex items-center gap-1 mt-3 text-xs text-navy-400 dark:text-navy-100">
        <Eye size={14} /> {note.views ?? 0} views
      </div>
    </Link>
  )
}
