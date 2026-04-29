export const DEMO_ACCOUNTS = [
  { username: 'admin',   password: 'admin123',   role: 'admin',   name: 'System Administrator', id: 0 },
  { username: 'doctor',  password: 'doctor123',  role: 'doctor',  name: 'Dr. Priya Sharma',     id: 1 },
  { username: 'patient', password: 'patient123', role: 'patient', name: 'Rohan Mehta',           id: 2 },
];

export const MOCK_USERS = [
  { id:1, name:'Dr. Priya Sharma', username:'priya.sharma', role:'doctor',  department:'Cardiology',  status:'Active',   joined:'2023-01-15' },
  { id:2, name:'Rohan Mehta',      username:'rohan.mehta',  role:'patient', department:'—',           status:'Active',   joined:'2023-06-20' },
  { id:3, name:'Dr. Anil Kumar',   username:'anil.kumar',   role:'doctor',  department:'Neurology',   status:'Active',   joined:'2022-11-05' },
  { id:4, name:'Sneha Iyer',       username:'sneha.iyer',   role:'patient', department:'—',           status:'Inactive', joined:'2024-02-10' },
  { id:5, name:'Dr. Meera Nair',   username:'meera.nair',   role:'doctor',  department:'Orthopedics', status:'Active',   joined:'2023-08-22' },
  { id:6, name:'Arjun Singh',      username:'arjun.singh',  role:'patient', department:'—',           status:'Active',   joined:'2024-01-07' },
];

export const MOCK_RECORDS = [
  { id:1, patientName:'Rohan Mehta',  diagnosis:'Hypertension Stage II',    doctor:'Dr. Priya Sharma', date:'2024-03-14', type:'Prescription',      status:'Final' },
  { id:2, patientName:'Sneha Iyer',   diagnosis:'Migraine — Chronic',       doctor:'Dr. Anil Kumar',   date:'2024-03-10', type:'Lab Report',         status:'Final' },
  { id:3, patientName:'Arjun Singh',  diagnosis:'ACL Tear — Left Knee',     doctor:'Dr. Meera Nair',   date:'2024-02-28', type:'MRI Report',         status:'Draft' },
  { id:4, patientName:'Rohan Mehta',  diagnosis:'Diabetes Type 2 Follow-up',doctor:'Dr. Priya Sharma', date:'2024-02-15', type:'Lab Report',         status:'Final' },
  { id:5, patientName:'Arjun Singh',  diagnosis:'Post-Op Assessment',        doctor:'Dr. Meera Nair',   date:'2024-04-01', type:'Discharge Summary',  status:'Final' },
  { id:6, patientName:'Sneha Iyer',   diagnosis:'Anxiety Disorder — GAD',   doctor:'Dr. Anil Kumar',   date:'2024-03-25', type:'Prescription',       status:'Final' },
];

export const MOCK_PATIENTS = [
  { id:2, name:'Rohan Mehta', age:42, gender:'Male', bloodGroup:'O+', phone:'+91 98765 43210', lastVisit:'2024-03-14', condition:'Hypertension' },
  { id:6, name:'Arjun Singh', age:28, gender:'Male', bloodGroup:'B+', phone:'+91 87654 32109', lastVisit:'2024-04-01', condition:'ACL Tear'      },
];

export const ANNOUNCEMENTS = [
  'System maintenance scheduled on 15 Apr 2026, 02:00–04:00 AM IST.',
  'New: Bulk record download now available for Doctors.',
  'All users must complete annual security training by 30 Apr 2026.',
];
