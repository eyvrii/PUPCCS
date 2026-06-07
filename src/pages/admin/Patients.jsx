import React from 'react'
import AdminSidebar from '../../components/AdminSidebar.jsx'

export default function Patients() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-maroon mb-6">Patients</h1>
      </div>
    </div>
  )
}