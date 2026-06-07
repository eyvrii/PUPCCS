import { useEffect, useState } from 'react'
import AdminSidebar from '../../components/AdminSidebar.jsx'
import { supabase } from '../../lib/supabase.js'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const STATUS_DOT = {
  pending: 'bg-yellow-400',
  approved: 'bg-green-400',
  completed: 'bg-blue-400',
  rejected: 'bg-red-400',
  cancelled: 'bg-gray-400',
}

export default function Calendar() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data } = await supabase.from('appointments').select('*')
    if (data) setAppointments(data)
    setLoading(false)
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const getApptForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return appointments.filter(a => a.preferred_date === dateStr)
  }

  const selectedAppts = selectedDay ? getApptForDay(selectedDay) : []

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
          <p className="text-gray-500 text-sm mt-1">View appointments by date</p>
        </div>

        <div className="flex gap-6 flex-wrap">
          {/* Calendar */}
          <div className="card flex-1 min-w-72">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
              <h2 className="font-semibold text-gray-800">{MONTH_NAMES[month]} {year}</h2>
              <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAY_NAMES.map(d => (
                <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells */}
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const dayAppts = getApptForDay(day)
                const isToday = new Date().getDate() === day &&
                  new Date().getMonth() === month &&
                  new Date().getFullYear() === year
                const isSelected = selectedDay === day

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    className={`aspect-square flex flex-col items-center justify-start pt-1 rounded-lg text-sm transition-all relative ${
                      isSelected ? 'bg-maroon text-white' :
                      isToday ? 'bg-gold/20 text-maroon font-bold' :
                      'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-xs leading-none">{day}</span>
                    {dayAppts.length > 0 && (
                      <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                        {dayAppts.slice(0, 3).map((a, i) => (
                          <span key={i} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/70' : STATUS_DOT[a.status] || 'bg-gray-400'}`} />
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t flex flex-wrap gap-3">
              {Object.entries(STATUS_DOT).map(([status, color]) => (
                <div key={status} className="flex items-center gap-1.5 text-xs text-gray-500 capitalize">
                  <span className={`w-2 h-2 rounded-full ${color}`} />
                  {status}
                </div>
              ))}
            </div>
          </div>

          {/* Day detail */}
          <div className="w-72 shrink-0">
            {selectedDay ? (
              <div className="card">
                <h3 className="font-semibold text-gray-800 mb-4 text-sm">
                  {MONTH_NAMES[month]} {selectedDay}, {year}
                </h3>
                {selectedAppts.length === 0 ? (
                  <p className="text-sm text-gray-400">No appointments on this day.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedAppts.map(a => (
                      <div key={a.id} className="border border-gray-100 rounded-lg p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{a.full_name}</p>
                            <p className="text-xs text-gray-400">{a.preferred_time}</p>
                            <p className="text-xs text-gray-500 mt-1 capitalize">{a.concern_type?.replace('_', ' ')}</p>
                          </div>
                          <span className={`badge-${a.status} shrink-0`}>{a.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="card text-center py-10">
                <p className="text-sm text-gray-400">Select a day to view appointments</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
