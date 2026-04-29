import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ANNOUNCEMENTS } from '../utils/mockData';

export default function HomePage() {
  const { isAuth } = useAuth();
  const [annIdx, setAnnIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setAnnIdx((i) => (i + 1) % ANNOUNCEMENTS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">

      {/* ── Top strip ─────────────────────────────── */}
      <div className="bg-primary text-white/50 text-[11px] py-1.5 text-center tracking-wide">
        Ministry of Health &amp; Family Welfare, Government of India &nbsp;·&nbsp; Digital Health Initiative
      </div>

      {/* ── Navbar ────────────────────────────────── */}
      <nav className="bg-white border-b border-bdr shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="#0B3C5D"/>
              <path d="M20 8v24M8 20h24" stroke="#D9B310" strokeWidth="4" strokeLinecap="round"/>
            </svg>
            <div>
              <p className="font-serif font-bold text-primary text-lg leading-tight">MediHive</p>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest">Medical Records System</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/" className="text-sm text-primary font-medium hover:text-secondary transition-colors hidden sm:block">
              Home
            </Link>
            {isAuth ? (
              <Link to="/dashboard" className="btn-primary btn-sm">Dashboard</Link>
            ) : (
              <Link to="/login" className="btn-primary btn-sm">Login</Link>
            )}
          </div>
        </div>
      </nav>

      {/* ── Announcement bar ──────────────────────── */}
      <div className="bg-accent/15 border-b border-accent/30 px-5 py-2 flex items-center gap-3">
        <span className="bg-accent text-primary text-[10px] font-bold uppercase px-2 py-0.5 rounded flex-shrink-0">
          Notice
        </span>
        <p className="text-xs text-textdark truncate">{ANNOUNCEMENTS[annIdx]}</p>
      </div>

      {/* ── Hero ──────────────────────────────────── */}
      <section className="bg-primary relative overflow-hidden py-20 px-5">
        {/* Decorative circles */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
          <div className="absolute top-10 left-16 w-64 h-64 border-2 border-white rounded-full" />
          <div className="absolute bottom-0 right-20 w-80 h-80 border border-white rounded-full translate-y-1/2" />
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-14 relative">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/70 text-xs px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              Government of India Initiative
            </div>
            <h1 className="font-serif text-white text-4xl md:text-5xl font-bold leading-tight mb-6">
              Secure Medical Records<br />
              <span className="text-accent">Management System</span>
            </h1>
            <p className="text-white/65 text-sm leading-relaxed mb-8 max-w-lg">
              A centralised digital platform for managing patient records, prescriptions, and diagnostic
              reports — designed for hospitals and clinics across India.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/login" className="btn-accent">Get Started</Link>
              <a href="#features"
                className="border border-white/40 text-white text-sm font-medium px-5 py-2.5 rounded hover:bg-white/10 transition-colors">
                Learn More
              </a>
            </div>
          </div>

          {/* Emblem */}
          <div className="flex-shrink-0 hidden md:block text-center">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="56" stroke="#D9B310" strokeWidth="1.5" fill="none"/>
              <circle cx="60" cy="60" r="44" stroke="#D9B310" strokeWidth="0.75" fill="none" strokeDasharray="3 3"/>
              <path d="M60 20v80M20 60h80" stroke="#D9B310" strokeWidth="3.5" strokeLinecap="round"/>
              <circle cx="60" cy="60" r="10" fill="#D9B310" fillOpacity="0.25"/>
            </svg>
            <p className="text-white/30 text-[10px] uppercase tracking-widest mt-3">Satyameva Jayate</p>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────── */}
      <div className="bg-[#082e47] py-7 px-5">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            ['1,284+', 'Registered Patients'],
            ['87',     'Medical Professionals'],
            ['4,521',  'Records Managed'],
            ['99.9%',  'System Uptime'],
          ].map(([v, l]) => (
            <div key={l}>
              <p className="text-2xl font-serif font-bold text-accent">{v}</p>
              <p className="text-xs text-white/40 mt-1">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ──────────────────────────────── */}
      <section id="features" className="py-16 px-5 bg-bglight">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-primary mb-3">
              Comprehensive Healthcare Management
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
              Role-based access for patients, doctors, and administrators — built for the Indian healthcare ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              ['Digital Record Storage',      'Upload, organise, and access patient records in a secure, centralised repository accessible 24/7.'],
              ['Role-Based Access Control',   'Admins, doctors, and patients each have precisely scoped access — ensuring data privacy.'],
              ['Real-Time Access',            'Instant access to the latest records for doctors, reducing wait times and improving outcomes.'],
              ['Admin Dashboard',             'Full oversight of all users, records, and system activity with exportable reports.'],
              ['JWT Authentication',          'Industry-standard token authentication with auto-refresh and secure session management.'],
              ['File Upload & Download',      'Drag-and-drop upload for PDF, images, and Word documents with one-click patient download.'],
            ].map(([title, desc]) => (
              <div key={title} className="card p-6 hover:shadow-md transition-shadow">
                <div className="w-9 h-9 bg-primary/8 rounded-lg flex items-center justify-center mb-4">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#0B3C5D" strokeWidth="1.6">
                    <path d="M4 2h8l4 4v10a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1zm5 0v5h4"/>
                  </svg>
                </div>
                <h3 className="font-serif font-semibold text-primary text-sm mb-2">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role cards ────────────────────────────── */}
      <section className="py-16 px-5">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-2xl font-bold text-primary text-center mb-10">
            Designed for Every Role
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { role: 'Patient', border: 'border-t-4 border-t-emerald-400', badge: 'bg-emerald-100 text-emerald-700',
                desc: 'View and download your medical records, prescriptions, and diagnostic reports from any device.' },
              { role: 'Doctor',  border: 'border-t-4 border-t-secondary',   badge: 'bg-blue-100 text-blue-700',
                desc: 'Access assigned patient records, upload new reports, and maintain a complete clinical history.' },
              { role: 'Admin',   border: 'border-t-4 border-t-accent',      badge: 'bg-yellow-100 text-yellow-700',
                desc: 'Manage all users, monitor system activity, and maintain full visibility over hospital records.' },
            ].map(({ role, border, badge, desc }) => (
              <div key={role} className={`card p-6 ${border}`}>
                <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${badge}`}>{role}</span>
                <p className="text-sm text-gray-500 leading-relaxed mt-4">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────── */}
      <section className="bg-bglight border-t border-bdr py-14 px-5 text-center">
        <h2 className="font-serif text-2xl font-bold text-primary mb-3">Ready to get started?</h2>
        <p className="text-gray-500 text-sm mb-7 max-w-md mx-auto">
          Login with credentials provided by your hospital administrator to access MediHive.
        </p>
        <Link to="/login" className="btn-primary">Access MediHive Portal</Link>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer className="bg-primary text-white py-10 px-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect width="36" height="36" rx="7" fill="#0B3C5D"/>
                <rect width="36" height="36" rx="7" fill="white" fillOpacity="0.06"/>
                <path d="M18 7v22M7 18h22" stroke="#D9B310" strokeWidth="3.5" strokeLinecap="round"/>
              </svg>
              <div>
                <p className="font-serif font-bold text-lg">MediHive</p>
                <p className="text-[9px] text-white/35">Medical Records Management System</p>
              </div>
            </div>
            <p className="text-xs text-white/35 max-w-xs leading-relaxed">
              A Government of India initiative under the Ministry of Health &amp; Family Welfare.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-xs">
            {[
              ['Quick Links', ['Home', 'Login', 'Help & Support']],
              ['Legal',       ['Privacy Policy', 'Terms of Use', 'Accessibility']],
            ].map(([sec, items]) => (
              <div key={sec}>
                <p className="font-semibold text-white/50 uppercase tracking-wider mb-3">{sec}</p>
                {items.map((item) => (
                  <p key={item} className="text-white/35 mb-2 cursor-pointer hover:text-white/60 transition-colors">{item}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between gap-2">
          <p className="text-xs text-white/25">© 2026 Ministry of Health &amp; Family Welfare, Government of India</p>
          <p className="text-xs text-white/20 font-mono">MediHive v1.0.0 · Build 2026.04</p>
        </div>
      </footer>
    </div>
  );
}
