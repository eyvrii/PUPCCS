import { useEffect, useState } from 'react'
import { useAuth } from '../../context/useAuth'
import { supabase } from '../../lib/supabase.js'
import { CLINIC_CONCERNS } from '../../lib/constants.js'
import { Search, ChevronDown, ChevronUp, User, Mail, Phone, Building, Calendar } from 'lucide-react'

const STATUS_STYLE = {
  pending:   'bg-yellow-100 text-yellow-800',
  approved:  'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  rejected:  'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-600',
}

export default function Patients() {
  const { role }                        = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [expanded, setExpanded]         = useState(null)
  const [selected, setSelected]         = useState(null)

  useEffect(() => { fetchData() }, [role])

  const fetchData = async () => {
    let query = supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false })

    if (role === 'medical') query = query.in('concern_type', CLINIC_CONCERNS.medical)
    else if (role === 'dental') query = query.in('concern_type', CLINIC_CONCERNS.dental)
    else if (role === 'mental') query = query.in('concern_type', CLINIC_CONCERNS.mental)

    const { data } = await query
    if (data) setAppointments(data)
    setLoading(false)
  }

  const grouped = appointments.reduce((acc, a) => {
    const key = a.id_number
    if (!acc[key]) {
      acc[key] = {
        id_number:      a.id_number,
        full_name:      a.full_name,
        email:          a.email,
        contact_number: a.contact_number,
        type:           a.type,
        department:     a.department,
        year_level:     a.year_level,
        visits: [],
      }
    }
    acc[key].visits.push(a)
    return acc
  }, {})

  const patients = Object.values(grouped).filter(p =>
    p.full_name.toLowerCase().includes(search.toLowerCase()) ||
    p.id_number.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  )

  const totalPatients  = Object.keys(grouped).length
  const totalVisits    = appointments.length
  const repeatPatients = Object.values(grouped).filter(p => p.visits.length > 1).length

  const concernCount = appointments.reduce((acc, a) => {
    acc[a.concern_type] = (acc[a.concern_type] || 0) + 1
    return acc
  }, {})
  const topConcern = Object.entries(concernCount).sort((a, b) => b[1] - a[1])[0]?.[0]?.replace(/_/g, ' ') || '—'

  const roleLabel = {
    admin:   'All Clinics',
    medical: '🩺 Medical Clinic',
    dental:  '🦷 Dental Clinic',
    mental:  '🧠 Mental Health Clinic',
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
        <p className="text-gray-500 text-sm mt-1">
          Appointment history — {roleLabel[role] || 'Clinic'}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Patients',   value: totalPatients,  color: 'bg-maroon/10 text-maroon'    },
          { label: 'Total Visits',     value: totalVisits,    color: 'bg-blue-50 text-blue-600'    },
          { label: 'Repeat Patients',  value: repeatPatients, color: 'bg-purple-50 text-purple-600'},
          { label: 'Top Concern',      value: topConcern,     color: 'bg-green-50 text-green-600', small: true },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit mb-2 ${s.color}`}>
              {s.label}
            </p>
            <p className={`font-bold text-gray-800 capitalize ${s.small ? 'text-base' : 'text-2xl'}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-5">
        <div className="flex-1">
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, ID, or email..."
              className="input-field pl-9"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <p className="text-sm text-gray-400 p-6">Loading...</p>
            ) : patients.length === 0 ? (
              <p className="text-sm text-gray-400 p-6">No patients found.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {patients.map(p => (
                  <div key={p.id_number}>
                    <div className="flex items-center px-5 py-4 hover:bg-gray-50 transition-colors">
                      <div
                        onClick={() => setSelected(selected?.id_number === p.id_number ? null : p)}
                        className="w-9 h-9 rounded-full bg-maroon/10 flex items-center justify-center text-maroon font-bold text-sm shrink-0 cursor-pointer"
                      >
                        {p.full_name.charAt(0)}
                      </div>
                      <div
                        className="flex-1 ml-3 cursor-pointer"
                        onClick={() => setSelected(selected?.id_number === p.id_number ? null : p)}
                      >
                        <p className="font-semibold text-gray-800 text-sm">{p.full_name}</p>
                        <p className="text-xs text-gray-400">
                          {p.id_number} · {p.department} · <span className="capitalize">{p.type}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {p.visits.length} visit{p.visits.length !== 1 ? 's' : ''}
                        </span>
                        <button
                          onClick={() => setExpanded(expanded === p.id_number ? null : p.id_number)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {expanded === p.id_number
                            ? <ChevronUp className="w-4 h-4" />
                            : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {expanded === p.id_number && (
                      <div className="bg-gray-50/50 px-5 pb-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 pt-3">
                          Appointment History
                        </p>
                        <div className="space-y-2">
                          {p.visits.map(v => (
                            <div key={v.id} className="bg-white rounded-lg px-4 py-3 border border-gray-100 flex items-start justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-700 capitalize">
                                  {v.concern_type?.replace(/_/g, ' ')}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {v.preferred_date} · {v.preferred_time}
                                </p>
                                {v.concern_description && (
                                  <p className="text-xs text-gray-500 mt-1 italic">"{v.concern_description}"</p>
                                )}
                              </div>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ml-3 ${STATUS_STYLE[v.status]}`}>
                                {v.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Patient Profile Card */}
        {selected && (
          <div className="w-64 shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm p-5 self-start">
            <div className="text-center mb-4">
              <div className="w-14 h-14 rounded-full bg-maroon/10 flex items-center justify-center text-maroon font-bold text-xl mx-auto mb-2">
                {selected.full_name.charAt(0)}
              </div>
              <p className="font-bold text-gray-800 text-sm">{selected.full_name}</p>
              <p className="text-xs text-gray-400 capitalize">{selected.type} · {selected.department}</p>
            </div>

            <div className="space-y-2.5 text-xs border-t pt-4">
              <div className="flex items-center gap-2 text-gray-500">
                <User className="w-3.5 h-3.5 text-gray-400" />
                {selected.id_number}
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                {selected.email}
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                {selected.contact_number}
              </div>
              {selected.year_level && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Building className="w-3.5 h-3.5 text-gray-400" />
                  {selected.year_level}
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {selected.visits.length} total visit{selected.visits.length !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-xs font-semibold text-gray-400 mb-2">Last Visit</p>
              <p className="text-xs text-gray-700 font-medium capitalize">
                {selected.visits[0]?.concern_type?.replace(/_/g, ' ')}
              </p>
              <p className="text-xs text-gray-400">{selected.visits[0]?.preferred_date}</p>
              <span className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[selected.visits[0]?.status]}`}>
                {selected.visits[0]?.status}
              </span>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-4 w-full text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}