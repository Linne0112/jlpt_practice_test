// src/components/ProtectedRoute/index.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Đảm bảo đúng đường dẫn tới AuthContext

// ProtectedRoute giờ đây nhận thêm prop 'allowedRoles'
// allowedRoles là một mảng các chuỗi, ví dụ: ['admin', 'client']
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth(); // Lấy thông tin user từ AuthContext

  // Bước 1: Kiểm tra xem người dùng đã đăng nhập chưa
  // Nếu chưa đăng nhập (user là null), chuyển hướng về trang /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  //  Kiểm tra vai trò của người dùng nếu 'allowedRoles' được cung cấp
  // - 'allowedRoles' tồn tại (nghĩa là route này yêu cầu quyền cụ thể)
  // 
  if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
    // Nếu người dùng đã đăng nhập nhưng không có quyền truy cập route này,
    // chuyển hướng họ về trang chủ (hoặc một trang báo lỗi "Không có quyền")
    return <Navigate to="/" replace />; // Ví dụ: chuyển về trang chủ
  }

  // Nếu người dùng đã đăng nhập và có quyền (hoặc route không yêu cầu quyền cụ thể),
  // thì hiển thị nội dung của route đó
  return children;
};

export default ProtectedRoute;
