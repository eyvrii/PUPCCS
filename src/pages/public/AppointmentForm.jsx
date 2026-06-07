import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar.jsx'
import { supabase } from '../../lib/supabase.js'
import { CONCERN_TYPES, TIME_SLOTS, DEPARTMENTS } from '../../lib/constants.js'
import { CheckCircle, ArrowLeft, User, Mail, Phone, CreditCard, Building, Calendar, Clock, Heart } from 'lucide-react'

const initialForm = {
  full_name: '',
  id_number: '',
  email: '',
  contact_number: '',
  type: 'student',
  department: '',
  year_level: '',
  preferred_date: '',
  preferred_time: '',
  concern_type: '',
  concern_description: '',
}

const steps = ['Personal Info', 'Classification', 'Schedule', 'Concern']

export default function AppointmentForm() {
  const [form, setForm]       = useState(initialForm)
  const [step, setStep]       = useState(0)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.from('appointments').insert([form])
    setLoading(false)
    if (err) setError('Failed to submit appointment. Please try again.')
    else setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-lg mx-auto px-6 py-24 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Submitted!</h2>
          <p className="text-gray-500 text-sm mb-2">
            Your request has been received. We'll send a confirmation to
          </p>
          <p className="font-semibold text-maroon mb-6">{form.email}</p>
          <p className="text-gray-400 text-xs mb-8">Please wait for our confirmation within 24 hours before visiting the clinic.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { setSuccess(false); setForm(initialForm); setStep(0) }}
              className="btn-outline text-sm px-6 py-2.5"
            >
              Book Another
            </button>
            <Link to="/" className="btn-primary text-sm px-6 py-2.5">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero bar */}
      <div
        className="py-8 px-6 text-white"
        style={{ background: 'linear-gradient(135deg, #6b0000 0%, #8B0000 60%, #a50000 100%)' }}
      >
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-2xl font-black mb-1">Book an Appointment</h1>
          <p className="text-white/60 text-sm">Fill out the form below to schedule your clinic visit.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < step ? 'bg-green-500 text-white' :
                  i === step ? 'bg-maroon text-white' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <p className={`text-xs mt-1 font-medium hidden sm:block ${i === step ? 'text-maroon' : 'text-gray-400'}`}>
                  {s}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 transition-all ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          {/* STEP 0 — Personal Info */}
          {step === 0 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-maroon/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-maroon" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 text-base">Personal Information</h2>
                  <p className="text-gray-400 text-xs">Enter your basic details</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input name="full_name" value={form.full_name} onChange={handleChange} required className="input-field pl-9" placeholder="Juan dela Cruz" />
                  </div>
                </div>
                <div>
                  <label className="label">ID Number *</label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input name="id_number" value={form.id_number} onChange={handleChange} required className="input-field pl-9" placeholder="2021-00001-MN-0" />
                  </div>
                </div>
                <div>
                  <label className="label">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field pl-9" placeholder="juan@pup.edu.ph" />
                  </div>
                </div>
                <div>
                  <label className="label">Contact Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input name="contact_number" value={form.contact_number} onChange={handleChange} required className="input-field pl-9" placeholder="09XXXXXXXXX" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1 — Classification */}
          {step === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Building className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 text-base">Classification</h2>
                  <p className="text-gray-400 text-xs">Tell us your affiliation</p>
                </div>
              </div>

              {/* Type selector */}
              <div className="mb-4">
                <label className="label">Type *</label>
                <div className="grid grid-cols-3 gap-2">
                  {['student', 'faculty', 'staff'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, type: t }))}
                      className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all capitalize ${
                        form.type === t
                          ? 'border-maroon bg-maroon text-white'
                          : 'border-gray-200 text-gray-500 hover:border-maroon/30'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Department / College *</label>
                  <select name="department" value={form.department} onChange={handleChange} required className="input-field">
                    <option value="">Select department</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                {form.type === 'student' && (
                  <div>
                    <label className="label">Year Level</label>
                    <select name="year_level" value={form.year_level} onChange={handleChange} className="input-field">
                      <option value="">Select year</option>
                      {['1st Year','2nd Year','3rd Year','4th Year','5th Year','Graduate'].map(y => (
                        <option key={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2 — Schedule */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 text-base">Preferred Schedule</h2>
                  <p className="text-gray-400 text-xs">Choose your preferred date and time</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Preferred Date *</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="preferred_date"
                      type="date"
                      value={form.preferred_date}
                      onChange={handleChange}
                      required
                      className="input-field pl-9"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Preferred Time *</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select name="preferred_time" value={form.preferred_time} onChange={handleChange} required className="input-field pl-9">
                      <option value="">Select time slot</option>
                      {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-blue-600 flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                Clinic hours are Monday to Friday, 8:00 AM – 5:00 PM only. Your preferred schedule is subject to availability.
              </div>
            </div>
          )}

          {/* STEP 3 — Concern */}
          {step === 3 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 text-base">Health Concern</h2>
                  <p className="text-gray-400 text-xs">Tell us about your concern</p>
                </div>
              </div>

              {/* Concern type pills */}
              <div className="mb-4">
                <label className="label">Type of Concern *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CONCERN_TYPES.map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, concern_type: c.value }))}
                      className={`py-2.5 px-3 rounded-xl text-sm font-medium border-2 transition-all text-left ${
                        form.concern_type === c.value
                          ? 'border-maroon bg-maroon/5 text-maroon'
                          : 'border-gray-200 text-gray-500 hover:border-maroon/30'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Describe your concern</label>
                <textarea
                  name="concern_description"
                  value={form.concern_description}
                  onChange={handleChange}
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Briefly describe your symptoms or reason for visit..."
                />
              </div>

              {/* Summary */}
              <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-500 space-y-1">
                <p className="font-semibold text-gray-700 mb-2 text-sm">Appointment Summary</p>
                <p><span className="text-gray-400">Name:</span> {form.full_name}</p>
                <p><span className="text-gray-400">ID:</span> {form.id_number}</p>
                <p><span className="text-gray-400">Date:</span> {form.preferred_date} at {form.preferred_time}</p>
                <p><span className="text-gray-400">Type:</span> <span className="capitalize">{form.type} · {form.department}</span></p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                className="btn-primary text-sm px-6 py-2.5"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !form.concern_type}
                className="btn-primary text-sm px-6 py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Appointment'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}