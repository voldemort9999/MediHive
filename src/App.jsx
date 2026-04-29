import React from 'react';
import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // ✅ FIXED
import DashboardRouter from './pages/DashboardRouter';
import RecordsPage from './pages/RecordsPage';
import UploadPage from './pages/UploadPage';
import ManageUsers from './pages/admin/ManageUsers';
import Patients from './pages/doctor/Patients';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />

          <Route
            path="/records"
            element={
              <ProtectedRoute>
                <RecordsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <ProtectedRoute allowedRoles={['admin', 'doctor']}>
                <UploadPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor/patients"
            element={
              <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                <Patients />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}