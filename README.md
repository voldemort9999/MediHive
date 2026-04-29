# MediHive — React + Tailwind CSS Frontend

## Quick Setup (copy-paste these commands)

```bash
# 1. Extract this zip and open the folder in VS Code terminal

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

The app opens at **http://localhost:3000**

---

## Demo Login Credentials

| Role    | Username  | Password    |
|---------|-----------|-------------|
| Admin   | admin     | admin123    |
| Doctor  | doctor    | doctor123   |
| Patient | patient   | patient123  |

---

## Folder Structure

```
src/
├── components/
│   ├── DashboardLayout.jsx   ← Navbar + Sidebar wrapper
│   ├── FileUpload.jsx        ← Drag & drop upload component
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx    ← Auth guard
│   ├── RecordTable.jsx       ← Reusable records table
│   ├── Sidebar.jsx           ← Role-based sidebar
│   └── StatCard.jsx
├── context/
│   └── AuthContext.jsx       ← JWT auth state (login/logout)
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   └── ManageUsers.jsx
│   ├── doctor/
│   │   ├── DoctorDashboard.jsx
│   │   └── Patients.jsx
│   ├── patient/
│   │   └── PatientDashboard.jsx
│   ├── DashboardRouter.jsx   ← Redirects by role
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── NotFound.jsx
│   ├── RecordsPage.jsx
│   └── UploadPage.jsx
├── services/
│   └── api.js                ← Axios + JWT interceptor (Django backend)
├── utils/
│   ├── helpers.js
│   └── mockData.js
├── App.jsx                   ← Routes
├── index.css                 ← Tailwind directives
└── index.js
```

---

## Connecting to Django Backend

In `src/services/api.js`, the base URL is already set:

```js
baseURL: 'http://localhost:8000/api'
```

Replace the mock login in `LoginPage.jsx` with the real API call:

```js
// Remove the DEMO_ACCOUNTS check and use:
const res = await authService.login({ username, password });
login(res.data.user, res.data.token);
```

Your Django JWT endpoint should return:
```json
{ "token": "eyJ...", "user": { "id": 1, "name": "...", "role": "admin" } }
```

---

## Color Theme

| Variable   | Hex       | Usage             |
|------------|-----------|-------------------|
| Primary    | `#0B3C5D` | Nav, headers      |
| Secondary  | `#328CC1` | Accents, links    |
| Accent     | `#D9B310` | Gold highlights   |
| Background | `#F4F7FA` | Page background   |
| Border     | `#E0E0E0` | Card borders      |
