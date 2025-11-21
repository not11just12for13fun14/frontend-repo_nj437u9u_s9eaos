import { useEffect, useMemo, useState } from 'react'

export default function BookingForm() {
  const params = new URLSearchParams(location.search)
  const preHall = params.get('hall')

  const [halls, setHalls] = useState([])
  const [form, setForm] = useState({
    hall_id: preHall || '',
    requestor_name: '',
    requestor_email: '',
    date: '',
    start: '',
    end: '',
    event_name: '',
    purpose: '',
    attendance: '',
    attachments: []
  })
  const [workflow] = useState(['HOD','Admin'])
  const [message, setMessage] = useState(null)

  const base = useMemo(()=> import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])

  useEffect(() => {
    const fetchHalls = async () => {
      const res = await fetch(`${base}/halls/search`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({}) })
      const data = await res.json()
      setHalls(data.results || [])
    }
    fetchHalls().catch(()=>{})
  }, [base])

  const onFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    setForm(prev => ({...prev, attachments: files.map(f => f.name)}))
  }

  const submit = async (e) => {
    e.preventDefault()
    setMessage(null)
    try {
      const payload = {
        ...form,
        attendance: form.attendance ? parseInt(form.attendance) : undefined,
      }
      const res = await fetch(`${base}/bookings`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      if (!res.ok) {
        const err = await res.json().catch(()=>({detail:'Error'}))
        throw new Error(err.detail || 'Submission failed')
      }
      const created = await res.json()
      setMessage({ type:'success', text:'Request submitted successfully.' })
      // redirect to My bookings
      setTimeout(()=> location.href = `/my?id=${created.id}`, 800)
    } catch (e) {
      setMessage({ type:'error', text: e.message })
    }
  }

  return (
    <section className="bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Booking Request</h2>
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-slate-700">Select Hall</span>
            <select required value={form.hall_id} onChange={e=>setForm({...form, hall_id:e.target.value})} className="mt-1 w-full rounded-2xl border px-3 py-2">
              <option value="" disabled>Select a hall</option>
              {halls.map(h => <option key={h.id} value={h.id}>{h.name} (cap {h.capacity})</option>)}
            </select>
          </label>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-slate-700">Date</span>
              <input type="date" required value={form.date} onChange={e=>setForm({...form, date:e.target.value})} className="mt-1 w-full rounded-2xl border px-3 py-2"/>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-slate-700">Start</span>
                <input type="time" required value={form.start} onChange={e=>setForm({...form, start:e.target.value})} className="mt-1 w-full rounded-2xl border px-3 py-2"/>
              </label>
              <label className="block">
                <span className="text-sm text-slate-700">End</span>
                <input type="time" required value={form.end} onChange={e=>setForm({...form, end:e.target.value})} className="mt-1 w-full rounded-2xl border px-3 py-2"/>
              </label>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-slate-700">Event Name</span>
              <input required value={form.event_name} onChange={e=>setForm({...form, event_name:e.target.value})} className="mt-1 w-full rounded-2xl border px-3 py-2" placeholder="e.g., Orientation"/>
            </label>
            <label className="block">
              <span className="text-sm text-slate-700">Purpose</span>
              <input value={form.purpose} onChange={e=>setForm({...form, purpose:e.target.value})} className="mt-1 w-full rounded-2xl border px-3 py-2" placeholder="brief purpose"/>
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-slate-700">Attendance</span>
              <input type="number" min={1} value={form.attendance} onChange={e=>setForm({...form, attendance:e.target.value})} className="mt-1 w-full rounded-2xl border px-3 py-2" placeholder="expected count"/>
            </label>
            <label className="block">
              <span className="text-sm text-slate-700">Attachments</span>
              <input type="file" multiple onChange={onFileChange} className="mt-1 w-full rounded-2xl border px-3 py-2"/>
              <p className="text-xs text-slate-500 mt-1">Names captured, mock upload.</p>
            </label>
          </div>

          <div className="rounded-2xl border p-4 bg-slate-50">
            <div className="font-semibold text-slate-900">Approval Workflow Preview</div>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
              {workflow.map((w,i) => (
                <div key={w} className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full bg-slate-200">{w}</span>
                  {i<workflow.length-1 && <span>→</span>}
                </div>
              ))}
            </div>
          </div>

          {message && (
            <div className={`rounded-2xl p-3 ${message.type==='success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{message.text}</div>
          )}

          <div className="flex items-center gap-3">
            <button className="px-5 py-3 rounded-2xl bg-[#3F51B5] text-white font-semibold">Submit Request</button>
            <a href="/search" className="px-5 py-3 rounded-2xl bg-white border font-semibold">Check Availability</a>
          </div>
        </form>
      </div>
    </section>
  )
}
