import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/public/Home.jsx'
import Services from './pages/public/Services.jsx'
import AppointmentForm from './pages/public/AppointmentForm.jsx'
import Login from './pages/admin/Login.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import Appointments from './pages/admin/Appointments.jsx'
import Patients from './pages/admin/Patients.jsx'
import Calendar from './pages/admin/Calendar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"            element={<Home />} />
        <Route path="/services"    element={<Services />} />
        <Route path="/appointment" element={<AppointmentForm />} />

        {/* Admin auth */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin protected — ProtectedRoute wraps an <Outlet /> */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index                element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard"    element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="patients"     element={<Patients />} />
          <Route path="calendar"     element={<Calendar />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}