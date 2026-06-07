import { useEffect, useState } from 'react'
import AdminSidebar from '../../components/AdminSidebar.jsx'
import { supabase } from '../../lib/supabase.js'
import { ChevronLeft, ChevronRight, Bell, Clock, Calendar as CalIcon, CheckCircle, AlertCircle } from 'lucide-react'

const STATUS_STYLE = {
  pending:   'bg-yellow-100 text-yellow-800',
  approved:  'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  rejected:  'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-600',
}

const STATUS_DOT = {
  pending:   'bg-yellow-400',
  approved:  'bg-green-400',
  completed: 'bg-blue-400',
  rejected:  'bg-red-400',
  cancelled: 'bg-gray-400',
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export default function Calendar() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading]           = useState(true)
  const [currentDate, setCurrentDate]   = useState(new Date())
  const [selectedDay, setSelectedDay]   = useState(null)

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const { data } = await supabase.from('appointments').select('*').order('preferred_date')
    if (data) setAppointments(data)
    setLoading(false)
  }

  const year  = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const getApptForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return appointments.filter(a => a.preferred_date === dateStr)
  }

  // Notifications — today + next 3 days pending/approved
  const upcoming = appointments.filter(a => {
    const d = new Date(a.preferred_date)
    const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24))
    return diff >= 0 && diff <= 3 && ['pending', 'approved'].includes(a.status)
  }).sort((a, b) => new Date(a.preferred_date) - new Date(b.preferred_date))

  const todayAppts   = appointments.filter(a => a.preferred_date === todayStr)
  const pendingAppts = appointments.filter(a => a.status === 'pending')

  const selectedAppts = selectedDay ? getApptForDay(selectedDay) : []
  const selectedDateStr = selectedDay
    ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
    : null

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage appointments by date</p>
        </div>

        {/* Notification Bar */}
        {upcoming.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <Bell className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">
                {upcoming.length} upcoming appointment{upcoming.length !== 1 ? 's' : ''} in the next 3 days
              </p>
              <div className="flex flex-wrap gap-2">
                {upcoming.map(a => (
                  <span key={a.id} className="text-xs bg-white border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full">
                    {a.full_name} · {a.preferred_date} {a.preferred_time}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-maroon/10 flex items-center justify-center">
              <CalIcon className="w-4 h-4 text-maroon" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{todayAppts.length}</p>
              <p className="text-xs text-gray-500">Today's Appointments</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{pendingAppts.length}</p>
              <p className="text-xs text-gray-500">Pending This Month</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">
                {appointments.filter(a => {
                  const d = a.preferred_date
                  return d?.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`) && a.status === 'approved'
                }).length}
              </p>
              <p className="text-xs text-gray-500">Approved This Month</p>
            </div>
          </div>
        </div>

        <div className="flex gap-5">
          {/* Calendar */}
          <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-5">
              <button
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
              <h2 className="font-bold text-gray-800">{MONTHS[month]} {year}</h2>
              <button
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map(d => (
                <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const dayAppts  = getApptForDay(day)
                const dateStr   = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const isToday   = dateStr === todayStr
                const isSelected = selectedDay === day

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    className={`relative flex flex-col items-center pt-1.5 pb-1 rounded-xl text-sm transition-all min-h-[52px] ${
                      isSelected ? 'bg-maroon text-white shadow-sm' :
                      isToday   ? 'bg-gold/20 text-maroon font-bold' :
                      'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-xs font-medium leading-none">{day}</span>
                    {dayAppts.length > 0 && (
                      <div className="flex gap-0.5 mt-1.5 flex-wrap justify-center px-1">
                        {dayAppts.slice(0, 4).map((a, i) => (
                          <span
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/70' : STATUS_DOT[a.status] || 'bg-gray-400'}`}
                          />
                        ))}
                        {dayAppts.length > 4 && (
                          <span className={`text-[9px] leading-none ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                            +{dayAppts.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-5 pt-4 border-t flex flex-wrap gap-3">
              {Object.entries(STATUS_DOT).map(([status, color]) => (
                <div key={status} className="flex items-center gap-1.5 text-xs text-gray-500 capitalize">
                  <span className={`w-2 h-2 rounded-full ${color}`} />
                  {status}
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-72 shrink-0 flex flex-col gap-4">

            {/* Selected day detail */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              {selectedDay ? (
                <>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">
                    {MONTHS[month]} {selectedDay}, {year}
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                    {selectedAppts.length} appointment{selectedAppts.length !== 1 ? 's' : ''}
                  </p>
                  {selectedAppts.length === 0 ? (
                    <p className="text-xs text-gray-400">No appointments on this day.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {selectedAppts
                        .sort((a, b) => a.preferred_time?.localeCompare(b.preferred_time))
                        .map(a => (
                        <div key={a.id} className="border border-gray-100 rounded-lg p-3">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="text-sm font-medium text-gray-800">{a.full_name}</p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${STATUS_STYLE[a.status]}`}>
                              {a.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">{a.preferred_time}</p>
                          <p className="text-xs text-gray-500 mt-0.5 capitalize">{a.concern_type?.replace(/_/g, ' ')}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <CalIcon className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Select a day to view appointments</p>
                </div>
              )}
            </div>

            {/* Today's summary */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-maroon" />
                <h3 className="font-semibold text-gray-800 text-sm">Today's Summary</h3>
              </div>
              {todayAppts.length === 0 ? (
                <p className="text-xs text-gray-400">No appointments today.</p>
              ) : (
                <div className="space-y-2">
                  {todayAppts
                    .sort((a, b) => a.preferred_time?.localeCompare(b.preferred_time))
                    .map(a => (
                    <div key={a.id} className="flex items-center justify-between text-xs">
                      <div>
                        <p className="font-medium text-gray-700">{a.full_name}</p>
                        <p className="text-gray-400">{a.preferred_time}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[a.status]}`}>
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}