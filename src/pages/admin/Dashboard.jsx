import { useEffect, useState } from 'react'
import { useAuth } from '../../context/useAuth'
import { supabase } from '../../lib/supabase.js'
import { CLINIC_CONCERNS } from '../../lib/constants.js'
import { ClipboardList, Clock, CheckCircle, XCircle, Users } from 'lucide-react'

export default function Dashboard() {
  const { role }            = useAuth()
  const [stats, setStats]   = useState({ total: 0, pending: 0, approved: 0, completed: 0, rejected: 0 })
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

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

    if (data) {
      setStats({
        total:     data.length,
        pending:   data.filter(a => a.status === 'pending').length,
        approved:  data.filter(a => a.status === 'approved').length,
        completed: data.filter(a => a.status === 'completed').length,
        rejected:  data.filter(a => a.status === 'rejected').length,
      })
      setRecent(data.slice(0, 5))
    }
    setLoading(false)
  }

  const roleLabel = {
    admin:   'All Clinics',
    medical: '🩺 Medical Clinic',
    dental:  '🦷 Dental Clinic',
    mental:  '🧠 Mental Health Clinic',
  }

  const statCards = [
    { label: 'Total Appointments', value: stats.total,     icon: ClipboardList, bg: 'bg-blue-50',   color: 'text-blue-600'   },
    { label: 'Pending',            value: stats.pending,   icon: Clock,         bg: 'bg-yellow-50', color: 'text-yellow-600' },
    { label: 'Approved',           value: stats.approved,  icon: CheckCircle,   bg: 'bg-green-50',  color: 'text-green-600'  },
    { label: 'Completed',          value: stats.completed, icon: Users,         bg: 'bg-purple-50', color: 'text-purple-600' },
    { label: 'Rejected',           value: stats.rejected,  icon: XCircle,       bg: 'bg-red-50',    color: 'text-red-600'    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Overview — {roleLabel[role] || 'Clinic'}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.bg}`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{loading ? '—' : s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Recent Appointments</h2>
        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : recent.length === 0 ? (
          <p className="text-sm text-gray-400">No appointments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Concern</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50/50">
                    <td className="py-3 font-medium text-gray-800">{a.full_name}</td>
                    <td className="py-3 text-gray-500">{a.preferred_date}</td>
                    <td className="py-3 text-gray-500 capitalize">
                      {a.concern_type?.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3">
                      <span className={`badge-${a.status}`}>{a.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}