import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { patientService, recordService } from '../../services/api';
import { MOCK_PATIENTS, MOCK_RECORDS } from '../../utils/mockData';
import { fmtDate, getInitials, statusBadgeClass } from '../../utils/helpers';

const normalisePatient = (patient) => ({
  id: patient.id,
  name: patient.name || [patient.first_name, patient.last_name].filter(Boolean).join(' ') || patient.username,
  username: patient.username,
  age: patient.age || '-',
  gender: patient.gender || '-',
  bloodGroup: patient.bloodGroup || '-',
  phone: patient.phone || '-',
  lastVisit: patient.lastVisit || patient.joined,
  condition: patient.condition || 'General care',
});

const normaliseRecord = (record) => ({
  id: record.id,
  patientName: record.patient_display || record.patientName || String(record.patient || ''),
  diagnosis: record.diagnosis,
  type: record.record_type || record.type,
  date: record.created_at || record.date,
  status: record.status || 'Final',
});

export default function Patients() {
  const [selected, setSelected] = useState(null);
  const [patients, setPatients] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPatients = async () => {
      setLoading(true);
      setError('');
      try {
        const [patientsRes, recordsRes] = await Promise.all([
          patientService.getAssigned(),
          recordService.getAll(),
        ]);
        const apiPatients = Array.isArray(patientsRes.data?.results) ? patientsRes.data.results : patientsRes.data;
        const apiRecords = Array.isArray(recordsRes.data?.results) ? recordsRes.data.results : recordsRes.data;
        setPatients(apiPatients.map(normalisePatient));
        setRecords(apiRecords.map(normaliseRecord));
      } catch (err) {
        setPatients(MOCK_PATIENTS.map(normalisePatient));
        setRecords(MOCK_RECORDS.map(normaliseRecord));
        setError('Live patient API is unavailable, so this page is using local demo data.');
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

  const patientRecords = useMemo(() => (
    selected ? records.filter((record) => record.patientName === selected.name || record.patientName === selected.username) : []
  ), [records, selected]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-primary">My Patients</h1>
        <p className="text-sm text-gray-500 mt-1">Patients currently assigned to you for care.</p>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div>
          <h2 className="font-serif text-base font-semibold text-primary mb-3">
            Patient List <span className="text-gray-400 font-sans font-normal text-xs">({patients.length})</span>
          </h2>
          <div className="space-y-3">
            {loading ? (
              <div className="card p-6 text-center text-sm text-gray-400">Loading patients...</div>
            ) : patients.length === 0 ? (
              <div className="card p-6 text-center text-sm text-gray-400">No assigned patients yet.</div>
            ) : patients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => setSelected(patient)}
                className={`w-full card p-4 text-left hover:border-secondary transition-colors ${
                  selected?.id === patient.id ? 'border-secondary border-2' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-secondary font-bold text-sm flex-shrink-0">
                    {getInitials(patient.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-textdark truncate">{patient.name}</p>
                    <p className="text-xs text-gray-400">{patient.age}y / {patient.gender} / {patient.bloodGroup}</p>
                    <p className="text-xs text-secondary mt-0.5">{patient.condition}</p>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#328CC1" strokeWidth="1.5">
                    <path d="M4 2l4 4-4 4"/>
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="space-y-5">
              <div className="card p-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {getInitials(selected.name)}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-serif font-bold text-primary text-lg">{selected.name}</h2>
                    <p className="text-sm text-gray-500">{selected.age} years old / {selected.gender}</p>
                    <div className="flex flex-wrap gap-3 mt-3">
                      {[
                        ['Blood Group', selected.bloodGroup, 'text-red-600'],
                        ['Phone', selected.phone, 'text-textdark'],
                        ['Last Visit', fmtDate(selected.lastVisit), 'text-textdark'],
                        ['Condition', selected.condition, 'text-secondary'],
                      ].map(([label, value, cls]) => (
                        <div key={label} className="bg-bglight border border-bdr rounded px-3 py-2">
                          <p className="text-[9px] text-gray-400 uppercase tracking-wider">{label}</p>
                          <p className={`text-xs font-semibold mt-0.5 ${cls}`}>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-serif text-base font-semibold text-primary mb-3">
                  Medical Records <span className="text-gray-400 font-sans font-normal text-xs">({patientRecords.length})</span>
                </h2>
                <div className="card overflow-hidden divide-y divide-bdr">
                  {patientRecords.length === 0 ? (
                    <p className="text-center text-sm text-gray-400 py-10">No records for this patient.</p>
                  ) : patientRecords.map((record, index) => (
                    <div key={record.id}
                      className={`flex items-start gap-3 px-4 py-3 ${index % 2 === 0 ? 'bg-white' : 'bg-bglight'}`}>
                      <div className="w-8 h-8 rounded bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#328CC1" strokeWidth="1.5">
                          <path d="M3 2h6l3 3v7a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1zm4 0v4h3"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-textdark">{record.diagnosis}</p>
                        <p className="text-[11px] text-gray-400">{record.type} / {fmtDate(record.date)}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0 ${statusBadgeClass(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-12 flex flex-col items-center justify-center text-center h-64">
              <svg className="text-gray-200 mb-4" width="48" height="48" viewBox="0 0 48 48"
                fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="20" cy="16" r="10"/><path d="M4 44a16 16 0 0132 0M36 20h8M40 16v8"/>
              </svg>
              <p className="text-sm text-gray-400">Select a patient to view their details and records.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
