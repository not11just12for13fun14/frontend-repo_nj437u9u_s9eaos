import { useEffect, useState } from 'react'

export default function Approvals() {
  const [role, setRole] = useState('HOD')
  const [items, setItems] = useState([])
  const [message, setMessage] = useState(null)
  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    const res = await fetch(`${base}/approvals/queue?role=${role}`)
    const data = await res.json()
    setItems(data.results || [])
  }

  useEffect(()=>{ load().catch(()=>{}) }, [role])

  const act = async (id, action) => {
    const comment = action==='reject' ? prompt('Reason/Comment (required):') : ''
    if (action==='reject' && !comment) return
    const res = await fetch(`${base}/bookings/${id}/${action==='approve'?'approve':'reject'}`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ by_name: role, role, comment })
    })
    if (!res.ok) {
      const e = await res.json().catch(()=>({detail:'error'}))
      setMessage({type:'error', text: e.detail || 'Action failed'})
    } else {
      setMessage({type:'success', text: 'Updated'})
      load().catch(()=>{})
    }
  }

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Approval Queue</h2>
          <select value={role} onChange={e=>setRole(e.target.value)} className="ml-auto rounded-2xl border px-3 py-2">
            <option>HOD</option>
            <option>Admin</option>
          </select>
        </div>
        {message && (
          <div className={`mb-3 rounded-2xl p-3 ${message.type==='success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{message.text}</div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(b => (
            <div key={b.id} className="rounded-2xl border p-4 bg-white shadow-sm">
              <div className="font-semibold text-slate-900">{b.event_name}</div>
              <div className="text-sm text-slate-600">{b.requestor_name} • {b.date} • {b.start}-{b.end}</div>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={()=>act(b.id,'approve')} className="px-3 py-1.5 rounded-2xl bg-emerald-600 text-white">Approve</button>
                <button onClick={()=>act(b.id,'reject')} className="px-3 py-1.5 rounded-2xl bg-red-600 text-white">Reject</button>
              </div>
            </div>
          ))}
          {items.length===0 && (
            <div className="text-slate-500">No pending items for this role.</div>
          )}
        </div>
      </div>
    </section>
  )
}
