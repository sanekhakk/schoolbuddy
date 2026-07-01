import { Link } from 'react-router-dom'

const COLORS = ['bg-pink', 'bg-blue', 'bg-orange', 'bg-green', 'bg-purple']

export default function BoardCard({ board, index = 0 }) {
  const color = COLORS[index % COLORS.length]
  return (
    <Link
      to={`/board/${board.slug}`}
      className="card-hover flex flex-col items-center justify-center gap-3 bg-white dark:bg-surface-darkCard rounded-xl2 p-6 shadow-sm text-center"
    >
      <div className={`w-14 h-14 rounded-full ${color} text-white flex items-center justify-center font-extrabold text-lg`}>
        {board.name.slice(0, 2).toUpperCase()}
      </div>
      <span className="font-semibold">{board.name}</span>
    </Link>
  )
}
