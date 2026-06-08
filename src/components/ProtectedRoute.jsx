import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import AdminSidebar from './AdminSidebar'

export default function ProtectedRoute() {
  const { session, role } = useAuth()

  // Hintayin muna ang session at role
  if (session === undefined || role === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-maroon border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Hindi naka-login
  if (!session) return <Navigate to="/admin/login" replace />

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}