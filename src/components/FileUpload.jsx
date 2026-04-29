import React, { useState, useRef } from 'react';

export default function FileUpload({ onUpload, loading = false }) {
  const [drag, setDrag]         = useState(false);
  const [file, setFile]         = useState(null);
  const [patient, setPatient]   = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [type, setType]         = useState('Prescription');
  const [error, setError]       = useState('');
  const ref = useRef();

  const pick = (f) => {
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { setError('File must be under 10 MB.'); return; }
    setFile(f); setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false);
    pick(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file)             { setError('Please select a file.'); return; }
    if (!patient.trim())   { setError('Patient name is required.'); return; }
    if (!diagnosis.trim()) { setError('Diagnosis is required.'); return; }
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('patient_name', patient);
    fd.append('diagnosis', diagnosis);
    fd.append('record_type', type);
    if (onUpload) onUpload(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Drop Zone */}
      <div
        onDragEnter={(e) => { e.preventDefault(); setDrag(true); }}
        onDragOver={(e)  => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => !file && ref.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${drag ? 'border-secondary bg-secondary/5' : 'border-bdr hover:border-secondary hover:bg-blue-50/20'}
          ${!file ? 'cursor-pointer' : ''}`}
      >
        <input ref={ref} type="file" className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={(e) => pick(e.target.files[0])} />

        {file ? (
          <div className="flex items-center justify-between bg-primary/5 border border-primary/15 rounded px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div className="text-left">
                <p className="text-sm font-medium text-textdark truncate max-w-xs">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="text-red-400 hover:text-red-600 text-xl leading-none">×</button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#328CC1" strokeWidth="1.8">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-sm font-semibold text-primary">Drag & drop a file here</p>
            <p className="text-xs text-gray-400 mt-1">
              or <span className="text-secondary underline">click to browse</span>
            </p>
            <p className="text-xs text-gray-300 mt-2">PDF, JPG, PNG, DOC · max 10 MB</p>
          </>
        )}
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Patient Name *</label>
          <input className="form-input" value={patient}
            onChange={(e) => setPatient(e.target.value)} placeholder="Full name" />
        </div>
        <div>
          <label className="form-label">Record Type</label>
          <select className="form-input" value={type} onChange={(e) => setType(e.target.value)}>
            {['Prescription','Lab Report','MRI Report','X-Ray Report','Discharge Summary','Consultation Note','Other']
              .map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="form-label">Diagnosis / Notes *</label>
        <textarea className="form-input resize-none" rows={3} value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)} placeholder="Primary diagnosis or brief notes" />
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 10V2M4 7l3 3 3-3M1 12h12" strokeLinecap="round"/>
              </svg>
              Upload Record
            </>
          )}
        </button>
      </div>
    </form>
  );
}
