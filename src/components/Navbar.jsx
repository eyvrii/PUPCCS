import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
   <nav className="bg-maroon text-white py-4 px-6 shadow-md flex justify-between items-center" style={{ borderBottom: '3px solid transparent', borderImage: 'linear-gradient(to right, #FFD700, #e6c200, #FFD700) 1' }}>
    <div className="flex items-center gap-3">
  <img
    src="/pup-logo.png"
    alt="PUP Logo"
    className="w-10 h-10 object-contain"
  />
  <div>
    <h1 className="text-xl font-bold leading-tight">PUPCare Clinic</h1>
    <p className="text-xs text-gold">Polytechnic University of the Philippines</p>
  </div>
</div>
      <div className="flex gap-4">
        <Link
          to="/services"
          className="bg-gold text-maroon font-bold px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors text-sm shadow"
        >
          Services
        </Link>
        <Link
          to="/admin/login"
          className="bg-gold text-maroon font-bold px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors text-sm shadow"
        >
          Admin Portal
        </Link>
      </div>
    </nav>
  );
}