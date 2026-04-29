export const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const getInitials = (name) =>
  (name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

export const capitalize = (s) => (s ? s[0].toUpperCase() + s.slice(1) : '');

export const roleBadgeClass = (role) => ({
  admin:   'badge-role-admin',
  doctor:  'badge-role-doctor',
  patient: 'badge-role-patient',
}[role] || 'bg-gray-100 text-gray-600');

export const statusBadgeClass = (status) => ({
  final:    'badge-status-final',
  active:   'badge-status-active',
  inactive: 'badge-status-inactive',
  draft:    'badge-status-draft',
}[(status || '').toLowerCase()] || 'bg-gray-100 text-gray-600');

export const downloadText = (content, filename) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
  a.download = filename;
  a.click();
};
