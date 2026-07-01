import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sb-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const NotesAPI = {
  getByChapter: (boardSlug, classSlug, subjectSlug, chapterSlug) =>
    api.get(`/notes/${boardSlug}/${classSlug}/${subjectSlug}/${chapterSlug}`),
  search: (params) => api.get('/notes/search', { params })
}

export const BoardsAPI = {
  getAll: () => api.get('/boards'),
  getBySlug: (slug) => api.get(`/boards/${slug}`)
}

export default api
