import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ThumbsUp, Share2, Eye, Loader2, AlertCircle } from 'lucide-react'
import { marked } from 'marked'
import AdSlot from '../../components/common/AdSlot.jsx'
import API from '../../config/api.js'

// Configure marked for safe, clean rendering with table support
marked.setOptions({
  breaks: true,    // line breaks become <br>
  gfm: true,       // GitHub Flavored Markdown — enables tables
})

function renderContent(content) {
  if (!content) return ''
  if (typeof content === 'string') {
    return marked.parse(content)
  }
  // EditorJS JSON blocks — convert to markdown then parse
  if (content.blocks) {
    const md = content.blocks.map(block => {
      switch (block.type) {
        case 'header':    return `${'#'.repeat(block.data.level)} ${block.data.text}\n`
        case 'paragraph': return `${block.data.text}\n`
        case 'list':
          return block.data.items.map(item =>
            block.data.style === 'ordered' ? `1. ${item}` : `- ${item}`
          ).join('\n') + '\n'
        case 'quote':     return `> ${block.data.text}\n`
        case 'code':      return `\`\`\`\n${block.data.code}\n\`\`\`\n`
        case 'image':     return `![${block.data.caption || ''}](${block.data.file?.url})\n`
        default:          return ''
      }
    }).join('\n')
    return marked.parse(md)
  }
  return ''
}

export default function ChapterPage() {
  const { boardSlug, classSlug, subjectSlug, chapterSlug } = useParams()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    fetch(`${API}/notes/${boardSlug}/${classSlug}/${subjectSlug}/${chapterSlug}`)
      .then(r => r.json())
      .then(data => {
        if (data.message) setNotFound(true)
        else setNote(data)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [boardSlug, classSlug, subjectSlug, chapterSlug])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: note?.title, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied!')
    }
  }

  if (loading) return (
    <div className="flex justify-center py-32">
      <Loader2 className="animate-spin text-blue" size={32} />
    </div>
  )

  if (notFound) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <AlertCircle size={48} className="mx-auto mb-4 text-pink opacity-70" />
      <h2 className="text-xl font-bold mb-2">Note not published yet</h2>
      <p className="text-navy-400 dark:text-navy-100 mb-6">This chapter's notes haven't been published yet.</p>
      <Link to={`/board/${boardSlug}/${classSlug}/${subjectSlug}`}
        className="px-5 py-2 rounded-full bg-blue text-white text-sm font-semibold hover:bg-blue-light transition-colors">
        ← Back to Chapters
      </Link>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Helmet>
        <title>{note.title} | SchoolBuddy</title>
        <meta name="description" content={note.summary || `Free ${boardSlug.toUpperCase()} ${note.title} notes.`} />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="text-xs text-navy-400 dark:text-navy-100 mb-5 flex gap-1 flex-wrap items-center">
        <Link to={`/board/${boardSlug}`} className="hover:text-pink">{boardSlug.toUpperCase()}</Link>
        <span>/</span>
        <Link to={`/board/${boardSlug}/${classSlug}`} className="hover:text-pink capitalize">{classSlug.replace(/-/g, ' ')}</Link>
        <span>/</span>
        <Link to={`/board/${boardSlug}/${classSlug}/${subjectSlug}`} className="hover:text-pink capitalize">{subjectSlug.replace(/-/g, ' ')}</Link>
        <span>/</span>
        <span className="text-navy dark:text-white">{note.title}</span>
      </nav>

      <h1 className="text-3xl font-extrabold mb-3">{note.title}</h1>

      <div className="flex items-center gap-4 text-sm text-navy-400 dark:text-navy-100 mb-6 flex-wrap">
        <span className="flex items-center gap-1"><Eye size={15} /> {note.views ?? 0} views</span>
        <button className="flex items-center gap-1 hover:text-pink transition-colors">
          <ThumbsUp size={15} /> Helpful
        </button>
        <button onClick={handleShare} className="flex items-center gap-1 hover:text-blue transition-colors">
          <Share2 size={15} /> Share
        </button>
        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-green/10 text-green">
          {note.status}
        </span>
      </div>

      <AdSlot position="banner" className="mb-8" />

      {/* Summary */}
      {note.summary && (
        <div className="bg-blue/5 dark:bg-blue/10 border-l-4 border-blue rounded-r-xl p-5 mb-6">
          <h2 className="text-lg font-bold mb-2">✨ Summary</h2>
          <p className="text-sm leading-relaxed">{note.summary}</p>
        </div>
      )}

      {/* Main content — rendered markdown */}
      <div className="bg-white dark:bg-surface-darkCard rounded-xl2 p-6 shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-5 flex items-center gap-2">📖 Complete Notes</h2>
        {note.content ? (
          <div
            className="note-content"
            dangerouslySetInnerHTML={{ __html: renderContent(note.content) }}
          />
        ) : (
          <p className="text-navy-400 dark:text-navy-100">Content coming soon.</p>
        )}
      </div>

      <AdSlot position="inContent" className="mb-8" />

      {/* Keywords */}
      {note.keywords?.length > 0 && (
        <div className="mb-8">
          <h3 className="font-bold mb-3">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {note.keywords.map(k => (
              <span key={k} className="px-3 py-1 rounded-full bg-blue/10 text-blue text-xs font-medium">{k}</span>
            ))}
          </div>
        </div>
      )}

      <Link to={`/board/${boardSlug}/${classSlug}/${subjectSlug}`}
        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-navy/10 dark:bg-navy-700 text-sm font-semibold hover:bg-blue hover:text-white transition-colors">
        ← Back to {subjectSlug.replace(/-/g, ' ')} chapters
      </Link>
    </div>
  )
}