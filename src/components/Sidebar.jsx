import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_LINKS = {
  admin:   [
    { to: '/dashboard',     label: 'Dashboard'     },
    { to: '/records',       label: 'All Records'   },
    { to: '/upload',        label: 'Upload Record' },
    { to: '/admin/users',   label: 'Manage Users'  },
  ],
  doctor:  [
    { to: '/dashboard',        label: 'Dashboard'      },
    { to: '/records',          label: 'Medical Records' },
    { to: '/upload',           label: 'Upload Record'  },
    { to: '/doctor/patients',  label: 'My Patients'    },
  ],
  patient: [
    { to: '/dashboard', label: 'Dashboard'  },
    { to: '/records',   label: 'My Records' },
  ],
};

// Simple SVG icons
const icons = {
  '/dashboard':       <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="1" y="1" width="5" height="5" rx="1"/><rect x="9" y="1" width="5" height="5" rx="1"/><rect x="1" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></svg>,
  '/records':         <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 2h7l4 4v9H3V2zm4 0v5h4"/></svg>,
  '/upload':          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7.5 10V3M5 5.5l2.5-2.5 2.5 2.5M2 12.5h11" strokeLinecap="round"/></svg>,
  '/admin/users':     <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="5" cy="5" r="2.5"/><path d="M1 13a4 4 0 018 0M11 5h3M12.5 3.5v3" strokeLinecap="round"/></svg>,
  '/doctor/patients': <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="6" cy="5" r="2.5"/><path d="M1 13a5 5 0 0110 0" strokeLinecap="round"/></svg>,
};

export default function Sidebar({ open }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = ROLE_LINKS[user?.role] || [];

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => {}} />}

      <aside
        className="fixed top-14 left-0 bottom-0 z-40 flex flex-col transition-all duration-200 overflow-hidden"
        style={{
          width: open ? 220 : 0,
          background: '#082e47',
          borderRight: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex-1 py-4 px-2 overflow-y-auto space-y-0.5 min-w-[220px]">
          {/* User badge */}
          <div className="px-4 pb-3 mb-1">
            <p className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Signed in as</p>
            <p className="text-white/80 text-xs font-medium truncate">{user?.name}</p>
            <span className="inline-block mt-1.5 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-accent/20 text-accent">
              {user?.role}
            </span>
          </div>
          <div className="border-t border-white/10 mb-2" />

          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <span className="flex-shrink-0">{icons[to]}</span>
              <span className="whitespace-nowrap">{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Logout */}
        <div className="p-2 border-t border-white/10 min-w-[220px]">
          <button
            onClick={handleLogout}
            className="sidebar-link text-red-300 hover:bg-red-900/30 hover:text-red-200"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M9 11l3-3-3-3m3 3H5M5 2H3a1 1 0 00-1 1v9a1 1 0 001 1h2"/>
            </svg>
            <span className="whitespace-nowrap">Logout</span>
          </button>
          <p className="text-[9px] text-white/20 px-4 pt-2 whitespace-nowrap">MediHive v1.0 · © 2026 Govt. of India</p>
        </div>
      </aside>
    </>
  );
}
