import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { supabase } from '../../lib/supabase'
import { Eye, EyeOff, Shield } from 'lucide-react'

export default function Login() {
  const { signIn, signOut }         = useAuth()
  const navigate                    = useNavigate()
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [showPw, setShowPw]         = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Sign out muna para fresh login palagi
    await signOut()

    const { data, error: err } = await signIn(email, password)
    if (err) {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
      return
    }

    // Kunin ang role mula sa user_roles table
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .single()

    const userRole = roleData?.role

    if (userRole === 'admin')        navigate('/admin/dashboard')
    else if (userRole === 'medical') navigate('/admin/medical/appointments')
    else if (userRole === 'dental')  navigate('/admin/dental/appointments')
    else if (userRole === 'mental')  navigate('/admin/mental/appointments')
    else                             navigate('/admin/dashboard')

    setLoading(false)
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'linear-gradient(135deg, #3a0a18 0%, #5a0000 50%, #8B0000 100%)' }}
    >
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 px-16 py-14 border-r border-white/10">
        <div className="flex items-center gap-4">
          <img
            src="/pup-logo.png" alt="PUP"
            className="w-14 h-14 object-contain drop-shadow-lg"
            onError={e => { e.target.style.display = 'none' }}
          />
          <div className="border-l border-gold/40 pl-4">
            <p className="text-white text-xl font-semibold leading-none">PUPCare Clinic</p>
            <p className="text-gold text-xs tracking-widest uppercase mt-1">Health Services Office</p>
          </div>
        </div>
        <div>
          <div className="w-1 h-16 mb-6" style={{ background: 'linear-gradient(to bottom, #FFD700, #e6c200)' }} />
          <h2 className="text-5xl text-white font-semibold leading-tight mb-4">
            Your Health,<br />
            <span className="italic" style={{ color: '#FFD700' }}>Our Priority.</span>
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            Authorized personnel only. This portal is for PUP clinic staff and administrators.
          </p>
        </div>
        <p className="text-white/25 text-xs tracking-widest uppercase">
          © {new Date().getFullYear()} Polytechnic University of the Philippines
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-14">
        <div className="w-full max-w-sm">

          {/* Mobile header */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <img
              src="/pup-logo.png" alt="PUP"
              className="w-10 h-10 object-contain"
              onError={e => { e.target.style.display = 'none' }}
            />
            <div>
              <p className="text-white text-lg font-semibold leading-none">PUPCare Clinic</p>
              <p className="text-gold text-xs tracking-widest uppercase mt-0.5">Admin Portal</p>
            </div>
          </div>

          <div className="flex justify-end mb-4">
            <Link
              to="/"
              className="text-white/70 text-sm hover:text-white transition-colors underline underline-offset-4"
            >
              ← Back to Website
            </Link>
          </div>

          <div className="bg-white/10 border-t-4 border-t-gold p-8">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-4 h-4 text-gold" />
              <span className="text-xs tracking-widest uppercase text-white/60 font-semibold">
                Authorized Access Only
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-1">HealthCare Portal</h2>
            <div className="w-8 h-px bg-gold mb-6" />

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label text-white/70">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="admin@pup.edu.ph"
                  required
                />
              </div>
              <div>
                <label className="label text-white/70">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-field pr-11"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-maroon transition-colors"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="border border-red-300 bg-red-50 text-red-700 text-xs px-4 py-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 mt-2"
              >
                {loading ? 'Signing In...' : 'Sign In to Portal'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}