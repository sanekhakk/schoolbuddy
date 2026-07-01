import { Router } from 'express'
import { Chapter, Subject, Class, Board } from '../models/models.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// All chapters (admin)
router.get('/', async (req, res) => {
  const chapters = await Chapter.find().sort({ chapterNumber: 1 })
  res.json(chapters)
})

// Chapters by board/class/subject slugs (used by SubjectPage)
router.get('/by-subject/:boardSlug/:classSlug/:subjectSlug', async (req, res) => {
  try {
    const board = await Board.findOne({ slug: req.params.boardSlug })
    if (!board) return res.json({ chapters: [], subjectInfo: null })
    const classInfo = await Class.findOne({ boardId: board._id, slug: req.params.classSlug })
    if (!classInfo) return res.json({ chapters: [], subjectInfo: null })
    const subjectInfo = await Subject.findOne({ classId: classInfo._id, slug: req.params.subjectSlug })
    if (!subjectInfo) return res.json({ chapters: [], subjectInfo: null })
    const chapters = await Chapter.find({ subjectId: subjectInfo._id }).sort({ chapterNumber: 1 })
    res.json({ chapters, subjectInfo })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.post('/', requireAuth, async (req, res) => {
  try { res.status(201).json(await Chapter.create(req.body)) }
  catch (err) { res.status(400).json({ message: err.message }) }
})

router.put('/:id', requireAuth, async (req, res) => {
  res.json(await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true }))
})

router.delete('/:id', requireAuth, async (req, res) => {
  await Chapter.findByIdAndDelete(req.params.id)
  res.json({ message: 'Deleted' })
})

export default router