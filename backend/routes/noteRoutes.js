import { Router } from 'express'
import { Note, Board, Class, Subject, Chapter } from '../models/models.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Public: published notes for homepage with slugs for URL building
router.get('/published', async (req, res) => {
  try {
    const notes = await Note.find({ status: 'published' }).sort({ createdAt: -1 }).limit(20)
    const enriched = await Promise.all(notes.map(async (note) => {
      const [board, klass, subject, chapter] = await Promise.all([
        Board.findById(note.boardId).select('slug name'),
        Class.findById(note.classId).select('slug className'),
        Subject.findById(note.subjectId).select('slug subjectName'),
        Chapter.findById(note.chapterId).select('slug chapterName'),
      ])
      return {
        _id: note._id,
        title: note.title,
        summary: note.summary,
        views: note.views,
        boardSlug: board?.slug,
        classSlug: klass?.slug,
        subjectSlug: subject?.slug,
        chapterSlug: chapter?.slug,
        boardName: board?.name,
        className: klass?.className,
        subjectName: subject?.subjectName,
      }
    }))
    res.json(enriched)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Public: search
router.get('/search', async (req, res) => {
  const { q } = req.query
  const filter = { status: 'published' }
  if (q) filter.$text = { $search: q }
  const notes = await Note.find(filter).limit(40)
  res.json(notes)
})

// Admin: all notes regardless of status
router.get('/all', requireAuth, async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 }).limit(200)
  res.json(notes)
})

// Public: get note by board/class/subject/chapter slugs
router.get('/:boardSlug/:classSlug/:subjectSlug/:chapterSlug', async (req, res) => {
  try {
    const { boardSlug, classSlug, subjectSlug, chapterSlug } = req.params
    const board = await Board.findOne({ slug: boardSlug })
    if (!board) return res.status(404).json({ message: 'Board not found' })
    const klass = await Class.findOne({ boardId: board._id, slug: classSlug })
    if (!klass) return res.status(404).json({ message: 'Class not found' })
    const subject = await Subject.findOne({ classId: klass._id, slug: subjectSlug })
    if (!subject) return res.status(404).json({ message: 'Subject not found' })
    const chapter = await Chapter.findOne({ subjectId: subject._id, slug: chapterSlug })
    if (!chapter) return res.status(404).json({ message: 'Chapter not found' })
    const note = await Note.findOneAndUpdate(
      { chapterId: chapter._id, status: 'published' },
      { $inc: { views: 1 } },
      { new: true }
    )
    if (!note) return res.status(404).json({ message: 'Note not found or not published' })
    res.json(note)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// Admin CRUD
router.post('/', requireAuth, async (req, res) => {
  try { res.status(201).json(await Note.create(req.body)) }
  catch (err) { res.status(400).json({ message: err.message }) }
})

router.put('/:id', requireAuth, async (req, res) => {
  res.json(await Note.findByIdAndUpdate(req.params.id, req.body, { new: true }))
})

router.delete('/:id', requireAuth, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id)
  res.json({ message: 'Deleted' })
})

export default router