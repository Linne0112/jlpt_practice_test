// src/contexts/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
  if (username === 'admin' && password === 'admin') {
    setUser({ name: 'admin' });
    return true;
  }

  if (username === 'client' && password === '123') {
    setUser({ name: 'client' });
    return true;
  }

  return false;
};


  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
