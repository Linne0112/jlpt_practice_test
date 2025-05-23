// src/contexts/AuthContext.js
import React, { createContext, useState, useContext } from 'react';


// src/contexts/AuthContext.js
import {createUserWithEmailAndPassword ,signInWithEmailAndPassword, getIdToken } from 'firebase/auth';
import { auth } from '../firebase'; // đường dẫn tùy thuộc cấu trúc dự án
import axios from 'axios';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const register = async (email, password) => {
    try {
      // Tạo user mới trên Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Lấy Firebase ID Token
      const firebaseToken = await getIdToken(firebaseUser);

      // Gửi token lên backend để tạo tài khoản / trả về JWT nếu có backend
      const res = await axios.post('http://localhost:8080/api/auth/register', {
        firebaseToken: firebaseToken
      });

      const registerResponse = res.data;
      setUser(registerResponse.user);
      localStorage.setItem("accessToken", registerResponse.accessToken);
      localStorage.setItem("refreshToken", registerResponse.refreshToken);

      return true;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      // Đăng nhập Firebase bằng email/password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Lấy Firebase ID Token
      const firebaseToken = await getIdToken(firebaseUser);

      // Gửi token lên backend để xác thực và lấy JWT
      const res = await axios.post('http://localhost:8080/api/auth/login', {
        firebaseToken: firebaseToken
      });

      const loginResponse = res.data;
      setUser(loginResponse.user); // {uid, email, role}
      // Optional: lưu accessToken, refreshToken nếu cần
      localStorage.setItem("accessToken", loginResponse.accessToken);
      localStorage.setItem("refreshToken", loginResponse.refreshToken);

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, register,logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
