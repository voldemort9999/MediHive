import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', role: 'patient' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError('Username and password are required.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await authService.register(form);
      alert('Account created successfully!');
      navigate('/login');
    } catch (apiErr) {
      // Fallback: store in localStorage so demo works without backend
      const existing = JSON.parse(localStorage.getItem('users')) || [];
      if (existing.find((u) => u.username === form.username)) {
        setError('Username already taken.');
        setLoading(false);
        return;
      }
      localStorage.setItem('users', JSON.stringify([
        ...existing,
        { id: Date.now(), ...form },
      ]));
      alert('Account created successfully!');
      navigate('/login');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bglight">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-primary">Create Account</h2>

        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 p-2 border rounded text-sm"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded text-sm"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <select
          className="w-full mb-4 p-2 border rounded text-sm"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
          <option value="family">Family</option>
        </select>

        <button disabled={loading} className="w-full bg-primary text-white p-2 rounded text-sm">
          {loading ? 'Creating...' : 'Sign Up'}
        </button>

        <p className="text-xs mt-3 text-center">
          Already have an account?{' '}
          <span className="text-blue-500 cursor-pointer" onClick={() => navigate('/login')}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
