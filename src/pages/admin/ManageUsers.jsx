import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { MOCK_USERS } from '../../utils/mockData';
import { fmtDate, getInitials, roleBadgeClass, statusBadgeClass, capitalize } from '../../utils/helpers';

export default function ManageUsers() {
  const [search,    setSearch]    = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const filtered = MOCK_USERS.filter((u) => {
    const matchSearch = [u.name, u.username, u.department]
      .some((f) => (f || '').toLowerCase().includes(search.toLowerCase()));
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">Manage Users</h1>
          <p className="text-sm text-gray-500 mt-1">View, edit, and manage all registered system users.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary btn-sm">+ Add User</button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13"
            viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="5.5" cy="5.5" r="4"/><path d="M9 9l2.5 2.5"/>
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users…" className="form-input pl-8 py-2 text-xs" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {['all', 'admin', 'doctor', 'patient'].map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${
                roleFilter === r
                  ? 'bg-primary text-white'
                  : 'bg-white border border-bdr text-gray-600 hover:border-primary hover:text-primary'
              }`}>
              {capitalize(r)}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-primary">
                <th className="th">#</th>
                <th className="th">User</th>
                <th className="th hidden sm:table-cell">Role</th>
                <th className="th hidden md:table-cell">Department</th>
                <th className="th hidden lg:table-cell">Joined</th>
                <th className="th">Status</th>
                <th className="th text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="td text-center text-gray-400 py-12">No users match your search.</td></tr>
              ) : filtered.map((u, i) => (
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
                  <td className="td text-gray-400 text-xs hidden lg:table-cell">{fmtDate(u.joined)}</td>
                  <td className="td">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${statusBadgeClass(u.status)}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="td text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button title="Edit" className="text-secondary hover:text-primary transition-colors p-1">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2l2 2-7 7H3v-2L10 2z"/></svg>
                      </button>
                      <button title="Delete" className="text-red-400 hover:text-red-600 transition-colors p-1">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3.5h10M5 3.5V2h4v1.5M4.5 3.5v8h5v-8"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 bg-primary rounded-t-lg">
              <h3 className="font-serif font-bold text-white text-base">Add New User</h3>
              <button onClick={() => setShowModal(false)} className="text-white/60 hover:text-white text-xl leading-none">×</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[['Full Name', 'text', 'Enter full name'], ['Username', 'text', 'Enter username'], ['Email', 'email', 'Enter email address']].map(([l, t, p]) => (
                <div key={l}>
                  <label className="form-label">{l}</label>
                  <input type={t} placeholder={p} className="form-input" />
                </div>
              ))}
              <div>
                <label className="form-label">Role</label>
                <select className="form-input">
                  <option>Patient</option><option>Doctor</option><option>Admin</option>
                </select>
              </div>
              <div>
                <label className="form-label">Department</label>
                <input type="text" placeholder="e.g. Cardiology (leave blank for patients)" className="form-input" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-bdr flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="btn-secondary btn-sm">Cancel</button>
              <button onClick={() => setShowModal(false)} className="btn-primary btn-sm">Create User</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
