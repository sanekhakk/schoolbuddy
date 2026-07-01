import { Router } from 'express'
import { Class, Board } from '../models/models.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Get all classes (admin)
router.get('/', async (req, res) => {
  const classes = await Class.find().sort({ className: 1 })
  res.json(classes)
})

// Get classes by board slug (used by BoardPage)
router.get('/by-board/:boardSlug', async (req, res) => {
  try {
    const board = await Board.findOne({ slug: req.params.boardSlug })
    if (!board) return res.json([])
    const classes = await Class.find({ boardId: board._id }).sort({ className: 1 })
    res.json(classes)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.post('/', requireAuth, async (req, res) => {
  try { res.status(201).json(await Class.create(req.body)) }
  catch (err) { res.status(400).json({ message: err.message }) }
})

router.put('/:id', requireAuth, async (req, res) => {
  res.json(await Class.findByIdAndUpdate(req.params.id, req.body, { new: true }))
})

router.delete('/:id', requireAuth, async (req, res) => {
  await Class.findByIdAndDelete(req.params.id)
  res.json({ message: 'Deleted' })
})

export default router