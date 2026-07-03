import mongoose from 'mongoose'
const { Schema } = mongoose

export const Board = mongoose.model('Board', new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String
}, { timestamps: true }))

export const Class = mongoose.model('Class', new Schema({
  boardId: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
  className: { type: String, required: true },
  slug: { type: String, required: true },
  order: { type: Number, default: 0 } // controls display order within a board (Class 1, Class 2, ...)
}, { timestamps: true }))

export const Subject = mongoose.model('Subject', new Schema({
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  subjectName: { type: String, required: true },
  slug: { type: String, required: true },
  icon: String
}, { timestamps: true }))

export const Chapter = mongoose.model('Chapter', new Schema({
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  chapterName: { type: String, required: true },
  slug: { type: String, required: true },
  chapterNumber: Number
}, { timestamps: true }))

const noteSchema = new Schema({
  boardId: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter', required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, index: true },
  content: Schema.Types.Mixed,
  summary: String,
  keywords: [String],
  images: [String],
  views: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  helpfulCount: { type: Number, default: 0 },
  version: { type: Number, default: 1 },
  status: { type: String, enum: ['draft', 'review', 'published'], default: 'draft' },
  pdfUrl: { type: String, default: '' }
}, { timestamps: true })

noteSchema.index({ title: 'text', keywords: 'text' })

export const Note = mongoose.model('Note', noteSchema)

export const Advertisement = mongoose.model('Advertisement', new Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  enabled: { type: Boolean, default: true }
}, { timestamps: true }))

export const Admin = mongoose.model('Admin', new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'admin' }
}, { timestamps: true }))