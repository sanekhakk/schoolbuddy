export const BOARDS = [
  { slug: 'cbse', name: 'CBSE' },
  { slug: 'icse', name: 'ICSE' },
  { slug: 'kerala', name: 'Kerala Board' },
  { slug: 'tamil-nadu', name: 'Tamil Nadu Board' },
  { slug: 'karnataka', name: 'Karnataka Board' },
  { slug: 'maharashtra', name: 'Maharashtra Board' }
]

export const SUBJECTS = ['Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'Social Science', 'English']

export const SAMPLE_NOTES = [
  {
    slug: 'chemical-reactions-and-equations',
    title: 'Chemical Reactions and Equations',
    summary: 'Types of chemical reactions, balancing equations and everyday examples explained simply.',
    boardSlug: 'cbse', className: 'Class 10', classSlug: 'class-10',
    subjectName: 'Science', subjectSlug: 'science', views: 1240
  },
  {
    slug: 'photosynthesis',
    title: 'Photosynthesis',
    summary: 'How plants make their food — step by step notes with diagrams and important questions.',
    boardSlug: 'cbse', className: 'Class 10', classSlug: 'class-10',
    subjectName: 'Science', subjectSlug: 'science', views: 980
  },
  {
    slug: 'polynomials',
    title: 'Polynomials',
    summary: 'Degree, zeros, and factorisation of polynomials with solved examples.',
    boardSlug: 'kerala', className: 'Class 9', classSlug: 'class-9',
    subjectName: 'Maths', subjectSlug: 'maths', views: 760
  },
  {
    slug: 'french-revolution',
    title: 'The French Revolution',
    summary: 'Causes, events and outcomes of the French Revolution summarised for quick revision.',
    boardSlug: 'cbse', className: 'Class 9', classSlug: 'class-9',
    subjectName: 'History', subjectSlug: 'history', views: 540
  }
]
