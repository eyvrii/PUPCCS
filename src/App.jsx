import { Routes, Route, Navigate } from 'react-router-dom'
import Home              from './pages/public/Home.jsx'
import Services          from './pages/public/Services.jsx'
import AppointmentForm   from './pages/public/AppointmentForm.jsx'
import Login             from './pages/admin/Login.jsx'
import Dashboard         from './pages/admin/Dashboard.jsx'
import MedicalAppointments from './pages/admin/medical/appointments.jsx'
import DentalAppointments  from './pages/admin/dental/appointments.jsx'
import MentalAppointments  from './pages/admin/mental/appointments.jsx'
import Patients          from './pages/admin/Patients.jsx'
import Calendar          from './pages/admin/Calendar.jsx'
import ProtectedRoute    from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"            element={<Home />} />
      <Route path="/services"    element={<Services />} />
      <Route path="/appointment" element={<AppointmentForm />} />

      {/* Login — walang auto-redirect */}
      <Route path="/admin/login" element={<Login />} />

      {/* Protected admin routes */}
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard"            element={<Dashboard />} />
        <Route path="medical/appointments" element={<MedicalAppointments />} />
        <Route path="dental/appointments"  element={<DentalAppointments />} />
        <Route path="mental/appointments"  element={<MentalAppointments />} />
        <Route path="patients"             element={<Patients />} />
        <Route path="calendar"             element={<Calendar />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}