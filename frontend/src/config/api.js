// All API calls go through this base URL.
// Set VITE_API_URL in your Vercel environment variables to your Render backend URL.
// Example: https://schoolbuddy-api.onrender.com/api

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default API_BASE