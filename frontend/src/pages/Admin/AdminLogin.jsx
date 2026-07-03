import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext.jsx'
import API from '../../config/api.js'
import { Sun, Moon, Loader2 } from 'lucide-react'

export default function AdminLogin() {
  const { theme, toggleTheme } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Login failed. Check your email and password.')
        return
      }
      // Save token so ProtectedRoute and API calls can use it
      localStorage.setItem('sb-token', data.token)
      localStorage.setItem('sb-admin', JSON.stringify(data.admin))
      navigate('/admin')
    } catch (err) {
      setError('Cannot reach the server. Make sure the backend is running on port 5000.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark text-navy dark:text-white px-4">
      <button onClick={toggleTheme} className="absolute top-4 right-4 p-2 rounded-full bg-navy-50 dark:bg-navy-700">
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white dark:bg-surface-darkCard rounded-xl2 p-8 shadow-md">
        <h1 className="text-2xl font-extrabold mb-2 text-center">
          School<span className="text-pink">Buddy</span> Admin
        </h1>
        <p className="text-center text-xs text-navy-400 dark:text-navy-100 mb-6">Sign in to manage content</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-pink/10 text-pink text-sm font-medium">
            {error}
          </div>
        )}

        <label className="block text-sm font-semibold mb-1">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          placeholder="admin@schoolbuddy.in"
          className="w-full mb-4 rounded-lg border border-navy-100 dark:border-navy-700 bg-surface dark:bg-navy-700/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue"
        />
        <label className="block text-sm font-semibold mb-1">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          placeholder="••••••••"
          className="w-full mb-6 rounded-lg border border-navy-100 dark:border-navy-700 bg-surface dark:bg-navy-700/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue text-white font-semibold py-2 rounded-full hover:bg-blue-light transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : 'Login'}
        </button>
      </form>
    </div>
  )
}