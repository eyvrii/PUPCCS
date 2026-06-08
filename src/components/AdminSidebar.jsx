import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ClipboardList,
  LogOut,
  HeartPulse,
  Stethoscope,
  Brain,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

const ALL_APPT_ITEMS = [
  { to: '/admin/medical/appointments', icon: HeartPulse,  label: '🩺 Medical',      role: 'medical' },
  { to: '/admin/dental/appointments',  icon: Stethoscope, label: '🦷 Dental',        role: 'dental'  },
  { to: '/admin/mental/appointments',  icon: Brain,       label: '🧠 Mental Health', role: 'mental'  },
]

export default function AdminSidebar() {
  const { signOut, role }             = useAuth()
  const navigate                      = useNavigate()
  const location                      = useLocation()
  const [showConfirm, setShowConfirm] = useState(false)

  const isAdmin = role === 'admin'

  const apptItems = isAdmin
    ? ALL_APPT_ITEMS
    : ALL_APPT_ITEMS.filter(item => item.role === role)

  const isOnAppointments =
    location.pathname.includes('/admin/medical') ||
    location.pathname.includes('/admin/dental')  ||
    location.pathname.includes('/admin/mental')

  const [apptOpen, setApptOpen] = useState(isOnAppointments)

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <>
      <aside
        className="fixed left-0 top-0 h-full w-64 flex flex-col z-10"
        style={{ background: 'linear-gradient(180deg, #3a0a18 0%, #5a0000 60%, #8B0000 100%)' }}
      >
        {/* Header */}
        <div className="px-6 py-6 border-b border-white/10">
          <p className="text-white/30 text-[10px] font-mono tracking-[0.2em] uppercase mb-3">
            Republic of the Philippines
          </p>
          <div className="flex items-center gap-3">
            <img
              src="/pup-logo.png" alt="PUP"
              className="w-10 h-10 object-contain drop-shadow"
              onError={e => { e.target.style.display = 'none' }}
            />
            <div>
              <p className="text-white font-semibold text-base leading-tight">PUPCare Clinic</p>
              <p className="text-gold text-[10px] font-mono tracking-widest uppercase mt-0.5">
                HealthCare Portal
              </p>
            </div>
          </div>
          <div className="mt-4 h-px bg-gradient-to-r from-gold via-gold-light to-transparent" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-white/30 text-[9px] font-mono tracking-[0.3em] uppercase px-3 pt-2 pb-3">
            Navigation
          </p>

          {/* Dashboard — lahat ng roles */}
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150 rounded-lg ${
                isActive
                  ? 'bg-white text-maroon shadow-sm'
                  : 'text-white/65 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <LayoutDashboard className={`w-4 h-4 ${isActive ? 'text-maroon' : 'text-white/50'}`} />
                <span>Dashboard</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />}
              </>
            )}
          </NavLink>

          {/* Appointments */}
          <div>
            {isAdmin ? (
              <button
                onClick={() => setApptOpen(o => !o)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium transition-all duration-150 rounded-lg ${
                  isOnAppointments
                    ? 'text-white'
                    : 'text-white/65 hover:bg-white/10 hover:text-white'
                }`}
              >
                <ClipboardList className="w-4 h-4 text-white/50" />
                <span>Appointments</span>
                <span className="ml-auto">
                  {apptOpen
                    ? <ChevronUp className="w-3.5 h-3.5 text-white/40" />
                    : <ChevronDown className="w-3.5 h-3.5 text-white/40" />}
                </span>
              </button>
            ) : (
              <p className="text-white/30 text-[9px] font-mono tracking-[0.3em] uppercase px-3 pt-3 pb-2">
                Appointments
              </p>
            )}

            {(isAdmin ? apptOpen : true) && (
              <div className="mt-0.5 space-y-0.5">
                {apptItems.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to} to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 pl-8 pr-3 py-2 text-sm font-medium transition-all duration-150 rounded-lg ${
                        isActive
                          ? 'bg-white text-maroon shadow-sm'
                          : 'text-white/55 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-maroon' : 'text-white/40'}`} />
                        <span>{label}</span>
                        {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Patients — lahat ng roles */}
          <NavLink
            to="/admin/patients"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150 rounded-lg ${
                isActive
                  ? 'bg-white text-maroon shadow-sm'
                  : 'text-white/65 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Users className={`w-4 h-4 ${isActive ? 'text-maroon' : 'text-white/50'}`} />
                <span>Patients</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />}
              </>
            )}
          </NavLink>

          {/* Calendar — lahat ng roles */}
          <NavLink
            to="/admin/calendar"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150 rounded-lg ${
                isActive
                  ? 'bg-white text-maroon shadow-sm'
                  : 'text-white/65 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <CalendarDays className={`w-4 h-4 ${isActive ? 'text-maroon' : 'text-white/50'}`} />
                <span>Calendar</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />}
              </>
            )}
          </NavLink>
        </nav>

        {/* Sign Out */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-white/50 hover:bg-white/10 hover:text-white transition-all duration-150 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <p className="text-white/20 text-[9px] font-mono text-center mt-4 tracking-widest">
            PUPCare CLINIC © {new Date().getFullYear()}
          </p>
        </div>
      </aside>

      {/* Sign Out Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-72 shadow-xl">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-bold text-gray-800 text-base text-center mb-1">Sign Out</h3>
            <p className="text-gray-500 text-sm text-center mb-5">
              Are you sure you want to sign out of the admin portal?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 text-sm bg-maroon text-white rounded-xl hover:bg-maroon-dark transition-colors font-semibold"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}