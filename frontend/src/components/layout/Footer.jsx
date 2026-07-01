import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-navy text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">

        {/* ── Brand ── */}
        <div>
          {/* Replace schoolbuddy-logo.png with your actual logo filename */}
          <img
            src="/logo.svg"
            alt="SchoolBuddy"
            className="h-12 w-auto"
          />
          <p className="text-sm text-navy-100 pt-5">
            Your Buddy in Every Chapter — free notes for every student, every board.
          </p>
        </div>

        {/* ── Boards ── */}
        <div>
          <h4 className="font-semibold mb-2 text-orange">Boards</h4>
          <ul className="text-sm space-y-1 text-navy-100">
            <li><Link to="/board/cbse" className="hover:text-white transition-colors">CBSE</Link></li>
            <li><Link to="/board/icse" className="hover:text-white transition-colors">ICSE</Link></li>
            <li><Link to="/board/kerala-board" className="hover:text-white transition-colors">Kerala Board</Link></li>
            <li><Link to="/board/tamil-nadu" className="hover:text-white transition-colors">Tamil Nadu Board</Link></li>
          </ul>
        </div>

        {/* ── Quick Links ── */}
        <div>
          <h4 className="font-semibold mb-2 text-green">Quick Links</h4>
          <ul className="text-sm space-y-1 text-navy-100">
            <li><Link to="/search" className="hover:text-white transition-colors">Search Notes</Link></li>
            <li><Link to="/admin/login" className="hover:text-white transition-colors">Admin Login</Link></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs text-navy-100 py-4 border-t border-navy-700">
        © {new Date().getFullYear()} SchoolBuddy · schoolbuddy.pearlx.in
      </div>
    </footer>
  )
}