import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import RecordTable from '../components/RecordTable';
import { useAuth } from '../context/AuthContext';
import { downloadText, statusBadgeClass } from '../utils/helpers';

export default function RecordsPage() {
  const { user } = useAuth();
  const [modal, setModal] = useState(null);
  const [records, setRecords] = useState([]);

  // 🔥 Load records from localStorage
  useEffect(() => {
    const allRecords =
      JSON.parse(localStorage.getItem("records")) || [];

    let filtered = [];

    if (user?.role === "doctor") {
      filtered = allRecords.filter(
        (r) => r.doctor === user.username
      );
    } else if (user?.role === "patient") {
      filtered = allRecords.filter(
        (r) => r.patient === user.username
      );
    } else {
      filtered = allRecords; // admin
    }

    setRecords(filtered);
  }, [user]);

  // 🔥 Download
  const handleDownload = (r) => {
    downloadText(
      `MediHive Medical Record\n${'='.repeat(40)}
Patient:   ${r.patient}
Diagnosis: ${r.diagnosis}
Doctor:    ${r.doctor}
Type:      ${r.recordType}
Date:      ${new Date(r.createdAt).toLocaleDateString()}`,
      `medihive_record_${r.id}.txt`
    );
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-primary">
            {user?.role === 'patient' ? 'My Records' : 'Medical Records'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {user?.role === 'patient'
              ? 'Your complete medical history on file.'
              : `All records in the system — ${records.length} total.`}
          </p>
        </div>

        {user?.role !== 'patient' && (
          <Link to="/upload" className="btn-primary btn-sm flex items-center gap-1.5">
            Upload Record
          </Link>
        )}
      </div>

      {/* 🔥 Map data to match your existing table structure */}
      <RecordTable
        records={records.map((r) => ({
          ...r,
          patientName: r.patient,
          type: r.recordType,
          date: new Date(r.createdAt).toLocaleDateString(),
          status: "Completed"
        }))}
        onDownload={handleDownload}
        onView={setModal}
        showPatient={user?.role !== 'patient'}
      />

      {/* Modal */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5">

              {[
                ['Patient Name', modal.patient],
                ['Diagnosis', modal.diagnosis],
                ['Doctor', modal.doctor],
                ['Record Type', modal.recordType],
                ['Date', new Date(modal.createdAt).toLocaleDateString()],
              ].map(([label, val]) => (
                <div key={label} className="py-2 border-b">
                  <b>{label}:</b> {val}
                </div>
              ))}

            </div>

            <div className="p-4 flex justify-end gap-3">
              <button onClick={() => setModal(null)}>Close</button>
              <button
                onClick={() => {
                  handleDownload(modal);
                  setModal(null);
                }}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}