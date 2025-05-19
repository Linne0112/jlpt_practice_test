import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LayoutDefault from '../LayoutDefault';

import Home     from '../../page/Home';
import Exam     from '../../page/Exam';
import Test     from '../../page/Test';
import Login    from '../../page/Login';
import Register from '../../page/Register';

function AllRoute() {
  return (
    <Routes>
      {/* Public routes: không dùng layout chính */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      {/* Protected/App routes dùng layout chung */}
      <Route path="/" element={<LayoutDefault />}>
        {/* Trang chủ */}
        <Route index element={<Home />} />

        {/* Nhóm các route “exam” */}
        <Route path="exam">
          <Route index element={<Exam />} />              {/* /exam */}
          <Route path=":level" element={<Exam />} />     {/* /exam/:level */}
        </Route>

        {/* Test page */}
        <Route path="test/:examId" element={<Test />} />

        {/* Nếu vào 1 đường dẫn không khớp nào, bạn có thể redirect về Home */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Route>
    </Routes>
  );
}

export default AllRoute;
