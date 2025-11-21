import { useEffect, useState } from 'react'
import { Calendar, Clock, Users, Projector, Tv, Volume2 } from 'lucide-react'

export default function Search() {
  const [date, setDate] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [capacity, setCapacity] = useState(20)
  const [equip, setEquip] = useState({ Projector: false, 'PA System': false, 'TV Display': false })
  const [results, setResults] = useState([])

  const toggle = (k) => setEquip(prev => ({...prev, [k]: !prev[k]}))

  const search = async () => {
    const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
    const payload = {
      date: date || undefined,
      start: start || undefined,
      end: end || undefined,
      min_capacity: capacity,
      equipment: Object.entries(equip).filter(([,v])=>v).map(([k])=>k)
    }
    const res = await fetch(`${base}/halls/search`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    const data = await res.json()
    setResults(data.results || [])
  }

  useEffect(()=>{ search().catch(()=>{}) },[])

  const statusPill = (s) => {
    const map = {
      free: 'bg-emerald-100 text-emerald-700',
      pending: 'bg-amber-100 text-amber-700',
      booked: 'bg-red-100 text-red-700'
    }
    return <span className={`px-2 py-0.5 rounded-full text-xs ${map[s]}`}>{s.charAt(0).toUpperCase()+s.slice(1)}</span>
  }

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Find a Hall</h2>

        <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border">
              <Calendar size={16} className="text-slate-500"/>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full outline-none text-sm"/>
            </label>
            <label className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border">
              <Clock size={16} className="text-slate-500"/>
              <input type="time" value={start} onChange={e=>setStart(e.target.value)} className="w-full outline-none text-sm"/>
            </label>
            <label className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border">
              <Clock size={16} className="text-slate-500"/>
              <input type="time" value={end} onChange={e=>setEnd(e.target.value)} className="w-full outline-none text-sm"/>
            </label>
            <label className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border">
              <Users size={16} className="text-slate-500"/>
              <input type="range" min={1} max={500} value={capacity} onChange={e=>setCapacity(parseInt(e.target.value))} className="w-full"/>
              <span className="text-sm text-slate-600">{capacity}+</span>
            </label>
          </div>
          <div className="flex items-center gap-4 mt-3 text-sm">
            {['Projector','PA System','TV Display'].map(k=> (
              <label key={k} className="inline-flex items-center gap-2">
                <input type="checkbox" checked={!!equip[k]} onChange={() => toggle(k)} />
                <span className="text-slate-700">{k}</span>
              </label>
            ))}
            <button onClick={search} className="ml-auto px-4 py-2 rounded-2xl bg-[#3F51B5] text-white font-semibold">Search</button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {results.map(r => (
            <div key={r.id} className="rounded-2xl border border-slate-200 p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-900">{r.name}</div>
                {statusPill(r.availability?.status || 'free')}
              </div>
              <div className="mt-2 text-sm text-slate-600">Capacity: {r.capacity}</div>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-600">
                {r.equipment?.map(e => (
                  <span key={e} className="px-2 py-0.5 rounded-full bg-slate-100">{e}</span>
                ))}
              </div>
              <a href={`/book?hall=${r.id}`} className="mt-4 inline-block px-4 py-2 rounded-2xl bg-indigo-600 text-white">Request Booking</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
