import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar.jsx'
import { supabase } from '../../lib/supabase.js'
import { CONCERN_TYPES, TIME_SLOTS, DEPARTMENTS } from '../../lib/constants.js'
import { CheckCircle, ArrowLeft } from 'lucide-react'

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

export default function AppointmentForm() {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: err } = await supabase.from('appointments').insert([form])

    setLoading(false)
    if (err) {
      setError('Failed to submit appointment. Please try again.')
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-lg mx-auto px-6 py-24 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Submitted!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your appointment request has been received. We'll send a confirmation to <strong>{form.email}</strong> within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { setSuccess(false); setForm(initialForm) }}
              className="btn-outline text-sm"
            >
              Book Another
            </button>
            <Link to="/" className="btn-primary text-sm">
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

      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-maroon mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="card">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-maroon">Book an Appointment</h1>
            <p className="text-gray-500 text-sm mt-1">Fill out the form below to schedule your clinic visit.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-1 border-b">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input name="full_name" value={form.full_name} onChange={handleChange} required className="input-field" placeholder="Juan dela Cruz" />
                </div>
                <div>
                  <label className="label">ID Number *</label>
                  <input name="id_number" value={form.id_number} onChange={handleChange} required className="input-field" placeholder="2021-00001-MN-0" />
                </div>
                <div>
                  <label className="label">Email Address *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" placeholder="juan@pup.edu.ph" />
                </div>
                <div>
                  <label className="label">Contact Number *</label>
                  <input name="contact_number" value={form.contact_number} onChange={handleChange} required className="input-field" placeholder="09XXXXXXXXX" />
                </div>
              </div>
            </div>

            {/* Classification */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-1 border-b">Classification</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Type *</label>
                  <select name="type" value={form.type} onChange={handleChange} required className="input-field">
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
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
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                      <option>5th Year</option>
                      <option>Graduate</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Schedule */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-1 border-b">Preferred Schedule</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Preferred Date *</label>
                  <input name="preferred_date" type="date" value={form.preferred_date} onChange={handleChange} required className="input-field" min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label className="label">Preferred Time *</label>
                  <select name="preferred_time" value={form.preferred_time} onChange={handleChange} required className="input-field">
                    <option value="">Select time slot</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Concern */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-1 border-b">Health Concern</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Type of Concern *</label>
                  <select name="concern_type" value={form.concern_type} onChange={handleChange} required className="input-field">
                    <option value="">Select concern</option>
                    {CONCERN_TYPES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Describe your concern</label>
                  <textarea name="concern_description" value={form.concern_description} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="Briefly describe your symptoms or reason for visit..." />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Submitting...' : 'Submit Appointment Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
