// src/contexts/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// 1. Tạo context
const AuthContext = createContext();

// 2. Provider bọc toàn app
export const AuthProvider = ({ children }) => {
  // user = null nghĩa là chưa login
  const [user, setUser] = useState(null);

  // Hàm login (ở đây mock,  thay API thật vào)
  const login = async (username, password) => {
    // Ví dụ giả lập gọi API:
    // const res = await fetch('/api/login', { ... })
    // if (res.ok) { setUser(res.user); return true; }
    if (username === 'client' && password === '123') {
      setUser({ name: 'Client' });
      return true;
    }
    return false;
  };

  // Hàm logout
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook tiện lợi để dùng context
export const useAuth = () => useContext(AuthContext);
