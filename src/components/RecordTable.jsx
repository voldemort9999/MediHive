import React, { useState } from 'react';
import { fmtDate, statusBadgeClass } from '../utils/helpers';

export default function RecordTable({ records = [], onView, onDownload, showPatient = true }) {
  const [search, setSearch] = useState('');

  const filtered = records.filter((r) =>
    [r.patientName, r.diagnosis, r.doctor, r.type]
      .some((f) => (f || '').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="card overflow-hidden">
      {/* Search bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-bdr">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13"
            viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="5.5" cy="5.5" r="4"/><path d="M9 9l2.5 2.5"/>
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records…"
            className="form-input pl-8 py-2 text-xs"
          />
        </div>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-primary">
              <th className="th">#</th>
              {showPatient && <th className="th">Patient</th>}
              <th className="th">Diagnosis</th>
              <th className="th hidden md:table-cell">Doctor</th>
              <th className="th hidden sm:table-cell">Type</th>
              <th className="th hidden sm:table-cell">Date</th>
              <th className="th">Status</th>
              <th className="th text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={showPatient ? 8 : 7} className="td text-center text-gray-400 py-12">
                  No records found.
                </td>
              </tr>
            ) : (
              filtered.map((r, i) => (
                <tr
                  key={r.id}
                  className={`border-b border-bdr hover:bg-blue-50/40 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-bglight'}`}
                >
                  <td className="td text-gray-400 font-mono text-xs">{String(i + 1).padStart(2, '0')}</td>
                  {showPatient && <td className="td font-medium">{r.patientName}</td>}
                  <td className="td">{r.diagnosis}</td>
                  <td className="td text-gray-500 hidden md:table-cell">{r.doctor}</td>
                  <td className="td hidden sm:table-cell">
                    <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      {r.type}
                    </span>
                  </td>
                  <td className="td text-gray-400 text-xs hidden sm:table-cell">{fmtDate(r.date)}</td>
                  <td className="td">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${statusBadgeClass(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="td">
                    <div className="flex items-center justify-center gap-2">
                      {onView && (
                        <button onClick={() => onView(r)} title="View"
                          className="text-secondary hover:text-primary transition-colors p-1">
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M1 7.5S3.5 3 7.5 3s6.5 4.5 6.5 4.5-2.5 4.5-6.5 4.5S1 7.5 1 7.5z"/>
                            <circle cx="7.5" cy="7.5" r="1.5"/>
                          </svg>
                        </button>
                      )}
                      {onDownload && (
                        <button onClick={() => onDownload(r)} title="Download"
                          className="text-secondary hover:text-primary transition-colors p-1">
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M7.5 10V2M4 7l3.5 3.5L11 7M2 13h11" strokeLinecap="round"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
