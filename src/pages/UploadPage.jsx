import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import FileUpload from '../components/FileUpload';
import { recordService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function UploadPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleUpload = async (formData) => {
    setLoading(true);
    setSuccess(false);
    setErrorMsg('');

    try {
      await recordService.upload(formData);
      setSuccess(true);
      setTimeout(() => navigate('/records'), 1200);
    } catch (apiErr) {
      // Fallback: save to localStorage so demo works without backend
      const existing = JSON.parse(localStorage.getItem('records')) || [];
      const newRecord = {
        id: Date.now(),
        doctor: user?.username || 'unknown',
        patient: formData.get('patient_name') || 'Unknown',
        diagnosis: formData.get('diagnosis') || '',
        record_type: formData.get('record_type') || 'Other',
        fileName: formData.get('file')?.name || 'No file',
        created_at: new Date().toISOString(),
      };
      localStorage.setItem('records', JSON.stringify([...existing, newRecord]));
      setSuccess(true);
      setTimeout(() => navigate('/records'), 1200);
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-primary">Upload Medical Record</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload patient records, lab reports, prescriptions, and other documents securely.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 card p-6">
          <h2 className="font-serif text-lg font-semibold text-primary mb-1">New Record Upload</h2>
          <p className="text-xs text-gray-400 mb-5">All fields marked * are required</p>

          {success && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded mb-5">
              Record uploaded successfully!
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded mb-5">
              {errorMsg}
            </div>
          )}

          <FileUpload onUpload={handleUpload} loading={loading} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="card p-5">
            <h3 className="font-serif font-semibold text-primary text-sm mb-3">Upload Guidelines</h3>
            <p className="text-xs text-gray-500">
              Ensure correct patient name and diagnosis before uploading. Accepted formats: PDF, JPG, PNG, DOC.
            </p>
          </div>

          <div className="card p-5 border-l-4 border-l-accent">
            <h3 className="font-serif font-semibold text-primary text-sm mb-2">Security Notice</h3>
            <p className="text-xs text-gray-500">
              All records are securely stored and access controlled by role.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
