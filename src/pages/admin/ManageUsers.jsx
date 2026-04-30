import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { userService } from '../../services/api';
import { MOCK_USERS } from '../../utils/mockData';
import { fmtDate, getInitials, roleBadgeClass, statusBadgeClass, capitalize } from '../../utils/helpers';

const emptyForm = {
  name: '',
  username: '',
  email: '',
  password: '',
  role: 'patient',
  department: '',
  status: 'Active',
};

const splitName = (name) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    first_name: parts.shift() || '',
    last_name: parts.join(' '),
  };
};

const normaliseUser = (user) => ({
  id: user.id,
  name: user.name || [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username,
  username: user.username,
  email: user.email || '',
  role: user.role || 'patient',
  department: user.department || (user.role === 'doctor' ? 'General Medicine' : ''),
  joined: user.joined || user.date_joined || user.joined_at,
  status: user.status || (user.is_active === false ? 'Inactive' : 'Active'),
  first_name: user.first_name || '',
  last_name: user.last_name || '',
});

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await userService.getAll();
      const apiUsers = Array.isArray(res.data?.results) ? res.data.results : res.data;
      setUsers(apiUsers.map(normaliseUser));
    } catch (err) {
      const localUsers = JSON.parse(localStorage.getItem('medihive_local_users') || '[]');
      setUsers([...MOCK_USERS, ...localUsers].map(normaliseUser));
      setError('Live user API is unavailable, so this page is using local demo data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => users.filter((user) => {
    const term = search.toLowerCase();
    const matchSearch = [user.name, user.username, user.email, user.department]
      .some((field) => (field || '').toLowerCase().includes(term));
    const matchRole = roleFilter === 'all' || user.role === roleFilter;
    return matchSearch && matchRole;
  }), [users, search, roleFilter]);

  const openCreateModal = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setError('');
    setNotice('');
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name || '',
      username: user.username || '',
      email: user.email || '',
      password: '',
      role: user.role || 'patient',
      department: user.department || '',
      status: user.status || 'Active',
    });
    setError('');
    setNotice('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setForm(emptyForm);
    setSaving(false);
  };

  const buildPayload = () => {
    const names = splitName(form.name);
    const payload = {
      username: form.username.trim(),
      email: form.email.trim(),
      role: form.role,
      department: form.department.trim(),
      status: form.status,
      ...names,
    };
    if (form.password.trim()) {
      payload.password = form.password;
    }
    return payload;
  };

  const saveLocalUser = (payload) => {
    const localUsers = JSON.parse(localStorage.getItem('medihive_local_users') || '[]');
    if (editingUser) {
      const updated = users.map((user) => (
        user.id === editingUser.id ? normaliseUser({ ...user, ...payload, name: form.name }) : user
      ));
      setUsers(updated);
      localStorage.setItem(
        'medihive_local_users',
        JSON.stringify(localUsers.map((user) => (
          user.id === editingUser.id ? normaliseUser({ ...user, ...payload, name: form.name }) : user
        ))),
      );
      return;
    }

    const created = normaliseUser({
      id: Date.now(),
      ...payload,
      name: form.name,
      joined: new Date().toISOString(),
    });
    localStorage.setItem('medihive_local_users', JSON.stringify([...localUsers, created]));
    setUsers((current) => [...current, created]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');

    if (!form.name.trim() || !form.username.trim()) {
      setError('Full name and username are required.');
      return;
    }
    if (!editingUser && !form.password.trim()) {
      setError('Password is required for new users.');
      return;
    }

    setSaving(true);
    const payload = buildPayload();

    try {
      if (editingUser) {
        const res = await userService.update(editingUser.id, payload);
        setUsers((current) => current.map((user) => (
          user.id === editingUser.id ? normaliseUser(res.data) : user
        )));
        setNotice('User updated successfully.');
      } else {
        const res = await userService.create(payload);
        setUsers((current) => [...current, normaliseUser(res.data)]);
        setNotice('User created successfully.');
      }
      closeModal();
    } catch (err) {
      if (err.response?.data) {
        setError(
          typeof err.response.data === 'string'
            ? err.response.data
            : Object.entries(err.response.data).map(([key, value]) => `${key}: ${value}`).join(' '),
        );
      } else {
        saveLocalUser(payload);
        closeModal();
        setNotice('Saved locally because the live API did not respond.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    const ok = window.confirm(`Delete ${user.name || user.username}?`);
    if (!ok) return;

    setError('');
    setNotice('');
    try {
      await userService.remove(user.id);
      setUsers((current) => current.filter((item) => item.id !== user.id));
      setNotice('User deleted successfully.');
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
        return;
      }

      const localUsers = JSON.parse(localStorage.getItem('medihive_local_users') || '[]')
        .filter((item) => item.id !== user.id);
      localStorage.setItem('medihive_local_users', JSON.stringify(localUsers));
      setUsers((current) => current.filter((item) => item.id !== user.id));
      setNotice('User removed from local demo data.');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">Manage Users</h1>
          <p className="text-sm text-gray-500 mt-1">View, edit, and manage all registered system users.</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary btn-sm">+ Add User</button>
      </div>

      {notice && <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded">{notice}</div>}
      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded">{error}</div>}

      <div className="card p-4 mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13"
            viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="5.5" cy="5.5" r="4"/><path d="M9 9l2.5 2.5"/>
          </svg>
          <input value={search} onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users..." className="form-input pl-8 py-2 text-xs" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {['all', 'admin', 'doctor', 'patient', 'family'].map((role) => (
            <button key={role} onClick={() => setRoleFilter(role)}
              className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${
                roleFilter === role
                  ? 'bg-primary text-white'
                  : 'bg-white border border-bdr text-gray-600 hover:border-primary hover:text-primary'
              }`}>
              {capitalize(role)}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
      </div>

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
              {loading ? (
                <tr><td colSpan={7} className="td text-center text-gray-400 py-12">Loading users...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="td text-center text-gray-400 py-12">No users match your search.</td></tr>
              ) : filtered.map((user, index) => (
                <tr key={user.id}
                  className={`border-b border-bdr hover:bg-blue-50/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-bglight'}`}>
                  <td className="td text-gray-400 font-mono text-xs">{String(index + 1).padStart(2, '0')}</td>
                  <td className="td">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold flex-shrink-0">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-textdark">{user.name}</p>
                        <p className="text-[10px] text-gray-400">{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="td hidden sm:table-cell">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${roleBadgeClass(user.role)}`}>
                      {capitalize(user.role)}
                    </span>
                  </td>
                  <td className="td text-gray-500 text-xs hidden md:table-cell">{user.department || '-'}</td>
                  <td className="td text-gray-400 text-xs hidden lg:table-cell">{fmtDate(user.joined)}</td>
                  <td className="td">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${statusBadgeClass(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="td text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button title="Edit" onClick={() => openEditModal(user)}
                        className="text-secondary hover:text-primary transition-colors p-1">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2l2 2-7 7H3v-2L10 2z"/></svg>
                      </button>
                      <button title="Delete" onClick={() => handleDelete(user)}
                        className="text-red-400 hover:text-red-600 transition-colors p-1">
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

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={closeModal}>
          <form className="bg-white rounded-lg shadow-xl max-w-md w-full" onSubmit={handleSubmit}
            onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 bg-primary rounded-t-lg">
              <h3 className="font-serif font-bold text-white text-base">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button type="button" onClick={closeModal} className="text-white/60 hover:text-white text-xl leading-none">x</button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="form-label">Full Name *</label>
                <input className="form-input" value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Enter full name" />
              </div>
              <div>
                <label className="form-label">Username *</label>
                <input className="form-input" value={form.username}
                  onChange={(event) => setForm({ ...form, username: event.target.value })}
                  placeholder="Enter username" />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input type="email" className="form-input" value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="Enter email address" />
              </div>
              <div>
                <label className="form-label">{editingUser ? 'New Password' : 'Password *'}</label>
                <input type="password" className="form-input" value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  placeholder={editingUser ? 'Leave blank to keep current password' : 'Set password'} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Role</label>
                  <select className="form-input" value={form.role}
                    onChange={(event) => setForm({ ...form, role: event.target.value })}>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="family">Family</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Status</label>
                  <select className="form-input" value={form.status}
                    onChange={(event) => setForm({ ...form, status: event.target.value })}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Department</label>
                <input className="form-input" value={form.department}
                  onChange={(event) => setForm({ ...form, department: event.target.value })}
                  placeholder="e.g. Cardiology" />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>
            <div className="px-6 py-4 border-t border-bdr flex justify-end gap-3">
              <button type="button" onClick={closeModal} className="btn-secondary btn-sm">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary btn-sm">
                {saving ? 'Saving...' : editingUser ? 'Save Changes' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}
