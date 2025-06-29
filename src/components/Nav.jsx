import React, { useState, useEffect, useRef } from 'react'; // Thêm useEffect và useRef
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../context/AuthContext'; // Import AuthContext
import logo from '../assets/logo.png';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <>
      {/* Thanh điều hướng cố định */}
      <nav className="bg-gray-100 py-3 px-36 fixed top-0 left-0 w-full z-50 shadow-md">
        <div className="container mx-auto flex items-center h-12">
          <Link to="/" className="flex items-center mr-auto">
            <img src={logo} alt="Logo" className="h-24" />
          </Link>

          <div className="flex items-center space-x-32">
            <ul className="flex space-x-10">
              <li>
                <Link to="/TourList" className="text-black hover:text-gray-600 text-lg">
                  TOURS
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-black hover:text-gray-600 text-lg">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-black hover:text-gray-600 text-lg">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/Doi-thuong" className="text-black hover:text-gray-600 text-lg">
                  Đổi thưởng
                </Link>
              </li>
            </ul>

            {user ? (
              <div className="flex items-center relative">
                <img
                  src={`http://localhost:4000${user.avatar}`}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full cursor-pointer border border-black"
                  onClick={() => setMenuOpen(!menuOpen)}
                />

                {menuOpen && (
                  <div
                    ref={menuRef}
                    className="absolute left-0 top-12 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10"
                  >
                    <Link to="/account-info" className="block px-4 py-2 text-black hover:bg-blue-300">
                      Thông tin người dùng
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-black hover:bg-blue-300"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-black hover:text-gray-600 flex items-center justify-center w-9 h-9 bg-white border-2 border-black rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Thêm khoảng trống phía trên nội dung để tránh bị che */}
      <div className="pt-24">
        {/* Nội dung chính ở đây */}
      </div>
    </>
  );
};

export default Navbar;

