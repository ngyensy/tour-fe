import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, isAdminRoute }) => {
  const { user, admin } = useAuth(); 

  // Kiểm tra nếu là route dành cho admin và chưa đăng nhập
  if (isAdminRoute && !admin) {
    return <Navigate to="/admin/login" />; // Điều hướng đến trang đăng nhập admin
  }

  // Kiểm tra nếu là route dành cho user và chưa đăng nhập
  if (!isAdminRoute && !user) {
    return <Navigate to="/login" />; // Điều hướng đến trang đăng nhập user
  }

  return children;
};

export default ProtectedRoute;
