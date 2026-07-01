import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ThumbsUp, Share2, Eye, BookOpenCheck, ListChecks, Sparkles } from 'lucide-react'
import AdSlot from '../../components/common/AdSlot.jsx'
import PearlXStrip from '../../components/common/PearlXStrip.jsx'
import PearlXFooterCard from '../../components/common/PearlXFooterCard.jsx'
import '../../styles/playful-effects.css'

export default function ChapterPage() {
  const { boardSlug, classSlug, subjectSlug, chapterSlug } = useParams()
  const chapterTitle = chapterSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <div>
      <PearlXStrip />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Helmet>
          <title>{chapterTitle} Notes | {classSlug.replace('class-', 'Class ')} {subjectSlug} | SchoolBuddy</title>
          <meta name="description" content={`Free ${boardSlug.toUpperCase()} ${classSlug.replace('class-', 'Class ')} ${subjectSlug} ${chapterTitle} notes, summary and important questions.`} />
        </Helmet>

        <nav className="sb-pop-in text-xs text-navy-400 dark:text-navy-100 mb-4 flex gap-1 flex-wrap items-center">
          <Link to={`/board/${boardSlug}`} className="hover:text-blue font-medium">{boardSlug.toUpperCase()}</Link>
          <span>/</span>
          <Link to={`/board/${boardSlug}/${classSlug}`} className="hover:text-blue font-medium">{classSlug.replace('class-', 'Class ')}</Link>
          <span>/</span>
          <Link to={`/board/${boardSlug}/${classSlug}/${subjectSlug}`} className="capitalize hover:text-blue font-medium">{subjectSlug}</Link>
          <span>/</span>
          <span className="text-navy dark:text-white font-semibold">{chapterTitle}</span>
        </nav>

        <h1 className="sb-pop-in sb-display text-3xl sm:text-4xl font-extrabold mb-3">{chapterTitle}</h1>
        <div className="sb-pop-in sb-pop-1 flex flex-wrap items-center gap-4 text-xs text-navy-400 dark:text-navy-100 mb-6">
          <span className="flex items-center gap-1"><Eye size={14} /> 1,240 views</span>
          <button className="flex items-center gap-1 rounded-full px-3 py-1.5 bg-pink/10 text-pink font-semibold hover:bg-pink/20 transition-colors hover:scale-105 active:scale-95">
            <ThumbsUp size={14} /> Helpful
          </button>
          <button className="flex items-center gap-1 rounded-full px-3 py-1.5 bg-blue/10 text-blue font-semibold hover:bg-blue/20 transition-colors hover:scale-105 active:scale-95">
            <Share2 size={14} /> Share
          </button>
        </div>

        <AdSlot position="banner" className="mb-8" />

        <article className="sb-pop-in sb-pop-2 prose dark:prose-invert max-w-none bg-white dark:bg-surface-darkCard rounded-xl2 p-6 sm:p-8 shadow-sm mb-8 border-t-4 border-blue">
          <h2 className="flex items-center gap-2 not-prose text-xl font-extrabold mb-3">
            <Sparkles size={18} className="text-orange" /> Summary
          </h2>
          <p>A short, simple summary of {chapterTitle} will appear here once content is added from the Admin Dashboard using the rich text editor.</p>

          <h2 className="flex items-center gap-2 not-prose text-xl font-extrabold mb-3 mt-8">
            <BookOpenCheck size={18} className="text-green" /> Complete Notes
          </h2>
          <p>Full chapter notes content goes here — headings, paragraphs, diagrams, tables and important formulas, structured with EditorJS in the admin panel.</p>

          <h2 className="flex items-center gap-2 not-prose text-xl font-extrabold mb-3 mt-8">
            <ListChecks size={18} className="text-purple" /> Important Questions
          </h2>
          <ul>
            <li>Sample important question 1</li>
            <li>Sample important question 2</li>
            <li>Sample important question 3</li>
          </ul>
        </article>

        <AdSlot position="inContent" className="mb-8" />

        <section className="mb-12">
          <h2 className="sb-display text-xl font-bold mb-4 flex items-center gap-2"><span>🔗</span> Related Chapters</h2>
          <div className="rounded-xl2 border-2 border-dashed border-navy-100 dark:border-navy-700 p-6 text-center">
            <p className="text-sm text-navy-400 dark:text-navy-100">Related chapters from the same subject will be listed here.</p>
          </div>
        </section>

        <PearlXFooterCard />
      </div>
    </div>
  )
}