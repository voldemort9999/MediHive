import React from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import StatCard from '../../components/StatCard';
import { useAuth } from '../../context/AuthContext';
import { MOCK_RECORDS } from '../../utils/mockData';
import { fmtDate, getInitials, statusBadgeClass, downloadText } from '../../utils/helpers';

export default function PatientDashboard() {
  const { user } = useAuth();
  const myRecords = MOCK_RECORDS.filter((r) => r.patientName === 'Rohan Mehta');

  const handleDownload = (r) => {
    downloadText(
      `MediHive Medical Record\n${'='.repeat(40)}\nPatient:   ${r.patientName}\nDiagnosis: ${r.diagnosis}\nDoctor:    ${r.doctor}\nDate:      ${r.date}\nType:      ${r.type}\nStatus:    ${r.status}`,
      `medihive_record_${r.id}.txt`
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-primary">My Health Records</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome, <span className="font-semibold text-primary">{user?.name}</span>. Your complete medical history.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Records" value="12" sub="All time"
          iconBg="bg-secondary/10" iconColor="text-secondary"
          icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 3h10l4 4v13a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zm6 0v5h5"/></svg>}/>
        <StatCard label="Prescriptions" value="5" sub="Issued"
          iconBg="bg-emerald-100" iconColor="text-emerald-600"
          icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 2H4a1 1 0 00-1 1v16a1 1 0 001 1h14a1 1 0 001-1V8l-6-6zm-1 0v6h6M7 13h8M7 17h5"/></svg>}/>
        <StatCard label="Lab Reports" value="4" sub="Completed"
          iconBg="bg-accent/10" iconColor="text-yellow-600"
          icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M8 3v9l-3 5h12l-3-5V3M6 3h10" strokeLinecap="round"/></svg>}/>
      </div>

      {/* Patient info card */}
      <div className="card p-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
            {[
              ['Full Name',       user?.name],
              ['Patient ID',      `MH-${String(user?.id ?? 2).padStart(6, '0')}`],
              ['Blood Group',     'O+'],
              ['Primary Doctor',  'Dr. Priya Sharma'],
            ].map(([label, val]) => (
              <div key={label}>
                <p className="text-[9px] text-gray-400 uppercase tracking-wider">{label}</p>
                <p className={`text-sm font-semibold mt-0.5 ${label === 'Blood Group' ? 'text-red-600' : 'text-textdark'}`}>
                  {val}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Records */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-serif text-lg font-semibold text-primary">My Medical Records</h2>
          <p className="text-xs text-gray-400">{myRecords.length} records on file</p>
        </div>
        <Link to="/records" className="text-xs text-secondary hover:text-primary font-medium transition-colors">
          View all →
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-primary">
                <th className="th">#</th>
                <th className="th">Diagnosis</th>
                <th className="th hidden md:table-cell">Doctor</th>
                <th className="th hidden sm:table-cell">Type</th>
                <th className="th hidden sm:table-cell">Date</th>
                <th className="th">Status</th>
                <th className="th text-center">Download</th>
              </tr>
            </thead>
            <tbody>
              {myRecords.map((r, i) => (
                <tr key={r.id}
                  className={`border-b border-bdr hover:bg-blue-50/40 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-bglight'}`}>
                  <td className="td text-gray-400 font-mono text-xs">{String(i + 1).padStart(2, '0')}</td>
                  <td className="td font-medium text-textdark">{r.diagnosis}</td>
                  <td className="td text-gray-500 hidden md:table-cell">{r.doctor}</td>
                  <td className="td hidden sm:table-cell">
                    <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">{r.type}</span>
                  </td>
                  <td className="td text-gray-400 text-xs hidden sm:table-cell">{fmtDate(r.date)}</td>
                  <td className="td">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${statusBadgeClass(r.status)}`}>{r.status}</span>
                  </td>
                  <td className="td text-center">
                    <button onClick={() => handleDownload(r)}
                      className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-primary font-medium border border-secondary/30 hover:border-primary rounded px-2.5 py-1 transition-colors">
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M5.5 7.5V1M3 5l2.5 2.5L8 5M1 9.5h9" strokeLinecap="round"/>
                      </svg>
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info notice */}
      <div className="mt-5 flex items-start gap-3 bg-secondary/6 border border-secondary/20 rounded-lg px-4 py-3">
        <svg className="text-secondary flex-shrink-0 mt-0.5" width="15" height="15"
          viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="7.5" cy="7.5" r="6.5"/><path d="M7.5 4.5v3M7.5 10h.01"/>
        </svg>
        <p className="text-xs text-gray-500 leading-relaxed">
          Your records are encrypted and securely stored. Only your treating doctor and authorised
          administrators can access these files. Contact your hospital administrator if you notice any discrepancy.
        </p>
      </div>
    </DashboardLayout>
  );
}
