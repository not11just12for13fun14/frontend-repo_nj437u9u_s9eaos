import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Dashboard from './components/Dashboard'
import Search from './components/Search'
import BookingForm from './components/BookingForm'
import MyBookings from './components/MyBookings'
import Approvals from './components/Approvals'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] text-slate-900">
      <Navbar notifications={3} />
      <Routes>
        <Route path="/" element={<>
          <Hero />
          <Dashboard />
        </>} />
        <Route path="/search" element={<Search />} />
        <Route path="/book" element={<BookingForm />} />
        <Route path="/my" element={<MyBookings />} />
        <Route path="/approvals" element={<Approvals />} />
      </Routes>

      <a href="/book" className="fixed bottom-6 right-6 px-5 py-3 rounded-full shadow-lg bg-[#3F51B5] text-white font-semibold">Book New Hall</a>
    </div>
  )
}

export default App
