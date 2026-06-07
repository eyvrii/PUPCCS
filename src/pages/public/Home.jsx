import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar.jsx'
import { CalendarDays, Clock, Heart, Stethoscope, MapPin, Users, CreditCard } from 'lucide-react'

const infoCards = [
  { icon: Clock, label: 'Clinic Hours', value: 'Monday – Friday, 8:00 AM – 5:00 PM' },
  { icon: Heart, label: 'Free Consultations', value: 'For all valid PUP ID holders' },
  { icon: Stethoscope, label: 'Services Available', value: 'General medicine, dental & more' },
  { icon: MapPin, label: 'Location', value: 'PUP Main Campus, Sta. Mesa, Manila' },
]

const badges = [
  { icon: Users, label: 'Students & Faculty' },
  { icon: CreditCard, label: 'Valid PUP ID Required' },
  { icon: Heart, label: 'Free Consultations' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative min-h-[580px] flex items-center"
        style={{ background: 'linear-gradient(135deg, #6b0000 0%, #8B0000 40%, #a50000 100%)' }}
      >
        {/* Texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-0.5 bg-gold" />
                <span className="text-gold text-xs font-semibold tracking-widest uppercase">
                  Health Services Office
                </span>
              </div>

              <h1 className="text-5xl font-black text-white leading-tight mb-2">
                Your Health,
              </h1>
              <h1 className="text-5xl font-black leading-tight mb-5 italic" style={{ color: '#FFD700' }}>
                Our Priority.
              </h1>

              <p className="text-white/65 text-sm leading-relaxed mb-7 max-w-sm">
                Schedule your clinic appointment online — accessible to all PUP students,
                faculty, and staff of the Polytechnic University of the Philippines.
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-7">
                {badges.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-xs"
                    style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
                  >
                    <b.icon className="w-3.5 h-3.5 text-gold" />
                    {b.label}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                to="/appointment"
                className="inline-flex items-center gap-2 bg-gold text-maroon font-bold px-5 py-2.5 rounded-lg hover:bg-gold-dark transition-colors text-sm shadow-lg"
              >
                <CalendarDays className="w-4 h-4" />
                Book an Appointment
              </Link>
            </div>

            {/* Right — Info Cards */}
            <div className="flex flex-col gap-3">
              {infoCards.map((card, i) => (
                <div
                  key={i}
                  className="rounded-xl px-4 py-3 flex items-center gap-3"
                  style={{ backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'rgba(255,215,0,0.15)' }}
                  >
                    <card.icon className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-white/45 text-xs">{card.label}</p>
                    <p className="text-white font-semibold text-sm">{card.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-maroon-dark text-white/40 py-5 text-center text-xs">
        <p>© {new Date().getFullYear()} PUP Clinic — Polytechnic University of the Philippines · Sta. Mesa, Manila</p>
      </footer>
    </div>
  )
}