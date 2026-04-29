import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
  const { isAuth } = useAuth();
  return (
    <div className="min-h-screen bg-bglight flex flex-col items-center justify-center p-5 font-sans">
      <div className="w-20 h-20 bg-primary/8 rounded-full flex items-center justify-center mb-6">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#0B3C5D" strokeWidth="1.5">
          <circle cx="20" cy="20" r="18"/>
          <path d="M20 12v10M20 28h.01" strokeLinecap="round" strokeWidth="2.5"/>
        </svg>
      </div>
      <h1 className="font-serif text-6xl font-bold text-primary mb-2">404</h1>
      <h2 className="font-serif text-xl font-semibold text-textdark mb-3">Page Not Found</h2>
      <p className="text-sm text-gray-500 mb-8 text-center max-w-sm leading-relaxed">
        The page you are looking for does not exist or you may not have permission to view it.
      </p>
      <Link to={isAuth ? '/dashboard' : '/'} className="btn-primary">
        Back to {isAuth ? 'Dashboard' : 'Home'}
      </Link>
      <p className="mt-10 text-xs text-gray-300">MediHive v1.0.0 · © 2026 Govt. of India</p>
    </div>
  );
}
