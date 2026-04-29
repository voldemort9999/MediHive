import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import RecordTable from '../components/RecordTable';
import { useAuth } from '../context/AuthContext';
import { recordService } from '../services/api';
import { downloadText } from '../utils/helpers';
import { MOCK_RECORDS } from '../utils/mockData';

export default function RecordsPage() {
  const { user } = useAuth();
  const [modal, setModal] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    recordService.getAll()
      .then((res) => setRecords(res.data))
      .catch(() => {
        // Fallback to mock data when backend not reachable
        const filtered = user?.role === 'doctor'
          ? MOCK_RECORDS.filter((r) => r.doctor === user?.name)
          : user?.role === 'patient'
          ? MOCK_RECORDS.filter((r) => r.patientName === user?.name)
          : MOCK_RECORDS;
        setRecords(filtered.map((r) => ({
          id: r.id,
          patient_display: r.patientName,
          diagnosis: r.diagnosis,
          doctor_display: r.doctor,
          record_type: r.type,
          created_at: r.date,
          status: r.status,
        })));
      });
  }, [user]);

  // Normalise both API records and mock records into one shape for the table
  const normalised = records.map((r) => ({
    id: r.id,
    patientName: r.patient_display || r.patientName || String(r.patient || ''),
    diagnosis:   r.diagnosis,
    doctor:      r.doctor_display  || r.doctor      || String(r.doctor  || ''),
    type:        r.record_type     || r.type,
    date:        r.created_at      || r.date,
    status:      r.status          || 'Final',
    _raw: r,
  }));

  const handleDownload = (r) => {
    downloadText(
      `MediHive Medical Record\n${'='.repeat(40)}
Patient:   ${r.patientName}
Diagnosis: ${r.diagnosis}
Doctor:    ${r.doctor}
Type:      ${r.type}
Date:      ${new Date(r.date).toLocaleDateString()}`,
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
              : `All records in the system — ${normalised.length} total.`}
          </p>
        </div>
        {user?.role !== 'patient' && (
          <Link to="/upload" className="btn-primary btn-sm flex items-center gap-1.5">
            Upload Record
          </Link>
        )}
      </div>

      <RecordTable
        records={normalised}
        onDownload={handleDownload}
        onView={setModal}
        showPatient={user?.role !== 'patient'}
      />

      {modal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 space-y-2">
              {[
                ['Patient',     modal.patientName],
                ['Diagnosis',   modal.diagnosis],
                ['Doctor',      modal.doctor],
                ['Record Type', modal.type],
                ['Date',        new Date(modal.date).toLocaleDateString()],
                ['Status',      modal.status],
              ].map(([label, val]) => (
                <div key={label} className="py-2 border-b border-bdr">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">{label}: </span>
                  <span className="text-sm text-textdark">{val}</span>
                </div>
              ))}
            </div>
            <div className="p-4 flex justify-end gap-3">
              <button onClick={() => setModal(null)} className="btn-secondary btn-sm">Close</button>
              <button
                onClick={() => { handleDownload(modal); setModal(null); }}
                className="btn-primary btn-sm"
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
