import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Admin } from '../models/models.js'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const existing = await Admin.findOne({ email })
    if (existing) return res.status(400).json({ message: 'Admin already exists' })
    const passwordHash = await bcrypt.hash(password, 10)
    const admin = await Admin.create({ name, email, passwordHash })
    res.status(201).json({ id: admin._id, email: admin.email })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const admin = await Admin.findOne({ email })
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' })
    const valid = await bcrypt.compare(password, admin.passwordHash)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })
    const token = jwt.sign({ id: admin._id, email: admin.email, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
