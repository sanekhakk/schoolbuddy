import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/authRoutes.js'
import boardRoutes from './routes/boardRoutes.js'
import classRoutes from './routes/classRoutes.js'
import subjectRoutes from './routes/subjectRoutes.js'
import chapterRoutes from './routes/chapterRoutes.js'
import noteRoutes from './routes/noteRoutes.js'

const app = express()

// Render (and most hosts) sit behind a reverse proxy that sets X-Forwarded-For.
// Without this, express-rate-limit can't trust that header and throws ERR_ERL_UNEXPECTED_X_FORWARDED_FOR.
// '1' = trust the first hop (the platform's proxy) — safe default for Render/Heroku/etc.
app.set('trust proxy', 1)

app.use(express.json({ limit: '2mb' }))
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }))

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 })
app.use('/api', limiter)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/boards', boardRoutes)
app.use('/api/classes', classRoutes)
app.use('/api/subjects', subjectRoutes)
app.use('/api/chapters', chapterRoutes)
app.use('/api/notes', noteRoutes)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})

export default app;