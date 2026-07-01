import { Router } from 'express'
import { Board } from '../models/models.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

router.get('/', async (req, res) => {
  const boards = await Board.find().sort({ name: 1 })
  res.json(boards)
})

router.get('/:slug', async (req, res) => {
  const board = await Board.findOne({ slug: req.params.slug })
  if (!board) return res.status(404).json({ message: 'Board not found' })
  res.json(board)
})

router.post('/', requireAuth, async (req, res) => {
  const board = await Board.create(req.body)
  res.status(201).json(board)
})

router.put('/:id', requireAuth, async (req, res) => {
  const board = await Board.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(board)
})

router.delete('/:id', requireAuth, async (req, res) => {
  await Board.findByIdAndDelete(req.params.id)
  res.json({ message: 'Board deleted' })
})

export default router
