import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import StatCard from '../../components/StatCard';
import { useAuth } from '../../context/AuthContext';
import { MOCK_PATIENTS, MOCK_RECORDS } from '../../utils/mockData';
import { fmtDate, getInitials, statusBadgeClass } from '../../utils/helpers';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const myRecords = MOCK_RECORDS.filter((r) => r.doctor === 'Dr. Priya Sharma').slice(0, 4);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-primary">Doctor Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome, <span className="font-semibold text-primary">{user?.name}</span>. Your clinical overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard label="Assigned Patients" value="24" sub="Under your care"
          iconBg="bg-secondary/10" iconColor="text-secondary"
          icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="9" cy="7" r="4"/><path d="M1.5 20a7.5 7.5 0 0115 0"/></svg>}/>
        <StatCard label="Pending Reviews" value="5" sub="Records to review"
          iconBg="bg-accent/10" iconColor="text-yellow-600"
          icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 3h10l4 4v13a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zm6 0v5h5M8 12h6M8 15h4"/></svg>}/>
        <StatCard label="Records Uploaded" value="142" sub="All-time total"
          iconBg="bg-emerald-100" iconColor="text-emerald-600"
          icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 14V6M9 9l3-3 3 3M3 18h16" strokeLinecap="round"/></svg>}/>
        <StatCard label="Appointments Today" value="8" sub="Scheduled"
          iconBg="bg-secondary/10" iconColor="text-secondary"
          icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="4" width="18" height="16" rx="2"/><path d="M7 2v4M15 2v4M2 10h18"/></svg>}/>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Assigned patients table */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-serif text-lg font-semibold text-primary">Assigned Patients</h2>
              <p className="text-xs text-gray-400">{MOCK_PATIENTS.length} patients</p>
            </div>
            <Link to="/doctor/patients" className="text-xs text-secondary hover:text-primary font-medium transition-colors">
              View all →
            </Link>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-primary">
                    <th className="th">#</th>
                    <th className="th">Patient</th>
                    <th className="th hidden sm:table-cell">Condition</th>
                    <th className="th hidden md:table-cell">Last Visit</th>
                    <th className="th hidden sm:table-cell">Blood Grp</th>
                    <th className="th text-center">Records</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_PATIENTS.map((p, i) => (
                    <tr key={p.id}
                      className={`border-b border-bdr hover:bg-blue-50/30 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-bglight'}`}>
                      <td className="td text-gray-400 font-mono text-xs">{String(i + 1).padStart(2, '0')}</td>
                      <td className="td">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center text-secondary text-xs font-bold flex-shrink-0">
                            {getInitials(p.name)}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-textdark">{p.name}</p>
                            <p className="text-[10px] text-gray-400">{p.age}y · {p.gender}</p>
                          </div>
                        </div>
                      </td>
                      <td className="td text-gray-500 text-xs hidden sm:table-cell">{p.condition}</td>
                      <td className="td text-gray-400 text-xs hidden md:table-cell">{fmtDate(p.lastVisit)}</td>
                      <td className="td hidden sm:table-cell">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">
                          {p.bloodGroup}
                        </span>
                      </td>
                      <td className="td text-center">
                        <Link to="/records" className="btn-secondary btn-sm">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">

          {/* Quick actions */}
          <div>
            <h2 className="font-serif text-base font-semibold text-primary mb-3">Quick Actions</h2>
            <div className="card p-3 space-y-2">
              {[
                { to: '/upload',           label: 'Upload Record',  sub: 'Add new patient record',   bg: 'bg-primary/8',       color: 'text-primary'      },
                { to: '/records',          label: 'View Records',   sub: 'Browse medical records',   bg: 'bg-secondary/10',    color: 'text-secondary'    },
                { to: '/doctor/patients',  label: 'My Patients',    sub: 'View patient details',     bg: 'bg-emerald-100',     color: 'text-emerald-600'  },
              ].map(({ to, label, sub, bg, color }) => (
                <Link key={to} to={to}
                  className="flex items-center gap-3 p-3 rounded border border-bdr hover:border-secondary hover:bg-blue-50/20 transition-colors group">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${bg} ${color}`}>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M7.5 10V3M5 5.5l2.5-2.5 2.5 2.5M2 12.5h11" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-textdark">{label}</p>
                    <p className="text-[11px] text-gray-400">{sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent uploads */}
          <div>
            <h2 className="font-serif text-base font-semibold text-primary mb-3">Recent Uploads</h2>
            <div className="card overflow-hidden divide-y divide-bdr">
              {myRecords.map((r, i) => (
                <div key={r.id}
                  className={`flex items-start gap-3 px-4 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-bglight'}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0 mt-2" />
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
        </div>
      </div>
    </DashboardLayout>
  );
}
