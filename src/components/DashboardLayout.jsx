import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen bg-bglight">
      <Navbar onToggleSidebar={() => setOpen((v) => !v)} />
      <Sidebar open={open} />
      <main
        className="pt-14 transition-all duration-200"
        style={{ marginLeft: open ? 220 : 0 }}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
