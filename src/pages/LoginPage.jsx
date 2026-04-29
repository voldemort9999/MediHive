import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_ACCOUNTS } from '../utils/mockData';

export default function LoginPage() {
  const { login, isAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuth) navigate(from, { replace: true });
  }, [isAuth, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    // 🔥 Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // 🔍 Check registered users first
    let account = users.find(
      (u) =>
        u.username === username.trim() &&
        u.password === password
    );

    // 🔁 fallback to demo accounts (optional)
    if (!account) {
      account = DEMO_ACCOUNTS.find(
        (a) =>
          a.username === username.trim() &&
          a.password === password
      );
    }

    if (account) {
      const fakeToken = btoa(
        JSON.stringify({ id: account.id, role: account.role })
      );

      login(
        {
          id: account.id || Date.now(),
          name: account.username || account.name,
          role: account.role,
          username: account.username,
        },
        fakeToken
      );

      navigate(from, { replace: true });
    } else {
      setError('Invalid username or password.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bglight flex flex-col font-sans">

      {/* Top strip */}
      <div className="bg-primary text-white/40 text-[11px] py-1.5 text-center tracking-wide">
        Ministry of Health &amp; Family Welfare, Government of India — MediHive Portal
      </div>

      {/* Center */}
      <div className="flex-1 flex items-center justify-center p-5">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="font-serif font-bold text-primary text-2xl">
              MediHive
            </h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
              Medical Records Management System
            </p>
          </div>

          <div className="card p-8">
            <h2 className="font-serif font-semibold text-primary text-lg mb-1">
              Sign in to your account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5 mt-4">

              <input
                type="text"
                placeholder="Username"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="text-xs text-gray-500"
              >
                {showPw ? 'Hide Password' : 'Show Password'}
              </button>

              {error && (
                <p className="text-red-500 text-xs">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-6">
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.username}
                  onClick={() => {
                    setUsername(a.username);
                    setPassword(a.password);
                    setError('');
                  }}
                  className="block text-xs text-blue-500"
                >
                  {a.role}: {a.username} / {a.password}
                </button>
              ))}
            </div>
          </div>

          {/* Signup */}
          <div className="text-center mt-5">
            <p className="text-xs">
              Don’t have an account?{' '}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </span>
            </p>

            <Link
              to="/"
              className="text-xs text-secondary hover:text-primary"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-primary py-3 text-center">
        <p className="text-[10px] text-white/25">
          © 2026 MediHive
        </p>
      </div>
    </div>
  );
}