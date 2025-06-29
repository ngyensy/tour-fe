import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Đảm bảo đường dẫn chính xác
import { FaUserShield } from 'react-icons/fa'; // Icon admin từ react-icons
import { useNavigate } from 'react-router-dom'; // Hook để điều hướng

const NavAdmin = () => {
  const { admin, logoutAdmin } = useAuth(); // Lấy thông tin admin từ context
  const navigate = useNavigate(); // Khởi tạo navigate để điều hướng

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login'); // Điều hướng về trang đăng nhập admin
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-end items-center">

      {/* Icon admin bên phải */}
      <div className="flex items-center space-x-4">
      <div className="text-white text-lg">
        {admin ? `Xin chào, ${admin.name}` : 'Chưa đăng nhập'}
      </div>
        {admin && (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-500 transition duration-300"
          >
            Đăng xuất
          </button>
        )}
        <FaUserShield className="text-white text-2xl" />
      </div>
    </nav>
  );
};

export default NavAdmin;
