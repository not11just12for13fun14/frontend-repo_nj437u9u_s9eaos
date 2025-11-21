import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative bg-[#F5F5F5]">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Book campus halls with clarity and confidence</h1>
          <p className="mt-4 text-slate-600 text-lg">Sleek, minimalist workflow for requestors and approvers. Real-time availability. Transparent approvals.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/book" className="px-5 py-3 rounded-2xl bg-[#3F51B5] text-white font-semibold shadow hover:shadow-md transition-shadow">Book New Hall</a>
            <a href="/search" className="px-5 py-3 rounded-2xl bg-white text-slate-900 border border-slate-200 font-semibold hover:bg-slate-50">Check Availability</a>
          </div>
        </div>
        <div className="h-[320px] md:h-[420px] rounded-3xl overflow-hidden shadow-lg">
          <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 -bottom-24 h-48 bg-gradient-to-b from-transparent to-white"></div>
    </section>
  )
}
