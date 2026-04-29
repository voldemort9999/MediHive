import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import FileUpload from '../components/FileUpload';

export default function UploadPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleUpload = async (formData) => {
    setLoading(true);
    setSuccess(false);

    try {
      // 🔥 Get logged-in user
      const user = JSON.parse(localStorage.getItem("user"));

      // 🔥 Get existing records
      const existingRecords =
        JSON.parse(localStorage.getItem("records")) || [];

      // 🔥 Create new record
      const newRecord = {
        id: Date.now(),
        doctor: user?.username || "unknown",
        patient: formData.patientName,
        diagnosis: formData.diagnosis,
        recordType: formData.recordType,
        fileName: formData.file?.name || "No file",
        createdAt: new Date().toISOString(),
      };

      // 🔥 Save
      localStorage.setItem(
        "records",
        JSON.stringify([...existingRecords, newRecord])
      );

      // Simulate delay (optional)
      await new Promise((r) => setTimeout(r, 800));

      setSuccess(true);

      // 🔥 Auto redirect after success
      setTimeout(() => {
        navigate("/records");
      }, 1200);

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-primary">
          Upload Medical Record
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload patient records, lab reports, prescriptions, and other documents securely.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Upload form */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="font-serif text-lg font-semibold text-primary mb-1">
            New Record Upload
          </h2>
          <p className="text-xs text-gray-400 mb-5">
            All fields marked * are required
          </p>

          {success && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded mb-5">
              Record uploaded successfully!
            </div>
          )}

          <FileUpload onUpload={handleUpload} loading={loading} />
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">

          <div className="card p-5">
            <h3 className="font-serif font-semibold text-primary text-sm mb-3">
              Upload Guidelines
            </h3>
            <p className="text-xs text-gray-500">
              Ensure correct patient name and diagnosis before uploading.
            </p>
          </div>

          <div className="card p-5 border-l-4 border-l-accent">
            <h3 className="font-serif font-semibold text-primary text-sm mb-2">
              Security Notice
            </h3>
            <p className="text-xs text-gray-500">
              All records are securely stored and access controlled.
            </p>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}