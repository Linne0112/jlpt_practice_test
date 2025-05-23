// src/components/AllRoute/index.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LayoutDefault from '../LayoutDefault';

import Home from '../../page/Home';
import Exam from '../../page/Exam';
import Test from '../../page/Test';
import Login from '../../page/Login';
import Register from '../../page/Register';
import Account from '../../page/Account';

import ProtectedRoute from '../ProtectedRoute';

// 👇 Admin pages
import AdminHome from '../../page/Admin/Home';
import AdminExamList from '../../page/Admin/ExamList';
import AdminExamDetail from '../../page/Admin/ExamDetail';
import QuestionForm from '../../page/Admin/QuestionForm';

const AllRoute = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected USER routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <LayoutDefault />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="exam">
          <Route index element={<Exam />} />
          <Route path=":level" element={<Exam />} />
        </Route>
        <Route path="test/:examId" element={<Test />} />
        <Route path="account" element={<Account />} />
      </Route>

      {/* ✅ Protected ADMIN routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <LayoutDefault />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="exam/:level" element={<AdminExamList />} />
        <Route path="exam/:level/:examId" element={<AdminExamDetail />} />
        <Route path="exam/:level/:examId/add-question" element={<QuestionForm />} />
      </Route>
    </Routes>
  );
};

export default AllRoute;
