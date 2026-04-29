import React from 'react';

export default function StatCard({ icon, label, value, sub, iconBg = 'bg-secondary/10', iconColor = 'text-secondary' }) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-textdark font-serif">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}
