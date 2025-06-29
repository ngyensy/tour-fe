import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './AdminUser/UserList';
import UserDetail from './AdminUser/UserDetail';
import { useAuth } from '../../context/AuthContext';


const UserManagement = () => {
  const {admin} = useAuth();
  const [users, setUsers] = useState([]); // Danh sách người dùng
  const [selectedUser, setSelectedUser] = useState(null); // Người dùng được chọn để chỉnh sửa

  // Hàm lấy danh sách người dùng từ API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/v1/users', {
        headers: {
            Authorization: `Bearer ${admin.token}`,
        },
    });
      setUsers(response.data.$values || response.data); // Cập nhật danh sách người dùng
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Lấy danh sách người dùng khi component được mount
  }, []);

  // Hàm xóa người dùng
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:4000/v1/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${admin.token}`,
        },
    });
      fetchUsers(); // Lấy lại danh sách người dùng sau khi xóa
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Quản lý Người dùng</h1>
      
      {/* Hiển thị danh sách người dùng nếu không có người dùng nào được chọn */}
      {!selectedUser && (
        <UserList 
          users={users} 
          onEdit={setSelectedUser} 
          onDelete={handleDeleteUser} 
        />
      )}

      {/* Hiển thị chi tiết người dùng khi có người dùng được chọn */}
      {selectedUser && (
        <UserDetail
          user={selectedUser}
          onCancel={() => setSelectedUser(null)} // Hủy bỏ việc chỉnh sửa
          onUpdate={fetchUsers} // Truyền hàm fetchUsers vào đây
        />
      )}
    </div>
  );
};

export default UserManagement;
