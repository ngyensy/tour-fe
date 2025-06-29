import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faPlane, faUsers, faTags, faCalendarAlt, faComments, faSuitcase, faMoneyCheckAlt } from '@fortawesome/free-solid-svg-icons';
import { NavLink, Outlet } from 'react-router-dom';
import NavAdmin from './components/NavAdmin';
import React, { useState } from 'react';

const AdminLayout = React.memo(() => {
  const [isTourSubmenuOpen, setIsTourSubmenuOpen] = useState(false);

  const toggleTourSubmenu = () => {
    setIsTourSubmenuOpen(!isTourSubmenuOpen);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white fixed top-0 h-full shadow-lg z-10">
        <div className="p-8 text-center font-bold text-2xl">Administrator</div>

        <nav className="mt-10">
          <ul>
            <li>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `flex items-center py-2.5 px-4 font-bold ${
                    isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-300'
                  }`
                }
              >
                <FontAwesomeIcon icon={faChartPie} className="mr-3" />
                Thống kê số liệu
              </NavLink>
            </li>
            <li>
              <div
                className="flex items-center py-2.5 px-4 font-bold cursor-pointer hover:bg-gray-300"
                onClick={toggleTourSubmenu}
              >
                <FontAwesomeIcon icon={faPlane} className="mr-3" />
                Quản lý Tour
              </div>
              {isTourSubmenuOpen && (
                <ul className="pl-4">
                  <li>
                    <NavLink
                      to="/admin/tours"
                      className="block py-2.5 px-4 hover:bg-gray-300"
                    >
                      Danh sách Tour
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/tours/itinerary"
                      className="block py-2.5 px-4 hover:bg-gray-300"
                    >
                      Quản lý Lịch trình
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/tours/tourSchedule"
                      className="block py-2.5 px-4 hover:bg-gray-300"
                    >
                      Quản lý Ngày khởi hành
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <NavLink
                to="/admin/categories"
                className={({ isActive }) =>
                  `flex items-center py-2.5 px-4 font-bold ${
                    isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-300'
                  }`
                }
              >
                <FontAwesomeIcon icon={faTags} className="mr-3" />
                Quản lý Danh mục
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center py-2.5 px-4 font-bold ${
                    isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-300'
                  }`
                }
              >
                <FontAwesomeIcon icon={faUsers} className="mr-3" />
                Quản lý Người dùng
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/bookings"
                className={({ isActive }) =>
                  `flex items-center py-2.5 px-4 font-bold ${
                    isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-300'
                  }`
                }
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-3" />
                Quản lý Booking
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/tours/reviews"
                className={({ isActive }) =>
                  `flex items-center py-2.5 px-4 font-bold ${
                    isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-300'
                  }`
                }
              >
                <FontAwesomeIcon icon={faComments} className="mr-3" />
                Quản lý Đánh giá
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/tours/transactions"
                className={({ isActive }) =>
                  `flex items-center py-2.5 px-4 font-bold ${
                    isActive ? 'bg-gray-700 text-white' : 'hover:bg-gray-300'
                  }`
                }
              >
                <FontAwesomeIcon icon={faMoneyCheckAlt} className="mr-3" />
                Quản lý Giao dịch
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-grow ml-64 bg-gray-200">
        <NavAdmin />
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
});

export default AdminLayout;
