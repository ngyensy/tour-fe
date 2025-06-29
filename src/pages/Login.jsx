import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';  
import { useNavigate } from 'react-router-dom';  
import facebookLogo from '../assets/icon/icon-FB.png';
import googleLogo from '../assets/icon/icon-google.png';
import Navbar from '../components/Nav';
import Footer from '../components/Footer';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// API Login
const loginUser = async (loginData) => {
  const res = await axios.post('http://localhost:4000/v1/auth/login', loginData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');  // State để lưu thông báo lỗi API
  const navigate = useNavigate();
  const { Userlogin } = useAuth();

  const mutation = useMutation(loginUser, {
    onSuccess: (data) => {
      Userlogin(
        {
          id: data.id,
          name: data.name,
          token: data.token,
          email: data.email,
          phoneNumber: data.phoneNumber, 
          role: data.role,
          avatar: data.avatar,
          address: data.address,
          gender: data.gender,
          dateOfBirth: data.dateOfBirth,
          rewardPoints: data.rewardPoints,
          numberOfToursTaken: data.numberOfToursTaken,
        });  
      navigate('/');  
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
    <div>
      <Navbar />
      <div className="max-w-md mx-auto m-20 p-6 border rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold mb-4 text-blue-600">Đăng nhập</h2>
        <form onSubmit={handleSubmit(onSubmit)}>

          {/* Thông báo lỗi từ API */}
          {apiError && <p className="text-red-600 text-center mb-4">{apiError}</p>}

          {/* Email or phone input */}
          <div className="mb-4">
            <label className="block mb-1 font-bold" htmlFor="email">
              Số điện thoại hoặc email <span className='text-red-600'>*</span>
            </label>
            <input
              id="email"
              {...register('username', { required: true })}
              type="text"
              placeholder="Nhập số điện thoại hoặc email"
              className={`w-full p-2 border-none ${errors.username ? 'shadow-sm border-b-red-500' : 'shadow-sm border-b-gray-300'} rounded-none focus:outline-none`}
              style={{ boxShadow: `0 1px 0 0 ${errors.username ? 'red' : 'black'}` }}
            />
            {errors.email && <span className="text-red-500 text-sm font-medium">Thông tin bắt buộc</span>}
          </div>

          {/* Password input */}
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

          {/* Nút Đăng nhập */}
          <div className='px-20'>
            <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-md" disabled={mutation.isLoading}>
              {mutation.isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </div>

          {/* Đăng ký link */}
          <div className="text-center m-4">
            <p className="font-medium text-sm italic">
              Chưa là thành viên? <Link to="/register" className="text-blue-600 hover:underline">Đăng ký ngay</Link>
            </p>
          </div>
          
          {/* Nút tiếp tục với Facebook và Google */}
          <div className="text-center mt-4">
            <p className="text-black font-bold">hoặc</p>
          </div>

          <div className="mt-4 space-y-2 px-20">
            <button className="w-full bg-[#3b589d] hover:bg-blue-600 text-white py-2.5 rounded-md flex items-center justify-center space-x-2">
              <img src={facebookLogo} alt="Facebook logo" className="w-8 h-8" />
              <span>Tiếp tục với Facebook</span>
            </button>

            <button className="w-full bg-white border-2 border-gray-400 hover:bg-gray-100 py-2.5 rounded-md flex items-center justify-center space-x-2">
              <img src={googleLogo} alt="Google logo" className="w-6 h-6" />
              <span>Tiếp tục với Google</span>
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default LoginForm;
