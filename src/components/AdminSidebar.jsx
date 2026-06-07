import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ClipboardList,
  LogOut,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/admin/dashboard',    icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/admin/appointments', icon: ClipboardList,   label: 'Appointments' },
  { to: '/admin/patients',     icon: Users,           label: 'Patients'     },
  { to: '/admin/calendar',     icon: CalendarDays,    label: 'Calendar'     },
]

export default function AdminSidebar() {
  const { signOut } = useAuth()
  const navigate    = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col z-10"
      style={{ background: 'linear-gradient(180deg, #3a0a18 0%, #5a0000 60%, #8B0000 100%)' }}
    >
      {/* ── Header ──────────────────────────────── */}
      <div className="px-6 py-6 border-b border-white/10">
        {/* Republic strip */}
        <p className="text-white/30 text-[10px] font-mono tracking-[0.2em] uppercase mb-3">
          Republic of the Philippines
        </p>

        <div className="flex items-center gap-3">
          <img
            src="/pup-logo.png"
            alt="PUP"
            className="w-10 h-10 object-contain drop-shadow"
            onError={e => { e.target.style.display = 'none' }}
          />
          <div>
            <p className="font-display text-white font-semibold text-base leading-tight">
              PUP Clinic
            </p>
            <p className="text-gold text-[10px] font-mono tracking-widest uppercase mt-0.5">
              Admin Portal
            </p>
          </div>
        </div>

        {/* Gold accent line */}
        <div className="mt-4 h-px bg-gradient-to-r from-gold via-gold-light to-transparent" />
      </div>

      {/* ── Navigation ──────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-white/30 text-[9px] font-mono tracking-[0.3em] uppercase px-3 pt-2 pb-3">
          Navigation
        </p>

        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm font-sans font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-white text-maroon-dark shadow-sm'
                  : 'text-white/65 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`flex items-center justify-center w-7 h-7 ${
                  isActive ? 'text-maroon' : 'text-white/50'
                }`}>
                  <Icon className="w-4 h-4" />
                </span>
                <span className="tracking-wide">{label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer / Logout ─────────────────────── */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-sans font-medium text-white/50 hover:bg-white/10 hover:text-white transition-all duration-150"
        >
          <span className="flex items-center justify-center w-7 h-7 text-white/40">
            <LogOut className="w-4 h-4" />
          </span>
          Sign Out
        </button>
        <p className="text-white/20 text-[9px] font-mono text-center mt-4 tracking-widest">
          PUP CLINIC © {new Date().getFullYear()}
        </p>
      </div>
    </aside>
  )
}
