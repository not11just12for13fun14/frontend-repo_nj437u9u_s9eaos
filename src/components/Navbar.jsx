import { Bell, CalendarCheck2, Home, Search, ClipboardList } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ notifications = 0 }) {
  const location = useLocation()
  const link = (to, label, Icon) => (
    <Link to={to} className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${location.pathname===to ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
      <Icon size={18} />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  )

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/10 grid place-items-center text-indigo-600 font-bold">HB</div>
          <span className="font-semibold text-slate-900">Hall Booker</span>
        </Link>
        <nav className="flex items-center gap-2">
          {link('/', 'Dashboard', Home)}
          {link('/search', 'Search', Search)}
          {link('/book', 'Book', CalendarCheck2)}
          {link('/my', 'My Bookings', ClipboardList)}
          <div className="relative ml-1">
            <button className="relative p-2 rounded-xl text-slate-700 hover:bg-slate-100">
              <Bell size={20} />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] leading-3 px-1.5 py-0.5 rounded-full">
                  {notifications}
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
