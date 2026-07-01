import { Router } from 'express'
import { Subject, Class, Board } from '../models/models.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// All subjects (admin)
router.get('/', async (req, res) => {
  const subjects = await Subject.find().sort({ subjectName: 1 })
  res.json(subjects)
})

// Subjects by board slug + class slug (used by ClassPage)
router.get('/by-class/:boardSlug/:classSlug', async (req, res) => {
  try {
    const board = await Board.findOne({ slug: req.params.boardSlug })
    if (!board) return res.json({ subjects: [], classInfo: null })
    const classInfo = await Class.findOne({ boardId: board._id, slug: req.params.classSlug })
    if (!classInfo) return res.json({ subjects: [], classInfo: null })
    const subjects = await Subject.find({ classId: classInfo._id }).sort({ subjectName: 1 })
    res.json({ subjects, classInfo })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.post('/', requireAuth, async (req, res) => {
  try { res.status(201).json(await Subject.create(req.body)) }
  catch (err) { res.status(400).json({ message: err.message }) }
})

router.put('/:id', requireAuth, async (req, res) => {
  res.json(await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true }))
})

router.delete('/:id', requireAuth, async (req, res) => {
  await Subject.findByIdAndDelete(req.params.id)
  res.json({ message: 'Deleted' })
})

export default router