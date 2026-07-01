import { Navigate } from 'react-router-dom'

// Wraps any route that requires the admin to be logged in.
// If there is no token in localStorage, it sends the user to /admin/login instead.
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('sb-token')

  if (!token) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}