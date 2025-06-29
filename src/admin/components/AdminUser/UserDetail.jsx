import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

const UserDetail = ({ user, onCancel, onUpdate }) => {
  const { admin } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phoneNumber: '',
    avatar: null,
    address: '',
    gender: '',
    dateOfBirth: '',
    rewardPoints: 0,
    numberOfToursTaken: 0,
  });

  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber || '',
        avatar: user.avatar || null,
        address: user.address || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth || '',
        rewardPoints: user.rewardPoints || 0,
        numberOfToursTaken: user.numberOfToursTaken || 0,
      });

      if (user.avatar) {
        setAvatarPreview(`http://localhost:4000${user.avatar}`);
      }
    }
  }, [user]);

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const re = /^[0-9]{10,15}$/;
    return re.test(phoneNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(formData.email)) {
      alert('Email không hợp lệ. Vui lòng kiểm tra lại.');
      return;
    }

    if (!isValidPhoneNumber(formData.phoneNumber)) {
      alert('Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phoneNumber', formData.phoneNumber);
    formDataToSend.append('role', formData.role);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('dateOfBirth', formData.dateOfBirth);
    formDataToSend.append('rewardPoints', formData.rewardPoints);
    formDataToSend.append('numberOfToursTaken', formData.numberOfToursTaken);
    formDataToSend.append('role', formData.role); 

    if (formData.avatar) {
      formDataToSend.append('avatar', formData.avatar);
    } else {
      formDataToSend.append('avatar', user.avatar || '');
    }

    try {
      if (formData.avatar && user.avatar) {
        await axios.delete(`http://localhost:4000/v1/users/${user.id}/avatar`, {
          data: { avatar: user.avatar },
        });
      }

      const response = await axios.put(`http://localhost:4000/v1/users/${user.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${admin.token}`,
        },
      });

      console.log('Cập nhật thành công:', response.data);
      alert('Người dùng đã được cập nhật thành công!');
      onUpdate(response.data);
      onCancel();
    } catch (error) {
      console.error('Lỗi cập nhật người dùng:', error);
      alert('Có lỗi xảy ra khi cập nhật người dùng. Vui lòng thử lại.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Chỉnh sửa Người dùng</h2>

      {/* Tên và Email */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Tên:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
      </div>

      {/* Phone, Address, Gender and Birthdate */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Số điện thoại:</label>
          <input
            type="text"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Địa chỉ:</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Giới tính:</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Chọn giới tính</option>
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
            <option value="Other">Khác</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Ngày sinh:</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Avatar and Other Information */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Điểm thưởng:</label>
          <input
            type="number"
            value={formData.rewardPoints}
            onChange={(e) => setFormData({ ...formData, rewardPoints: e.target.value })}
            className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Số tour đã tham gia:</label>
          <input
            type="number"
            value={formData.numberOfToursTaken}
            onChange={(e) => setFormData({ ...formData, numberOfToursTaken: e.target.value })}
            className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Vai trò:</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Chọn vai trò</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>

        </select>
      </div>

      {/* Avatar */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Ảnh đại diện:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {avatarPreview ? (
          <div className="mt-2">
            <img src={avatarPreview} alt="Avatar Preview" className="w-32 h-32 object-cover rounded-full" />
          </div>
        ) : (
          user.avatar && (
            <div className="my-4">
              <img src={`http://localhost:4000${user.avatar}`} alt="Current Avatar" className="w-32 h-32 object-cover rounded-full" />
            </div>
          )
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
        >
          Lưu
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 transition"
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

export default UserDetail;
