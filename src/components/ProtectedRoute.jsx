import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function ProtectedRoute() {
  const { session } = useAuth()

  // Still loading (undefined = not yet checked)
  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-maroon border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // Not logged in
  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  // Logged in — render child route
  return <Outlet />
}