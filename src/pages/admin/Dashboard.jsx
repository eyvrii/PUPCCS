import React from 'react'
import AdminSidebar from '../../components/AdminSidebar.jsx'

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-maroon mb-6">Dashboard</h1>
        <p className="text-gray-600">Welcome to the PUP Clinic Admin Portal.</p>
      </div>
    </div>
  )
}