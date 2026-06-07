import React, { useEffect, useState } from 'react'
import AdminSidebar from '../../components/AdminSidebar.jsx' // Heto ang bumasag sa error sa screenshot mo!
import { supabase } from '../../lib/supabase.js' // Inayos din ang turo sa lib folder mo
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Calendar() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-maroon mb-6">Calendar</h1>
      </div>
    </div>
  )
}