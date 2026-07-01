import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ThumbsUp, Share2, Eye } from 'lucide-react'
import AdSlot from '../../components/common/AdSlot.jsx'

export default function ChapterPage() {
  const { boardSlug, classSlug, subjectSlug, chapterSlug } = useParams()
  const chapterTitle = chapterSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Helmet>
        <title>{chapterTitle} Notes | {classSlug.replace('class-', 'Class ')} {subjectSlug} | SchoolBuddy</title>
        <meta name="description" content={`Free ${boardSlug.toUpperCase()} ${classSlug.replace('class-', 'Class ')} ${subjectSlug} ${chapterTitle} notes, summary and important questions.`} />
      </Helmet>

      <nav className="text-xs text-navy-400 dark:text-navy-100 mb-4 flex gap-1 flex-wrap">
        <Link to={`/board/${boardSlug}`}>{boardSlug.toUpperCase()}</Link> /
        <Link to={`/board/${boardSlug}/${classSlug}`}>{classSlug.replace('class-', 'Class ')}</Link> /
        <Link to={`/board/${boardSlug}/${classSlug}/${subjectSlug}`} className="capitalize">{subjectSlug}</Link> /
        <span className="text-navy dark:text-white">{chapterTitle}</span>
      </nav>

      <h1 className="text-3xl font-extrabold mb-3">{chapterTitle}</h1>
      <div className="flex items-center gap-4 text-xs text-navy-400 dark:text-navy-100 mb-6">
        <span className="flex items-center gap-1"><Eye size={14} /> 1,240 views</span>
        <button className="flex items-center gap-1 hover:text-pink"><ThumbsUp size={14} /> Helpful</button>
        <button className="flex items-center gap-1 hover:text-blue"><Share2 size={14} /> Share</button>
      </div>

      <AdSlot position="banner" className="mb-8" />

      <article className="prose dark:prose-invert max-w-none bg-white dark:bg-surface-darkCard rounded-xl2 p-6 shadow-sm mb-8">
        <h2>Summary</h2>
        <p>A short, simple summary of {chapterTitle} will appear here once content is added from the Admin Dashboard using the rich text editor.</p>

        <h2>Complete Notes</h2>
        <p>Full chapter notes content goes here — headings, paragraphs, diagrams, tables and important formulas, structured with EditorJS in the admin panel.</p>

        <h2>Important Questions</h2>
        <ul>
          <li>Sample important question 1</li>
          <li>Sample important question 2</li>
          <li>Sample important question 3</li>
        </ul>
      </article>

      <AdSlot position="inContent" className="mb-8" />

      <section>
        <h2 className="text-xl font-bold mb-4">Related Chapters</h2>
        <p className="text-sm text-navy-400 dark:text-navy-100">Related chapters from the same subject will be listed here.</p>
      </section>
    </div>
  )
}
