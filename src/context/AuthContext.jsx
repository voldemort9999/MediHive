import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const t = localStorage.getItem('medihive_token');
      const u = localStorage.getItem('medihive_user');

      if (t && u) {
        setToken(t);
        setUser(JSON.parse(u));
      }
    } catch (err) {
      console.error("Auth load error:", err);
    }

    setLoading(false);
  }, []);

  const login = (userData, jwt) => {
    setUser(userData);
    setToken(jwt);

    // 🔥 Store in both formats (IMPORTANT)
    localStorage.setItem('medihive_token', jwt);
    localStorage.setItem('medihive_user', JSON.stringify(userData));

    // 🔥 ALSO store simplified user (used by UploadPage etc.)
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem('medihive_token');
    localStorage.removeItem('medihive_user');

    // 🔥 also clear this
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        isAuth: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};