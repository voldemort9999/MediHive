import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout, isAuth } = useAuth();
  const navigate = useNavigate();
  const [dd, setDd] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-primary flex items-center px-4 shadow-md">
      <div className="flex items-center justify-between w-full">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          {isAuth && (
            <button onClick={onToggleSidebar} className="text-white/60 hover:text-white p-1">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <rect y="3"  width="20" height="2" rx="1"/>
                <rect y="9"  width="20" height="2" rx="1"/>
                <rect y="15" width="20" height="2" rx="1"/>
              </svg>
            </button>
          )}
          <Link to="/" className="flex items-center gap-2.5">
            {/* Logo mark */}
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
              <rect width="30" height="30" rx="6" fill="#0B3C5D"/>
              <rect width="30" height="30" rx="6" fill="white" fillOpacity="0.06"/>
              <path d="M15 6v18M6 15h18" stroke="#D9B310" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <div className="leading-tight">
              <p className="text-white font-bold text-base font-serif tracking-wide">MediHive</p>
              <p className="text-white/40 text-[9px] uppercase tracking-widest hidden sm:block">Medical Records System</p>
            </div>
          </Link>
        </div>

        {/* CENTER */}
        <p className="text-white/30 text-xs hidden md:block">
          Ministry of Health & Family Welfare, Govt. of India
        </p>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {!isAuth ? (
            <>
              <Link to="/" className="text-white/70 hover:text-white text-sm hidden sm:block">Home</Link>
              <Link to="/login" className="btn-accent btn-sm">Login</Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDd(!dd)}
                className="flex items-center gap-2 hover:bg-white/10 rounded px-2 py-1 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-primary text-[11px] font-bold">
                  {getInitials(user?.name)}
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <p className="text-white text-xs font-semibold">{user?.name}</p>
                  <p className="text-white/40 text-[10px] capitalize">{user?.role}</p>
                </div>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="1.5">
                  <path d="M2 3l3 4 3-4"/>
                </svg>
              </button>

              {dd && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-md shadow-lg border border-bdr z-50">
                  <div className="px-4 py-2.5 border-b border-bdr">
                    <p className="text-xs font-semibold text-textdark truncate">{user?.name}</p>
                    <p className="text-[10px] text-gray-400 capitalize">{user?.role}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setDd(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-textdark hover:bg-bglight">
                    Dashboard
                  </Link>
                  <button onClick={() => { setDd(false); handleLogout(); }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full">
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
