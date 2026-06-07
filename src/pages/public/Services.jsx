import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar.jsx'
import { ArrowLeft, Heart, Stethoscope, Brain, Clock, MapPin } from 'lucide-react'

const servicesList = [
  {
    icon: Stethoscope,
    title: 'Medical Consultation',
    desc: 'General health concerns, physical examinations, first aid, and medical certificates for PUP community members.',
    hours: 'Mon–Fri, 8:00 AM – 5:00 PM',
    color: 'bg-red-50 text-red-700',
  },
  {
    icon: '🦷',
    title: 'Dental Services',
    desc: 'Oral health check-ups, dental consultations, tooth extraction, and basic dental procedures.',
    hours: 'Mon–Fri, 8:00 AM – 12:00 PM',
    color: 'bg-blue-50 text-blue-700',
  },
  {
    icon: Brain,
    title: 'Mental Health',
    desc: 'Confidential counseling and psychological support services for students, faculty, and staff.',
    hours: 'Mon–Fri, 1:00 PM – 5:00 PM',
    color: 'bg-purple-50 text-purple-700',
  },
  {
    icon: Heart,
    title: 'First Aid & Emergency',
    desc: 'Immediate first aid assistance and emergency response for accidents and sudden illnesses on campus.',
    hours: 'Mon–Fri, 8:00 AM – 5:00 PM',
    color: 'bg-orange-50 text-orange-700',
  },
  {
    icon: '💊',
    title: 'Medicines & Supplies',
    desc: 'Free basic medicines and medical supplies provided to all valid PUP ID holders.',
    hours: 'Mon–Fri, 8:00 AM – 5:00 PM',
    color: 'bg-yellow-50 text-yellow-700',
  },
]

export default function Services() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section
        className="relative py-14 px-6"
        style={{ background: 'linear-gradient(135deg, #6b0000 0%, #8B0000 60%, #a50000 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-0.5 bg-gold" />
            <span className="text-gold text-xs font-semibold tracking-widest uppercase">What We Offer</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-2">Our Services</h1>
          <p className="text-white/60 text-sm max-w-lg">
            The PUP Clinic provides comprehensive healthcare services — free for all valid PUP ID holders.
          </p>
        </div>
      </section>

      {/* Services Grid */}
<div className="max-w-5xl mx-auto py-14 px-6">
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
    {servicesList.slice(0, 3).map((s, i) => (
      <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all hover:-translate-y-0.5 duration-200">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4 ${s.color}`}>
          {typeof s.icon === 'string' ? s.icon : <s.icon className="w-5 h-5" />}
        </div>
        <h3 className="font-bold text-gray-800 text-base mb-2">{s.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.desc}</p>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-3 border-t border-gray-50">
          <Clock className="w-3.5 h-3.5" />{s.hours}
        </div>
      </div>
    ))}
  </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
    {servicesList.slice(3).map((s, i) => (
      <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all hover:-translate-y-0.5 duration-200">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4 ${s.color}`}>
          {typeof s.icon === 'string' ? s.icon : <s.icon className="w-5 h-5" />}
        </div>
        <h3 className="font-bold text-gray-800 text-base mb-2">{s.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.desc}</p>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-3 border-t border-gray-50">
          <Clock className="w-3.5 h-3.5" />{s.hours}
        </div>
      </div>
    ))}
  </div>
</div>

      {/* CTA */}
      <section className="bg-maroon py-7 px-6 text-center">
        <h2 className="text-xl font-bold text-white mb-1">Need a consultation?</h2>
        <p className="text-white/60 text-sm mb-4">Book an appointment online and we'll confirm your schedule within 24 hours.</p>
      </section>

      {/* Footer */}
      <footer className="bg-maroon-dark text-white/40 py-5 text-center text-xs">
        <p>© {new Date().getFullYear()} PUP Clinic — Polytechnic University of the Philippines · Sta. Mesa, Manila</p>
      </footer>
    </div>
  )
}