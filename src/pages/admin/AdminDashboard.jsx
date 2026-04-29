import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import StatCard from '../../components/StatCard';
import { useAuth } from '../../context/AuthContext';
import { MOCK_USERS, MOCK_RECORDS } from '../../utils/mockData';
import { fmtDate, getInitials, roleBadgeClass, statusBadgeClass, capitalize } from '../../utils/helpers';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-primary">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, <span className="font-semibold text-primary">{user?.name}</span>. System overview for today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Patients" value="1,284" sub="Registered in system"
          iconBg="bg-secondary/10" iconColor="text-secondary"
          icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="9" cy="7" r="4"/><path d="M1.5 20a7.5 7.5 0 0115 0"/><path d="M16 11h4M18 9v4"/></svg>}
        />
        <StatCard
          label="Total Doctors" value="87" sub="Active medical staff"
          iconBg="bg-accent/10" iconColor="text-yellow-600"
          icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="9" cy="7" r="4"/><path d="M1.5 20a7.5 7.5 0 0115 0"/><path d="M17 9l1.5 1.5L17 12M18.5 10.5h-3"/></svg>}
        />
        <StatCard
          label="Records Uploaded" value="4,521" sub="All-time total"
          iconBg="bg-emerald-100" iconColor="text-emerald-600"
          icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 3h10l4 4v13a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zm6 0v5h5M8 12h6M8 15h4"/></svg>}
        />
        <StatCard
          label="Active Today" value="63" sub="Live sessions"
          iconBg="bg-secondary/10" iconColor="text-secondary"
          icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="9"/><path d="M11 6v5l3 3"/></svg>}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ── User table ── */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-serif text-lg font-semibold text-primary">Registered Users</h2>
              <p className="text-xs text-gray-400">{MOCK_USERS.length} users in the system</p>
            </div>
            <Link to="/admin/users" className="btn-primary btn-sm">+ Add User</Link>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-primary">
                    <th className="th">#</th>
                    <th className="th">Name</th>
                    <th className="th hidden sm:table-cell">Role</th>
                    <th className="th hidden md:table-cell">Department</th>
                    <th className="th">Status</th>
                    <th className="th text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_USERS.map((u, i) => (
                    <tr key={u.id}
                      className={`border-b border-bdr hover:bg-blue-50/30 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-bglight'}`}>
                      <td className="td text-gray-400 font-mono text-xs">{String(i + 1).padStart(2, '0')}</td>
                      <td className="td">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold flex-shrink-0">
                            {getInitials(u.name)}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-textdark">{u.name}</p>
                            <p className="text-[10px] text-gray-400">{u.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="td hidden sm:table-cell">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${roleBadgeClass(u.role)}`}>
                          {capitalize(u.role)}
                        </span>
                      </td>
                      <td className="td text-gray-500 text-xs hidden md:table-cell">{u.department}</td>
                      <td className="td">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${statusBadgeClass(u.status)}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="td text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button title="Edit" className="text-secondary hover:text-primary transition-colors p-1">
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 2l2 2-7 7H2v-2L9 2z"/></svg>
                          </button>
                          <button title="Delete" className="text-red-400 hover:text-red-600 transition-colors p-1">
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h9M5 3V2h3v1M4 3v8h5V3"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col gap-5">

          {/* Recent records */}
          <div>
            <h2 className="font-serif text-base font-semibold text-primary mb-3">Recent Records</h2>
            <div className="card overflow-hidden divide-y divide-bdr">
              {MOCK_RECORDS.slice(0, 5).map((r, i) => (
                <div key={r.id} className={`flex items-start gap-3 px-4 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-bglight'}`}>
                  <div className="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#328CC1" strokeWidth="1.5">
                      <path d="M3 2h6l3 3v7a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1zm4 0v4h3"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-textdark truncate">{r.patientName}</p>
                    <p className="text-[11px] text-gray-400 truncate">{r.diagnosis}</p>
                    <p className="text-[10px] text-gray-300 mt-0.5">{fmtDate(r.date)}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0 ${statusBadgeClass(r.status)}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Role breakdown */}
          <div>
            <h2 className="font-serif text-base font-semibold text-primary mb-3">User Breakdown</h2>
            <div className="card p-4 space-y-3">
              {[
                { label: 'Patients', count: MOCK_USERS.filter((u) => u.role === 'patient').length, color: 'bg-emerald-400', pct: 50 },
                { label: 'Doctors',  count: MOCK_USERS.filter((u) => u.role === 'doctor').length,  color: 'bg-secondary',    pct: 50 },
              ].map(({ label, count, color, pct }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-textdark">{label}</span>
                    <span className="text-xs text-gray-400">{count}</span>
                  </div>
                  <div className="h-1.5 bg-bdr rounded-full">
                    <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
