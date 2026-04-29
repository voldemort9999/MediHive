import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard   from './admin/AdminDashboard';
import DoctorDashboard  from './doctor/DoctorDashboard';
import PatientDashboard from './patient/PatientDashboard';

export default function DashboardRouter() {
  const { user } = useAuth();
  switch (user?.role) {
    case 'admin':   return <AdminDashboard />;
    case 'doctor':  return <DoctorDashboard />;
    case 'patient': return <PatientDashboard />;
    default:        return <PatientDashboard />;
  }
}