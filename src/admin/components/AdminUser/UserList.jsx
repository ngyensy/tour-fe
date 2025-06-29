import React, { useState } from 'react';

const UserList = ({ users, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Lọc danh sách người dùng dựa trên từ khóa tìm kiếm
  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.includes(searchTerm)
  );

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
      {/* Thanh tìm kiếm */}
      <div className="mb-6 flex items-center gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm theo email hoặc số điện thoại..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          🔍
        </button>
      </div>

      {/* Bảng hiển thị người dùng */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-3 px-4 text-center">ID</th>
              <th className="py-3 px-4 text-center">Tên</th>
              <th className="py-3 px-4 text-center">Email</th>
              <th className="py-3 px-4 text-center">Số điện thoại</th>
              <th className="py-3 px-4 text-center">Vai trò</th>
              <th className="py-3 px-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100 transition">
                  <td className="py-3 px-4 border text-center">{user.id}</td>
                  <td className="py-3 px-4 border text-center">{user.name}</td>
                  <td className="py-3 px-4 border text-center">{user.email}</td>
                  <td className="py-3 px-4 border text-center">{user.phoneNumber}</td>
                  <td className="py-3 px-4 border text-center">{user.role}</td>
                  <td className="py-3 px-4 border text-center">
                    <button
                      onClick={() => onEdit(user)}
                      className="bg-yellow-400 text-white px-3 py-2 rounded-lg hover:bg-yellow-500 transition mr-2"
                    >
                      ✏️ Sửa
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      ❌ Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="py-6 px-4 text-center text-gray-500 border"
                >
                  Không tìm thấy người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
