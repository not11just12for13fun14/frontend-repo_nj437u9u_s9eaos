import { useEffect, useState } from 'react'
import { CalendarCheck2, Clock, MapPin } from 'lucide-react'

export default function Dashboard() {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    const load = async () => {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${base}/bookings?status=confirmed`)
      const data = await res.json()
      setBookings(data.results || [])
    }
    load().catch(() => {})
  }, [])

  return (
    <section className="bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Upcoming Bookings</h2>
          <a href="/book" className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#3F51B5] text-white font-semibold shadow-sm">
            <CalendarCheck2 size={18}/> Book New Hall
          </a>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map(b => (
            <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-900">{b.event_name}</div>
                <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-700">Confirmed</span>
              </div>
              <div className="mt-3 text-sm text-slate-600 flex items-center gap-2"><MapPin size={16}/> {b.hall_name || 'Hall'}</div>
              <div className="mt-1 text-sm text-slate-600 flex items-center gap-2"><Clock size={16}/> {b.date} • {b.start} - {b.end}</div>
            </div>
          ))}
          {bookings.length===0 && (
            <div className="col-span-full text-slate-500">No confirmed bookings yet.</div>
          )}
        </div>
      </div>
    </section>
  )
}
