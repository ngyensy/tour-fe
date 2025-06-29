// RegisterFormNew.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Điều hướng sau khi đăng ký thành công

import Navbar from '../components/Nav';
import Footer from '../components/Footer';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// API Register
const registerUser = async (registerData) => {
  const response = await axios.post('http://localhost:4000/v1/Users', registerData); // Thay URL này bằng API thực của bạn
  return response.data;
};

const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(''); // Biến để lưu lỗi từ API
  const navigate = useNavigate();

  // Mutation for register
  const mutation = useMutation(registerUser, {
    onSuccess: (data) => {
      console.log('Đăng ký thành công:', data);
      navigate('/login'); // Điều hướng về trang chủ khi đăng ký thành công
    },
    onError: (error) => {
      // Xử lý lỗi API và hiển thị lỗi chi tiết
      if (error.response && error.response.data) {
        const errorMsg = error.response.data.message || 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.';
        setApiError(errorMsg);
      } else {
        setApiError('Đã xảy ra lỗi không xác định. Vui lòng thử lại.');
      }
      console.error('Lỗi đăng ký:', error);
    }
  });

  // Submit form data
  const onSubmit = (data) => {
    setApiError(''); // Xóa lỗi cũ trước khi gửi form
    mutation.mutate(data); // Gọi API đăng ký
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto m-20 p-6 border rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold mb-4 text-blue-600">Đăng ký</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Họ tên */}
          <div className="mb-4">
            <label className="block mb-1 font-bold" htmlFor="fullname">
              Họ tên <span className='text-red-600'>*</span>
            </label>
            <input
              id="fullname"
              {...register('name', { required: true })}
              type="text"
              placeholder="Nhập họ tên"
              className={`w-full p-2 border-none ${errors.fullname ? 'shadow-sm border-b-red-500' : 'shadow-sm border-b-gray-300'} rounded-none focus:outline-none`}
              style={{ boxShadow: `0 1px 0 0 ${errors.fullname ? 'red' : 'black'}` }}
            />
            {errors.fullname && <span className="text-red-500 text-sm font-medium">Thông tin bắt buộc</span>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1 font-bold" htmlFor="email">
              Email <span className='text-red-600'>*</span>
            </label>
            <input
              id="email"
              {...register('email', { required: true })}
              type="email"
              placeholder="Nhập email"
              className={`w-full p-2 border-none ${errors.email ? 'shadow-sm border-b-red-500' : 'shadow-sm border-b-gray-300'} rounded-none focus:outline-none`}
              style={{ boxShadow: `0 1px 0 0 ${errors.email ? 'red' : 'black'}` }}
            />
            {errors.email && <span className="text-red-500 text-sm font-medium">Thông tin bắt buộc</span>}
          </div>

          {/* Số điện thoại */}
          <div className="mb-4">
            <label className="block mb-1 font-bold" htmlFor="phone">
              Số điện thoại <span className='text-red-600'>*</span>
            </label>
            <input
              id="phone"
              {...register('phoneNumber', { required: true })}
              type="text"
              placeholder="Nhập số điện thoại"
              className={`w-full p-2 border-none ${errors.phone ? 'shadow-sm border-b-red-500' : 'shadow-sm border-b-gray-300'} rounded-none focus:outline-none`}
              style={{ boxShadow: `0 1px 0 0 ${errors.phone ? 'red' : 'black'}` }}
            />
            {errors.phone && <span className="text-red-500 text-sm font-medium">Thông tin bắt buộc</span>}
          </div>

          {/* Mật khẩu */}
          <div className="mb-4 relative">
            <label className="block mb-1 font-bold" htmlFor="password">
              Mật khẩu <span className='text-red-600'>*</span>
            </label>
            <input
              id="password"
              {...register('password', { required: true })}
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu"
              className={`w-full p-2 border-none ${errors.password ? 'shadow-sm border-b-red-500' : 'shadow-sm border-b-gray-300'} rounded-none focus:outline-none`}
              style={{ boxShadow: `0 1px 0 0 ${errors.password ? 'red' : 'black'}` }}
            />
            {errors.password && <span className="text-red-500 text-sm font-medium">Thông tin bắt buộc</span>}

            {/* Icon hiện/ẩn mật khẩu */}
            <div className="absolute inset-y-10 right-0 pr-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
            </div>
          </div>

          {/* Hiển thị lỗi API nếu có */}
          {apiError && <p className="text-red-500 text-center mb-4">{apiError}</p>}

          {/* Nút Đăng ký */}
          <div className='px-20 mt-7'>
            <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-md" disabled={mutation.isLoading}>
              {mutation.isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterForm;
