import { useEffect, useState } from 'react'
import AdminSidebar from '../../components/AdminSidebar.jsx'
import { supabase } from '../../lib/supabase.js'
import { Search, Filter } from 'lucide-react'

const STATUS_OPTIONS = ['all', 'pending', 'approved', 'completed', 'rejected', 'cancelled']

export default function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .order('preferred_date', { ascending: false })
    if (data) setAppointments(data)
    setLoading(false)
  }

  const updateStatus = async (id, newStatus) => {
    setUpdating(true)
    await supabase.from('appointments').update({ status: newStatus }).eq('id', id)
    await fetchAppointments()
    if (selected?.id === id) setSelected(prev => ({ ...prev, status: newStatus }))
    setUpdating(false)
  }

  const filtered = appointments.filter(a => {
    const matchSearch = a.full_name.toLowerCase().includes(search.toLowerCase()) ||
      a.id_number.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all clinic appointment requests</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, ID, or email..."
              className="input-field pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-auto">
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Table */}
          <div className={`card overflow-x-auto ${selected ? 'flex-1' : 'w-full'}`}>
            {loading ? (
              <p className="text-sm text-gray-400">Loading...</p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-gray-400">No appointments found.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 border-b">
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium">Date / Time</th>
                    <th className="pb-2 font-medium">Concern</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(a => (
                    <tr
                      key={a.id}
                      onClick={() => setSelected(selected?.id === a.id ? null : a)}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3">
                        <p className="font-medium text-gray-800">{a.full_name}</p>
                        <p className="text-xs text-gray-400">{a.id_number}</p>
                      </td>
                      <td className="py-3">
                        <p className="text-gray-700">{a.preferred_date}</p>
                        <p className="text-xs text-gray-400">{a.preferred_time}</p>
                      </td>
                      <td className="py-3 capitalize text-gray-500">{a.concern_type?.replace('_', ' ')}</td>
                      <td className="py-3">
                        <span className={`badge-${a.status}`}>{a.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-72 shrink-0 card self-start">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Details</h3>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
              </div>

              <div className="space-y-2 text-sm mb-5">
                {[
                  ['Name', selected.full_name],
                  ['ID', selected.id_number],
                  ['Email', selected.email],
                  ['Contact', selected.contact_number],
                  ['Type', selected.type],
                  ['Dept', selected.department],
                  ['Year', selected.year_level || '—'],
                  ['Date', selected.preferred_date],
                  ['Time', selected.preferred_time],
                  ['Concern', selected.concern_type?.replace('_', ' ')],
                ].map(([label, val]) => (
                  <div key={label} className="flex gap-2">
                    <span className="text-gray-400 w-16 shrink-0">{label}</span>
                    <span className="text-gray-700 font-medium capitalize">{val}</span>
                  </div>
                ))}
                {selected.concern_description && (
                  <div className="pt-2 border-t">
                    <p className="text-gray-400 text-xs mb-1">Description</p>
                    <p className="text-gray-700 text-xs">{selected.concern_description}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {selected.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateStatus(selected.id, 'approved')}
                      disabled={updating}
                      className="btn-primary w-full text-xs py-2"
                    >Approve</button>
                    <button
                      onClick={() => updateStatus(selected.id, 'rejected')}
                      disabled={updating}
                      className="w-full text-xs py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >Reject</button>
                  </>
                )}
                {selected.status === 'approved' && (
                  <button
                    onClick={() => updateStatus(selected.id, 'completed')}
                    disabled={updating}
                    className="btn-primary w-full text-xs py-2"
                  >Mark as Completed</button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
