import { useEffect, useState } from 'react'

export default function MyBookings() {
  const [status, setStatus] = useState('')
  const [items, setItems] = useState([])
  const [active, setActive] = useState(null)

  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    const res = await fetch(`${base}/bookings${status?`?status=${status}`:''}`)
    const data = await res.json()
    setItems(data.results || [])
    if (data.results && data.results.length) setActive(data.results[0])
  }

  useEffect(()=>{ load().catch(()=>{}) }, [status])

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="flex gap-2 mb-3">
            {['','pending','confirmed','rejected','cancelled'].map(s => (
              <button key={s||'all'} onClick={()=>setStatus(s)} className={`px-3 py-1.5 rounded-2xl border text-sm ${status===s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white'}`}>
                {s? s[0].toUpperCase()+s.slice(1):'All'}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {items.map(b => (
              <button key={b.id} onClick={()=>setActive(b)} className={`w-full text-left rounded-2xl border p-3 ${active?.id===b.id ? 'border-indigo-600 bg-indigo-50' : 'bg-white'}`}>
                <div className="font-semibold text-slate-900">{b.event_name}</div>
                <div className="text-sm text-slate-600">{b.date} • {b.start}-{b.end}</div>
                <div className="text-xs mt-1"><span className={`px-2 py-0.5 rounded-full ${b.status==='confirmed'?'bg-emerald-100 text-emerald-700':b.status==='pending'?'bg-amber-100 text-amber-700':b.status==='rejected'?'bg-red-100 text-red-700':'bg-slate-100 text-slate-700'}`}>{b.status}</span></div>
              </button>
            ))}
            {items.length===0 && <div className="text-slate-500">No bookings.</div>}
          </div>
        </div>
        <div className="lg:col-span-2">
          {active ? (
            <div className="rounded-2xl border p-4 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900 text-lg">{active.event_name}</div>
                  <div className="text-sm text-slate-600">{active.date} • {active.start}-{active.end}</div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${active.status==='confirmed'?'bg-emerald-100 text-emerald-700':active.status==='pending'?'bg-amber-100 text-amber-700':active.status==='rejected'?'bg-red-100 text-red-700':'bg-slate-100 text-slate-700'}`}>{active.status}</span>
              </div>
              <div className="mt-4">
                <div className="font-semibold text-slate-900">Audit Trail</div>
                <div className="mt-2 space-y-2">
                  {active.audit_trail?.map((t,i) => (
                    <div key={i} className="rounded-xl border p-3 bg-slate-50">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-800">{t.by_name} • {t.role}</div>
                        <div className="text-xs">{new Date(t.at).toLocaleString()}</div>
                      </div>
                      <div className="text-xs mt-1"><span className={`px-2 py-0.5 rounded-full ${t.action==='approved'?'bg-emerald-100 text-emerald-700':t.action==='rejected'?'bg-red-100 text-red-700':'bg-slate-100 text-slate-700'}`}>{t.action}</span></div>
                      {t.comment && <div className="text-sm text-slate-700 mt-1">{t.comment}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-500">Select a booking to view details.</div>
          )}
        </div>
      </div>
    </section>
  )
}
