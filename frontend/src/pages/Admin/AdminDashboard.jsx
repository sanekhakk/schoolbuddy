import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext.jsx'
import {
  Sun, Moon, BookOpen, Layers, FolderOpen, FileText, Eye,
  LogOut, Plus, Pencil, Trash2, X, Loader2, ChevronDown, Check,
  ArrowUp, ArrowDown
} from 'lucide-react'

import API_BASE from '../../config/api.js'
const API = API_BASE

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('sb-token')}`
  }
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}${path}`, { ...options, headers: authHeaders() })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

// ─── Modal Shell ────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white dark:bg-surface-darkCard rounded-xl2 shadow-xl w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-navy-400 hover:text-pink">
          <X size={20} />
        </button>
        <h2 className="text-lg font-extrabold mb-5">{title}</h2>
        {children}
      </div>
    </div>
  )
}

// ─── Confirm Delete Dialog ───────────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onClose }) {
  return (
    <Modal title="Confirm Delete" onClose={onClose}>
      <p className="text-sm mb-6 text-navy-400 dark:text-navy-100">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="px-4 py-2 text-sm rounded-full border border-navy-100 dark:border-navy-700">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-2 text-sm rounded-full bg-pink text-white font-semibold">Delete</button>
      </div>
    </Modal>
  )
}

// ─── Form Field Helpers ──────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-1">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full rounded-lg border border-navy-100 dark:border-navy-700 bg-surface dark:bg-navy-700/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue"
const selectCls = "w-full rounded-lg border border-navy-100 dark:border-navy-700 bg-surface dark:bg-navy-700/40 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue"

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// ─── BOARDS ─────────────────────────────────────────────────────────────────
function BoardsSection() {
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // 'add' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', slug: '', description: '' })

  const load = async () => {
    setLoading(true)
    try { setBoards(await apiFetch('/boards')) } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm({ name: '', slug: '', description: '' }); setError(''); setModal('add') }
  const openEdit = (b) => { setSelected(b); setForm({ name: b.name, slug: b.slug, description: b.description || '' }); setError(''); setModal('edit') }
  const openDelete = (b) => { setSelected(b); setModal('delete') }

  const handleSave = async () => {
    if (!form.name.trim()) return setError('Board name is required.')
    setSaving(true); setError('')
    try {
      const payload = { ...form, slug: form.slug || slugify(form.name) }
      if (modal === 'add') await apiFetch('/boards', { method: 'POST', body: JSON.stringify(payload) })
      else await apiFetch(`/boards/${selected._id}`, { method: 'PUT', body: JSON.stringify(payload) })
      setModal(null); load()
    } catch (e) { setError(e.message) }
    setSaving(false)
  }

  const handleDelete = async () => {
    try { await apiFetch(`/boards/${selected._id}`, { method: 'DELETE' }); setModal(null); load() } catch {}
  }

  return (
    <Section title="Boards" onAdd={openAdd} count={boards.length}>
      {loading ? <Spinner /> : boards.map(b => (
        <Row key={b._id} name={b.name} sub={b.slug}
          onEdit={() => openEdit(b)} onDelete={() => openDelete(b)} />
      ))}
      {modal === 'add' && (
        <Modal title="Add Board" onClose={() => setModal(null)}>
          {error && <ErrBox msg={error} />}
          <Field label="Board Name *"><input className={inputCls} value={form.name} placeholder="e.g. CBSE" onChange={e => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })} /></Field>
          <Field label="Slug (auto-filled)"><input className={inputCls} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></Field>
          <Field label="Description"><textarea className={inputCls} rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Field>
          <SaveBtn saving={saving} onClick={handleSave} />
        </Modal>
      )}
      {modal === 'edit' && (
        <Modal title="Edit Board" onClose={() => setModal(null)}>
          {error && <ErrBox msg={error} />}
          <Field label="Board Name *"><input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Slug"><input className={inputCls} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></Field>
          <Field label="Description"><textarea className={inputCls} rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></Field>
          <SaveBtn saving={saving} onClick={handleSave} label="Update" />
        </Modal>
      )}
      {modal === 'delete' && <ConfirmModal message={`Delete board "${selected?.name}"? This cannot be undone.`} onConfirm={handleDelete} onClose={() => setModal(null)} />}
    </Section>
  )
}

// ─── CLASSES ─────────────────────────────────────────────────────────────────
function ClassesSection({ boards }) {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ boardId: '', className: '', slug: '' })

  const load = async () => {
    setLoading(true)
    try { setClasses(await apiFetch('/classes')) } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm({ boardId: boards[0]?._id || '', className: '', slug: '' }); setError(''); setModal('add') }
  const openEdit = (c) => { setSelected(c); setForm({ boardId: c.boardId, className: c.className, slug: c.slug }); setError(''); setModal('edit') }
  const openDelete = (c) => { setSelected(c); setModal('delete') }

  const handleSave = async () => {
    if (!form.boardId || !form.className) return setError('Board and class name are required.')
    setSaving(true); setError('')
    try {
      const payload = { ...form, slug: form.slug || slugify(form.className) }
      if (modal === 'add') await apiFetch('/classes', { method: 'POST', body: JSON.stringify(payload) })
      else await apiFetch(`/classes/${selected._id}`, { method: 'PUT', body: JSON.stringify(payload) })
      setModal(null); load()
    } catch (e) { setError(e.message) }
    setSaving(false)
  }

  const handleDelete = async () => {
    try { await apiFetch(`/classes/${selected._id}`, { method: 'DELETE' }); setModal(null); load() } catch {}
  }

  // Group classes by board, each group sorted by its manual "order" (falls back to className)
  const grouped = useMemo(() => {
    const map = new Map()
    boards.forEach(b => map.set(b._id, { board: b, items: [] }))
    classes.forEach(c => {
      if (!map.has(c.boardId)) map.set(c.boardId, { board: null, items: [] })
      map.get(c.boardId).items.push(c)
    })
    map.forEach(g => g.items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.className.localeCompare(b.className)))
    return map
  }, [boards, classes])

  const moveClass = async (boardId, index, dir) => {
    const group = grouped.get(boardId)
    if (!group) return
    const items = [...group.items]
    const newIndex = index + dir
    if (newIndex < 0 || newIndex >= items.length) return
    ;[items[index], items[newIndex]] = [items[newIndex], items[index]]
    try {
      await apiFetch(`/classes/reorder/${boardId}`, { method: 'PUT', body: JSON.stringify({ orderedIds: items.map(c => c._id) }) })
      load()
    } catch {}
  }

  return (
    <Section title="Classes" onAdd={openAdd} count={classes.length}>
      {loading ? <Spinner /> : boards.map(b => {
        const group = grouped.get(b._id)
        if (!group || group.items.length === 0) return null
        return (
          <div key={b._id}>
            <GroupLabel text={b.name} />
            {group.items.map((c, i) => (
              <Row key={c._id} name={c.className} sub={c.slug}
                onEdit={() => openEdit(c)} onDelete={() => openDelete(c)}
                onMoveUp={i > 0 ? () => moveClass(b._id, i, -1) : null}
                onMoveDown={i < group.items.length - 1 ? () => moveClass(b._id, i, 1) : null}
              />
            ))}
          </div>
        )
      })}
      {!loading && classes.length === 0 && <EmptyRow text="No classes yet." />}
      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Add Class' : 'Edit Class'} onClose={() => setModal(null)}>
          {error && <ErrBox msg={error} />}
          <Field label="Board *">
            <select className={selectCls} value={form.boardId} onChange={e => setForm({ ...form, boardId: e.target.value })}>
              <option value="">-- Select Board --</option>
              {boards.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
            </select>
          </Field>
          <Field label="Class Name *"><input className={inputCls} value={form.className} placeholder="e.g. Class 10" onChange={e => setForm({ ...form, className: e.target.value, slug: slugify(e.target.value) })} /></Field>
          <Field label="Slug"><input className={inputCls} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></Field>
          <SaveBtn saving={saving} onClick={handleSave} label={modal === 'add' ? 'Add Class' : 'Update Class'} />
        </Modal>
      )}
      {modal === 'delete' && <ConfirmModal message={`Delete "${selected?.className}"?`} onConfirm={handleDelete} onClose={() => setModal(null)} />}
    </Section>
  )
}

// ─── SUBJECTS ────────────────────────────────────────────────────────────────
function SubjectsSection({ classes, boards }) {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ classId: '', subjectName: '', slug: '' })

  const load = async () => {
    setLoading(true)
    try { setSubjects(await apiFetch('/subjects')) } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm({ classId: classes[0]?._id || '', subjectName: '', slug: '' }); setError(''); setModal('add') }
  const openEdit = (s) => { setSelected(s); setForm({ classId: s.classId, subjectName: s.subjectName, slug: s.slug }); setError(''); setModal('edit') }
  const openDelete = (s) => { setSelected(s); setModal('delete') }

  const handleSave = async () => {
    if (!form.classId || !form.subjectName) return setError('Class and subject name are required.')
    setSaving(true); setError('')
    try {
      const payload = { ...form, slug: form.slug || slugify(form.subjectName) }
      if (modal === 'add') await apiFetch('/subjects', { method: 'POST', body: JSON.stringify(payload) })
      else await apiFetch(`/subjects/${selected._id}`, { method: 'PUT', body: JSON.stringify(payload) })
      setModal(null); load()
    } catch (e) { setError(e.message) }
    setSaving(false)
  }

  const handleDelete = async () => {
    try { await apiFetch(`/subjects/${selected._id}`, { method: 'DELETE' }); setModal(null); load() } catch {}
  }

  // Group subjects by board, then by class within each board
  const grouped = useMemo(() => {
    const byBoard = new Map()
    boards.forEach(b => byBoard.set(b._id, { board: b, byClass: new Map() }))
    classes.forEach(c => {
      if (!byBoard.has(c.boardId)) byBoard.set(c.boardId, { board: null, byClass: new Map() })
      byBoard.get(c.boardId).byClass.set(c._id, { cls: c, items: [] })
    })
    subjects.forEach(s => {
      const cls = classes.find(c => c._id === s.classId)
      const boardId = cls?.boardId
      if (!byBoard.has(boardId)) byBoard.set(boardId, { board: null, byClass: new Map() })
      const bg = byBoard.get(boardId)
      if (!bg.byClass.has(s.classId)) bg.byClass.set(s.classId, { cls: cls || null, items: [] })
      bg.byClass.get(s.classId).items.push(s)
    })
    return byBoard
  }, [boards, classes, subjects])

  return (
    <Section title="Subjects" onAdd={openAdd} count={subjects.length}>
      {loading ? <Spinner /> : boards.map(b => {
        const bg = grouped.get(b._id)
        if (!bg) return null
        const classGroups = [...bg.byClass.values()].filter(cg => cg.items.length > 0)
        if (classGroups.length === 0) return null
        return (
          <div key={b._id}>
            <GroupLabel text={b.name} />
            {classGroups.map(cg => (
              <div key={cg.cls?._id || 'unknown'}>
                <GroupLabel text={cg.cls?.className || 'Unknown class'} sub />
                {cg.items.map(s => (
                  <Row key={s._id} name={s.subjectName} sub={s.slug}
                    onEdit={() => openEdit(s)} onDelete={() => openDelete(s)} />
                ))}
              </div>
            ))}
          </div>
        )
      })}
      {!loading && subjects.length === 0 && <EmptyRow text="No subjects yet." />}
      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Add Subject' : 'Edit Subject'} onClose={() => setModal(null)}>
          {error && <ErrBox msg={error} />}
          <Field label="Class *">
            <select className={selectCls} value={form.classId} onChange={e => setForm({ ...form, classId: e.target.value })}>
              <option value="">-- Select Class --</option>
              {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
            </select>
          </Field>
          <Field label="Subject Name *"><input className={inputCls} value={form.subjectName} placeholder="e.g. Science" onChange={e => setForm({ ...form, subjectName: e.target.value, slug: slugify(e.target.value) })} /></Field>
          <Field label="Slug"><input className={inputCls} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></Field>
          <SaveBtn saving={saving} onClick={handleSave} label={modal === 'add' ? 'Add Subject' : 'Update Subject'} />
        </Modal>
      )}
      {modal === 'delete' && <ConfirmModal message={`Delete subject "${selected?.subjectName}"?`} onConfirm={handleDelete} onClose={() => setModal(null)} />}
    </Section>
  )
}

// ─── CHAPTERS ────────────────────────────────────────────────────────────────
function ChaptersSection({ subjects, classes, boards }) {
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ subjectId: '', chapterName: '', slug: '', chapterNumber: '' })

  const load = async () => {
    setLoading(true)
    try { setChapters(await apiFetch('/chapters')) } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm({ subjectId: subjects[0]?._id || '', chapterName: '', slug: '', chapterNumber: '' }); setError(''); setModal('add') }
  const openEdit = (c) => { setSelected(c); setForm({ subjectId: c.subjectId, chapterName: c.chapterName, slug: c.slug, chapterNumber: c.chapterNumber || '' }); setError(''); setModal('edit') }
  const openDelete = (c) => { setSelected(c); setModal('delete') }

  const handleSave = async () => {
    if (!form.subjectId || !form.chapterName) return setError('Subject and chapter name are required.')
    setSaving(true); setError('')
    try {
      const payload = { ...form, slug: form.slug || slugify(form.chapterName), chapterNumber: Number(form.chapterNumber) || 0 }
      if (modal === 'add') await apiFetch('/chapters', { method: 'POST', body: JSON.stringify(payload) })
      else await apiFetch(`/chapters/${selected._id}`, { method: 'PUT', body: JSON.stringify(payload) })
      setModal(null); load()
    } catch (e) { setError(e.message) }
    setSaving(false)
  }

  const handleDelete = async () => {
    try { await apiFetch(`/chapters/${selected._id}`, { method: 'DELETE' }); setModal(null); load() } catch {}
  }

  // Group chapters by board, then class, then subject
  const grouped = useMemo(() => {
    const byBoard = new Map()
    boards.forEach(b => byBoard.set(b._id, { board: b, byClass: new Map() }))
    chapters.forEach(ch => {
      const subj = subjects.find(s => s._id === ch.subjectId)
      const cls = classes.find(c => c._id === subj?.classId)
      const boardId = cls?.boardId
      if (!byBoard.has(boardId)) byBoard.set(boardId, { board: null, byClass: new Map() })
      const bg = byBoard.get(boardId)
      if (!bg.byClass.has(cls?._id)) bg.byClass.set(cls?._id, { cls: cls || null, bySubject: new Map() })
      const cg = bg.byClass.get(cls?._id)
      if (!cg.bySubject.has(ch.subjectId)) cg.bySubject.set(ch.subjectId, { subj: subj || null, items: [] })
      cg.bySubject.get(ch.subjectId).items.push(ch)
    })
    byBoard.forEach(bg => bg.byClass.forEach(cg => cg.bySubject.forEach(sg =>
      sg.items.sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0))
    )))
    return byBoard
  }, [boards, classes, subjects, chapters])

  return (
    <Section title="Chapters" onAdd={openAdd} count={chapters.length}>
      {loading ? <Spinner /> : boards.map(b => {
        const bg = grouped.get(b._id)
        if (!bg) return null
        const classGroups = [...bg.byClass.values()].filter(cg => [...cg.bySubject.values()].some(sg => sg.items.length > 0))
        if (classGroups.length === 0) return null
        return (
          <div key={b._id}>
            <GroupLabel text={b.name} />
            {classGroups.map(cg => (
              <div key={cg.cls?._id || 'unknown'}>
                <GroupLabel text={cg.cls?.className || 'Unknown class'} sub />
                {[...cg.bySubject.values()].filter(sg => sg.items.length > 0).map(sg => (
                  <div key={sg.subj?._id || 'unknown'}>
                    <GroupLabel text={sg.subj?.subjectName || 'Unknown subject'} sub2 />
                    {sg.items.map(c => (
                      <Row key={c._id} name={c.chapterName} sub={`Ch ${c.chapterNumber || '?'}`}
                        onEdit={() => openEdit(c)} onDelete={() => openDelete(c)} />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      })}
      {!loading && chapters.length === 0 && <EmptyRow text="No chapters yet." />}
      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Add Chapter' : 'Edit Chapter'} onClose={() => setModal(null)}>
          {error && <ErrBox msg={error} />}
          <Field label="Subject *">
            <select className={selectCls} value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value })}>
              <option value="">-- Select Subject --</option>
              {subjects.map(s => <option key={s._id} value={s._id}>{s.subjectName}</option>)}
            </select>
          </Field>
          <Field label="Chapter Number"><input className={inputCls} type="number" value={form.chapterNumber} placeholder="1" onChange={e => setForm({ ...form, chapterNumber: e.target.value })} /></Field>
          <Field label="Chapter Name *"><input className={inputCls} value={form.chapterName} placeholder="e.g. Chemical Reactions and Equations" onChange={e => setForm({ ...form, chapterName: e.target.value, slug: slugify(e.target.value) })} /></Field>
          <Field label="Slug"><input className={inputCls} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></Field>
          <SaveBtn saving={saving} onClick={handleSave} label={modal === 'add' ? 'Add Chapter' : 'Update Chapter'} />
        </Modal>
      )}
      {modal === 'delete' && <ConfirmModal message={`Delete chapter "${selected?.chapterName}"?`} onConfirm={handleDelete} onClose={() => setModal(null)} />}
    </Section>
  )
}

// ─── NOTES ───────────────────────────────────────────────────────────────────
function NotesSection({ boards, classes, subjects, chapters }) {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ boardId: '', classId: '', subjectId: '', chapterId: '', title: '', slug: '', summary: '', content: '', keywords: '', status: 'draft' })

  const load = async () => {
    setLoading(true)
    try { setNotes(await apiFetch('/notes/all')) } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const blank = { boardId: '', classId: '', subjectId: '', chapterId: '', title: '', slug: '', summary: '', content: '', keywords: '', status: 'draft' }

  const openAdd = () => { setForm(blank); setError(''); setModal('add') }
  const openEdit = (n) => {
    setSelected(n)
    setForm({ boardId: n.boardId, classId: n.classId, subjectId: n.subjectId, chapterId: n.chapterId, title: n.title, slug: n.slug, summary: n.summary || '', content: typeof n.content === 'string' ? n.content : JSON.stringify(n.content || ''), keywords: (n.keywords || []).join(', '), status: n.status })
    setError(''); setModal('edit')
  }
  const openDelete = (n) => { setSelected(n); setModal('delete') }

  const handleSave = async () => {
    if (!form.title || !form.boardId || !form.chapterId) return setError('Board, chapter and title are required.')
    setSaving(true); setError('')
    try {
      const payload = { ...form, slug: form.slug || slugify(form.title), keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean) }
      if (modal === 'add') await apiFetch('/notes', { method: 'POST', body: JSON.stringify(payload) })
      else await apiFetch(`/notes/${selected._id}`, { method: 'PUT', body: JSON.stringify(payload) })
      setModal(null); load()
    } catch (e) { setError(e.message) }
    setSaving(false)
  }

  const handleDelete = async () => {
    try { await apiFetch(`/notes/${selected._id}`, { method: 'DELETE' }); setModal(null); load() } catch {}
  }

  const statusColor = { draft: 'text-orange', review: 'text-blue', published: 'text-green' }
  const chapterName = (id) => chapters.find(c => c._id === id)?.chapterName || id

  // Group notes by board, then class, then subject (same hierarchy as Chapters)
  const grouped = useMemo(() => {
    const byBoard = new Map()
    boards.forEach(b => byBoard.set(b._id, { board: b, byClass: new Map() }))
    notes.forEach(n => {
      const boardId = n.boardId
      if (!byBoard.has(boardId)) byBoard.set(boardId, { board: null, byClass: new Map() })
      const bg = byBoard.get(boardId)
      const cls = classes.find(c => c._id === n.classId)
      if (!bg.byClass.has(n.classId)) bg.byClass.set(n.classId, { cls: cls || null, bySubject: new Map() })
      const cg = bg.byClass.get(n.classId)
      const subj = subjects.find(s => s._id === n.subjectId)
      if (!cg.bySubject.has(n.subjectId)) cg.bySubject.set(n.subjectId, { subj: subj || null, items: [] })
      cg.bySubject.get(n.subjectId).items.push(n)
    })
    return byBoard
  }, [boards, classes, subjects, notes])

  return (
    <Section title="Notes" onAdd={openAdd} count={notes.length} fullWidth>
      {loading ? <Spinner /> : boards.map(b => {
        const bg = grouped.get(b._id)
        if (!bg) return null
        const classGroups = [...bg.byClass.values()].filter(cg => [...cg.bySubject.values()].some(sg => sg.items.length > 0))
        if (classGroups.length === 0) return null
        return (
          <div key={b._id}>
            <GroupLabel text={b.name} />
            {classGroups.map(cg => (
              <div key={cg.cls?._id || 'unknown'}>
                <GroupLabel text={cg.cls?.className || 'Unknown class'} sub />
                {[...cg.bySubject.values()].filter(sg => sg.items.length > 0).map(sg => (
                  <div key={sg.subj?._id || 'unknown'}>
                    <GroupLabel text={sg.subj?.subjectName || 'Unknown subject'} sub2 />
                    {sg.items.map(n => (
                      <Row key={n._id} name={n.title}
                        sub={<span>{chapterName(n.chapterId)} · <span className={statusColor[n.status] || ''}>{n.status}</span></span>}
                        onEdit={() => openEdit(n)} onDelete={() => openDelete(n)} />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      })}
      {!loading && notes.length === 0 && <EmptyRow text="No notes yet." />}
      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Add Note' : 'Edit Note'} onClose={() => setModal(null)}>
          {error && <ErrBox msg={error} />}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Board *">
              <select className={selectCls} value={form.boardId} onChange={e => setForm({ ...form, boardId: e.target.value })}>
                <option value="">-- Board --</option>
                {boards.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </Field>
            <Field label="Class *">
              <select className={selectCls} value={form.classId} onChange={e => setForm({ ...form, classId: e.target.value })}>
                <option value="">-- Class --</option>
                {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
              </select>
            </Field>
            <Field label="Subject *">
              <select className={selectCls} value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value })}>
                <option value="">-- Subject --</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.subjectName}</option>)}
              </select>
            </Field>
            <Field label="Chapter *">
              <select className={selectCls} value={form.chapterId} onChange={e => setForm({ ...form, chapterId: e.target.value })}>
                <option value="">-- Chapter --</option>
                {chapters.map(c => <option key={c._id} value={c._id}>{c.chapterName}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Note Title *"><input className={inputCls} value={form.title} placeholder="e.g. Photosynthesis — Complete Notes" onChange={e => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })} /></Field>
          <Field label="Slug"><input className={inputCls} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></Field>
          <Field label="Summary (shown in cards)"><textarea className={inputCls} rows={2} value={form.summary} placeholder="1-2 line summary visible in search results..." onChange={e => setForm({ ...form, summary: e.target.value })} /></Field>
          <Field label="Full Content (paste notes here)"><textarea className={inputCls} rows={6} value={form.content} placeholder="Write the complete chapter notes here. HTML is supported." onChange={e => setForm({ ...form, content: e.target.value })} /></Field>
          <Field label="Keywords (comma separated)"><input className={inputCls} value={form.keywords} placeholder="photosynthesis, chlorophyll, class 10 science" onChange={e => setForm({ ...form, keywords: e.target.value })} /></Field>
          <Field label="Status">
            <select className={selectCls} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="draft">Draft (not visible to students)</option>
              <option value="review">Under Review</option>
              <option value="published">Published (visible to students)</option>
            </select>
          </Field>
          <SaveBtn saving={saving} onClick={handleSave} label={modal === 'add' ? 'Save Note' : 'Update Note'} />
        </Modal>
      )}
      {modal === 'delete' && <ConfirmModal message={`Delete note "${selected?.title}"?`} onConfirm={handleDelete} onClose={() => setModal(null)} />}
    </Section>
  )
}

// ─── Shared Sub-components ───────────────────────────────────────────────────
function Section({ title, onAdd, count, children, fullWidth }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`bg-white dark:bg-surface-darkCard rounded-xl2 shadow-sm ${fullWidth ? 'col-span-full' : ''}`}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-navy-100 dark:border-navy-700 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-2">
          <span className="font-bold">{title}</span>
          <span className="text-xs bg-blue/10 text-blue rounded-full px-2 py-0.5">{count}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={e => { e.stopPropagation(); onAdd() }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue text-white text-xs font-semibold hover:bg-blue-light transition-colors">
            <Plus size={14} /> Add
          </button>
          <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </div>
      {open && <div className="max-h-96 overflow-y-auto">{children}</div>}
    </div>
  )
}

function Row({ name, sub, onEdit, onDelete, onMoveUp, onMoveDown }) {
  const hasMove = onMoveUp !== undefined || onMoveDown !== undefined
  return (
    <div className="flex items-center justify-between px-5 py-3 pl-8 border-b border-navy-100 dark:border-navy-700 hover:bg-surface dark:hover:bg-navy-700/20">
      <div>
        <p className="text-sm font-medium">{name}</p>
        {sub && <p className="text-xs text-navy-400 dark:text-navy-100">{sub}</p>}
      </div>
      <div className="flex items-center gap-1">
        {hasMove && (
          <>
            <button onClick={onMoveUp} disabled={!onMoveUp} className="p-1.5 rounded-lg hover:bg-navy/10 disabled:opacity-25 disabled:cursor-not-allowed" title="Move up"><ArrowUp size={14} /></button>
            <button onClick={onMoveDown} disabled={!onMoveDown} className="p-1.5 rounded-lg hover:bg-navy/10 disabled:opacity-25 disabled:cursor-not-allowed" title="Move down"><ArrowDown size={14} /></button>
          </>
        )}
        <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-blue/10 text-blue"><Pencil size={15} /></button>
        <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-pink/10 text-pink"><Trash2 size={15} /></button>
      </div>
    </div>
  )
}

// Sub-heading used to label a group of rows by its parent (board / class / subject)
function GroupLabel({ text, sub, sub2 }) {
  return (
    <div className={`px-5 py-1.5 text-xs font-bold uppercase tracking-wide bg-surface dark:bg-navy-800/60 text-navy-400 dark:text-navy-100 sticky top-0 ${sub2 ? 'pl-8 !text-[10px]' : sub ? 'pl-6' : ''}`}>
      {text}
    </div>
  )
}

function EmptyRow({ text }) {
  return <div className="px-5 py-6 text-sm text-center text-navy-400 dark:text-navy-100">{text}</div>
}

function Spinner() {
  return <div className="flex justify-center py-6"><Loader2 size={22} className="animate-spin text-blue" /></div>
}

function ErrBox({ msg }) {
  return <div className="mb-4 px-3 py-2 rounded-lg bg-pink/10 text-pink text-sm">{msg}</div>
}

function SaveBtn({ saving, onClick, label = 'Save' }) {
  return (
    <button onClick={onClick} disabled={saving}
      className="w-full mt-2 py-2 rounded-full bg-blue text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 hover:bg-blue-light transition-colors">
      {saving ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : <><Check size={15} /> {label}</>}
    </button>
  )
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const admin = JSON.parse(localStorage.getItem('sb-admin') || '{}')
  const [boards, setBoards] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [chapters, setChapters] = useState([])

  useEffect(() => {
    apiFetch('/boards').then(setBoards).catch(() => {})
    apiFetch('/classes').then(setClasses).catch(() => {})
    apiFetch('/subjects').then(setSubjects).catch(() => {})
    apiFetch('/chapters').then(setChapters).catch(() => {})
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('sb-token')
    localStorage.removeItem('sb-admin')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark text-navy dark:text-white">
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 bg-white dark:bg-surface-darkCard border-b border-navy-100 dark:border-navy-700 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold">School<span className="text-pink">Buddy</span> Admin</h1>
          {admin.name && <p className="text-xs text-navy-400 dark:text-navy-100">Logged in as {admin.name}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-full bg-navy-50 dark:bg-navy-700">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={handleLogout} className="flex items-center gap-1 px-3 py-2 rounded-full bg-pink/10 text-pink text-sm font-semibold hover:bg-pink/20 transition-colors">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      <div className="p-6 grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Boards', value: boards.length, icon: BookOpen, color: 'text-pink' },
          { label: 'Classes', value: classes.length, icon: Layers, color: 'text-blue' },
          { label: 'Subjects', value: subjects.length, icon: FolderOpen, color: 'text-orange' },
          { label: 'Chapters', value: chapters.length, icon: FileText, color: 'text-green' },
          { label: 'Total Views', value: '—', icon: Eye, color: 'text-purple' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-surface-darkCard rounded-xl2 p-5 shadow-sm">
            <s.icon className={`${s.color} mb-2`} size={22} />
            <p className="text-2xl font-extrabold">{s.value}</p>
            <p className="text-xs text-navy-400 dark:text-navy-100">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="px-6 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <BoardsSection />
        <ClassesSection boards={boards} />
        <SubjectsSection classes={classes} boards={boards} />
        <ChaptersSection subjects={subjects} classes={classes} boards={boards} />
        <NotesSection boards={boards} classes={classes} subjects={subjects} chapters={chapters} />
      </div>
    </div>
  )
}