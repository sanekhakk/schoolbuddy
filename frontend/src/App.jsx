import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout.jsx'
import Home from './pages/Home/Home.jsx'
import BoardPage from './pages/Board/BoardPage.jsx'
import ClassPage from './pages/Class/ClassPage.jsx'
import SubjectPage from './pages/Subject/SubjectPage.jsx'
import ChapterPage from './pages/Chapter/ChapterPage.jsx'
import SearchPage from './pages/Search/SearchPage.jsx'
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'
import AdminLogin from './pages/Admin/AdminLogin.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/board/:boardSlug" element={<BoardPage />} />
        <Route path="/board/:boardSlug/:classSlug" element={<ClassPage />} />
        <Route path="/board/:boardSlug/:classSlug/:subjectSlug" element={<SubjectPage />} />
        <Route path="/board/:boardSlug/:classSlug/:subjectSlug/:chapterSlug" element={<ChapterPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}