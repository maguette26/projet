import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    role: localStorage.getItem('role') || null,
    email: localStorage.getItem('email') || null
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setUser({
        role: localStorage.getItem('role'),
        email: localStorage.getItem('email')
      });
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (role, email) => {
    localStorage.setItem('role', role);
    localStorage.setItem('email', email);
    setUser({ role, email });
  };

  const logout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    setUser({ role: null, email: null });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};