import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';  
import { useNavigate } from 'react-router-dom';  
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// API Login
const loginUser = async (loginData) => {
  const res = await axios.post('http://localhost:4000/v1/auth/login', loginData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

const AdminLoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');  // State để lưu thông báo lỗi API
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();

  // Kiểm tra xem admin đã đăng nhập hay chưa
  useEffect(() => {
    const adminToken = sessionStorage.getItem('adminToken');
    if (adminToken) {
      // Nếu admin đã đăng nhập, điều hướng tới trang dashboard
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const mutation = useMutation(loginUser, {
    onSuccess: (data) => {
      // Kiểm tra xem vai trò của người dùng có phải Admin hay không
      if (data.role === 'Admin') {
        // Nếu vai trò là Admin, thực hiện lưu thông tin và chuyển hướng
        loginAdmin({
          id: data.id,
          name: data.name,
          token: data.token,
          email: data.email,
          role: data.role,
          avatar: data.avatar,
        });

        // Chuyển hướng đến trang admin dashboard
        navigate('/admin/dashboard');
      } else {
        // Nếu không phải Admin, ngăn việc xử lý tiếp theo và hiển thị thông báo lỗi
        setApiError('Bạn không có quyền truy cập trang này.');
      }
    },
    onError: (error) => {
      // Nếu API trả về lỗi, lấy message từ response
      const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại, vui lòng thử lại.';
      setApiError(errorMessage);  // Lưu thông báo lỗi vào state
    },
  });

  const onSubmit = (data) => {
    setApiError('');  // Reset lỗi trước khi gửi yêu cầu
    mutation.mutate(data);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg mx-auto p-10 border rounded-lg shadow-lg bg-white">
        <h2 className="text-center text-4xl font-bold mb-6 text-blue-600">Admin Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Thông báo lỗi từ API */}
          {apiError && <p className="text-red-600 text-center mb-4">{apiError}</p>}

          {/* Email or username input */}
          <div className="mb-6">
            <label className="block mb-2 font-bold text-lg" htmlFor="username">
              Tài khoản <span className='text-red-600'>*</span>
            </label>
            <input
              id="username"
              {...register('username', { required: true })}
              type="text"
              placeholder="Nhập tên tài khoản"
              className={`w-full p-4 text-2sm font-medium border-none ${errors.username ? 'shadow-sm border-b-red-500' : 'shadow-sm border-b-gray-300'} rounded-none focus:outline-none`}
              style={{ boxShadow: `0 1px 0 0 ${errors.username ? 'red' : 'black'}` }}
              autoComplete="username"
            />
            {errors.username && <span className="text-red-500 text-sm font-medium">Thông tin bắt buộc</span>}
          </div>

          {/* Password input */}
          <div className="mb-6 relative">
            <label className="block mb-2 font-bold text-lg" htmlFor="password">
              Mật khẩu <span className='text-red-600'>*</span>
            </label>
            <input
              id="password"
              {...register('password', { required: true })}
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu"
              className={`w-full p-4 text-2sm font-medium border-none ${errors.password ? 'shadow-sm border-b-red-500' : 'shadow-sm border-b-gray-300'} rounded-none focus:outline-none`}
              style={{ boxShadow: `0 1px 0 0 ${errors.password ? 'red' : 'black'}` }}
            />
            {errors.password && <span className="text-red-500 text-sm font-medium">Thông tin bắt buộc</span>}

            {/* Icon hiện/ẩn mật khẩu */}
            <div className="absolute inset-y-12 right-0 pr-4 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeSlashIcon className="h-6 w-6 text-gray-500" /> : <EyeIcon className="h-6 w-6 text-gray-500" />}
            </div>
          </div>

          {/* Nút Đăng nhập */}
          <div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md text-lg" disabled={mutation.isLoading}>
              {mutation.isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginForm;
