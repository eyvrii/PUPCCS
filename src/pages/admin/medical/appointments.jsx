import { useEffect, useState } from 'react'
import AdminSidebar from '../../../components/AdminSidebar.jsx'
import { supabase } from '../../../lib/supabase.js'
import { CLINIC_CONCERNS } from '../../../lib/constants.js'
import { Search, Filter, X, Calendar, Clock, User, Phone, Mail, BookOpen } from 'lucide-react'

const STATUS_OPTIONS = ['all', 'pending', 'approved', 'completed', 'rejected', 'cancelled']
const STATUS_STYLE = {
  pending:   'bg-yellow-100 text-yellow-800',
  approved:  'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  rejected:  'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-600',
}

export default function MedicalAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected]         = useState(null)
  const [updating, setUpdating]         = useState(false)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => { fetchAppointments() }, [])

  const fetchAppointments = async () => {
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .in('concern_type', CLINIC_CONCERNS.medical)
      .order('preferred_date', { ascending: false })
    if (data) setAppointments(data)
    setLoading(false)
  }

  const updateStatus = async (id, newStatus) => {
    setUpdating(true)
    await supabase.from('appointments').update({ status: newStatus }).eq('id', id)

    if (newStatus === 'approved') {
      const appt = appointments.find(a => a.id === id)
      await supabase.functions.invoke('send-approval-email', {
        body: {
          email:          appt.email,
          full_name:      appt.full_name,
          preferred_date: appt.preferred_date,
          preferred_time: appt.preferred_time,
          concern_type:   appt.concern_type,
        }
      })
    }

    await fetchAppointments()
    setSelected(prev => prev?.id === id ? { ...prev, status: newStatus } : prev)
    setUpdating(false)
  }

  const todayAppts   = appointments.filter(a => a.preferred_date === today)
  const pendingCount = appointments.filter(a => a.status === 'pending').length
  const filtered = appointments.filter(a => {
    const matchSearch = [a.full_name, a.id_number, a.email]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">🩺 Medical Appointments</h1>
          <p className="text-gray-500 text-sm mt-1">Manage medical clinic appointment requests</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{todayAppts.length}</p>
              <p className="text-xs text-gray-500">Today's Appointments</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
              <p className="text-xs text-gray-500">Pending Approval</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{appointments.length}</p>
              <p className="text-xs text-gray-500">Total Medical Appointments</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, ID, or email..."
              className="input-field pl-9" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-auto">
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-5">
          <div className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto ${selected ? 'flex-1' : 'w-full'}`}>
            {loading ? (
              <p className="text-sm text-gray-400 p-6">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-gray-400 p-6">No medical appointments found.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 border-b bg-gray-50/50">
                    <th className="px-5 py-3 font-medium">Patient</th>
                    <th className="px-5 py-3 font-medium">Date & Time</th>
                    <th className="px-5 py-3 font-medium">Concern</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(a => (
                    <tr key={a.id} onClick={() => setSelected(selected?.id === a.id ? null : a)}
                      className={`cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id === a.id ? 'bg-maroon/5' : ''}`}>
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-800">{a.full_name}</p>
                        <p className="text-xs text-gray-400">{a.id_number}</p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-gray-700">{a.preferred_date}</p>
                        <p className="text-xs text-gray-400">{a.preferred_time}</p>
                      </td>
                      <td className="px-5 py-3 capitalize text-gray-500">
                        {a.concern_type?.replace(/_/g, ' ')}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[a.status] || 'bg-gray-100 text-gray-600'}`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {selected && (
            <div className="w-72 shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm p-5 self-start">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 text-sm">Appointment Details</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2.5 text-sm mb-4">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">{selected.full_name}</p>
                    <p className="text-xs text-gray-400">{selected.id_number}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <p className="text-gray-600 text-xs">{selected.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <p className="text-gray-600 text-xs">{selected.contact_number}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                  <p className="text-gray-600 text-xs">{selected.preferred_date} at {selected.preferred_time}</p>
                </div>
              </div>
              <div className="border-t pt-3 mb-4 space-y-1.5 text-xs text-gray-500">
                {[
                  ['Type', selected.type],
                  ['Department', selected.department],
                  ['Year Level', selected.year_level || '—'],
                  ['Concern', selected.concern_type?.replace(/_/g, ' ')],
                ].map(([label, val]) => (
                  <div key={label} className="flex gap-2">
                    <span className="text-gray-400 w-20 shrink-0">{label}</span>
                    <span className="text-gray-700 font-medium capitalize">{val}</span>
                  </div>
                ))}
                {selected.concern_description && (
                  <div className="pt-2">
                    <p className="text-gray-400 mb-1">Description</p>
                    <p className="text-gray-600 leading-relaxed">{selected.concern_description}</p>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[selected.status]}`}>
                  {selected.status}
                </span>
              </div>
              <div className="space-y-2">
                {selected.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(selected.id, 'approved')} disabled={updating}
                      className="w-full py-2 text-xs font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60">
                      ✓ Approve
                    </button>
                    <button onClick={() => updateStatus(selected.id, 'rejected')} disabled={updating}
                      className="w-full py-2 text-xs font-semibold border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-60">
                      ✕ Reject
                    </button>
                  </>
                )}
                {selected.status === 'approved' && (
                  <button onClick={() => updateStatus(selected.id, 'completed')} disabled={updating}
                    className="w-full py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60">
                    ✓ Mark as Completed
                  </button>
                )}
                {selected.status === 'completed' && (
                  <p className="text-xs text-center text-gray-400">This appointment is completed.</p>
                )}
                {selected.status === 'rejected' && (
                  <button onClick={() => updateStatus(selected.id, 'pending')} disabled={updating}
                    className="w-full py-2 text-xs font-semibold border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60">
                    ↩ Move back to Pending
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}