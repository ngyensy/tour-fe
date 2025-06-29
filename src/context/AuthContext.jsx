import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios'; // Nếu bạn cần gọi API để refresh token

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null); // Trạng thái cho refresh token

  // Lấy dữ liệu từ localStorage cho user và sessionStorage cho admin khi khởi tạo
  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    const userInfo = localStorage.getItem('user');
    const adminToken = sessionStorage.getItem('adminToken'); 
    const adminInfo = sessionStorage.getItem('admin'); 
    const savedRefreshToken = localStorage.getItem('refreshToken'); // Lấy refresh token

    if (userToken && userInfo) {
      setUser(JSON.parse(userInfo));
      console.log('User set in state:', JSON.parse(userInfo));
    }

    if (adminToken && adminInfo) {
      setAdmin(JSON.parse(adminInfo));
      console.log('Admin set in state:', JSON.parse(adminInfo));
    }

    if (savedRefreshToken) {
      setRefreshToken(savedRefreshToken); // Cập nhật refresh token
    }
  }, []);

  const Userlogin = (userData) => {
    setUser(userData);
    localStorage.setItem('userToken', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('refreshToken', userData.refreshToken); // Lưu refresh token
    console.log('User logged in:', userData);
  };

  const loginAdmin = (adminData) => {
    setAdmin(adminData);
    sessionStorage.setItem('adminToken', adminData.token);
    sessionStorage.setItem('admin', JSON.stringify(adminData));
    console.log('Admin logged in:', adminData);
  };

  const logoutUser = () => {
    setUser(null);
    setRefreshToken(null); // Xóa refresh token khi logout
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken'); // Xóa refresh token khỏi localStorage
    console.log('User logged out');
  };

  const logoutAdmin = () => {
    setAdmin(null);
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('admin');
    console.log('Admin logged out');
  };

  // Hàm refresh token
  const refreshUserToken = async () => {
    try {
      const response = await axios.post('http://localhost:4000/v1/auth/refresh-token', { refreshToken });
      
      if (response.data.Token) {
        // Cập nhật token
        setUser((prevUser) => ({
          ...prevUser,
          token: response.data.Token,
        }));
        localStorage.setItem('userToken', response.data.Token);
        console.log('Token refreshed:', response.data.Token);
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logoutUser(); // Đăng xuất người dùng nếu không thể refresh token
    }
  };

  // Hàm để cập nhật thông tin người dùng
  const updateUser = (newUserData) => {
    setUser((prevUser) => ({ ...prevUser, ...newUserData })); // Cập nhật trạng thái user với dữ liệu mới
    localStorage.setItem('user', JSON.stringify({ ...user, ...newUserData })); // Cập nhật thông tin người dùng trong localStorage
    console.log('User updated:', { ...user, ...newUserData });
  };

  return (
    <AuthContext.Provider value={{ user, admin, refreshToken, Userlogin, loginAdmin, logoutUser, logoutAdmin, refreshUserToken, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};

export default AuthProvider;
