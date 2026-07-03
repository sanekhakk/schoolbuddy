import { Router } from 'express'
import { Class, Board } from '../models/models.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Get all classes (admin) — sorted by board, then manual order (Class 1, Class 2 ... Class 10, Class 11)
router.get('/', async (req, res) => {
  const classes = await Class.find().sort({ boardId: 1, order: 1, className: 1 })
  res.json(classes)
})

// Get classes by board slug (used by BoardPage) — sorted by manual order, not alphabetically
router.get('/by-board/:boardSlug', async (req, res) => {
  try {
    const board = await Board.findOne({ slug: req.params.boardSlug })
    if (!board) return res.json([])
    const classes = await Class.find({ boardId: board._id }).sort({ order: 1, className: 1 })
    res.json(classes)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.post('/', requireAuth, async (req, res) => {
  try {
    // New classes go to the end of their board's list by default
    const count = await Class.countDocuments({ boardId: req.body.boardId })
    const cls = await Class.create({ ...req.body, order: req.body.order ?? count })
    res.status(201).json(cls)
  } catch (err) { res.status(400).json({ message: err.message }) }
})

// Reorder classes within a board. Body: { orderedIds: [id1, id2, ...] } in the desired display order
router.put('/reorder/:boardId', requireAuth, async (req, res) => {
  try {
    const { orderedIds } = req.body
    if (!Array.isArray(orderedIds)) return res.status(400).json({ message: 'orderedIds must be an array' })
    await Promise.all(orderedIds.map((id, index) =>
      Class.findOneAndUpdate({ _id: id, boardId: req.params.boardId }, { order: index })
    ))
    res.json({ message: 'Reordered' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.put('/:id', requireAuth, async (req, res) => {
  res.json(await Class.findByIdAndUpdate(req.params.id, req.body, { new: true }))
})

router.delete('/:id', requireAuth, async (req, res) => {
  await Class.findByIdAndDelete(req.params.id)
  res.json({ message: 'Deleted' })
})

export default router