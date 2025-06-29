import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Tours from './Tours';

const Section = ({ title, description, content }) => {
  const navigate = useNavigate(); // Khởi tạo hàm điều hướng

  const handleClick = () => {
    navigate('/TourList'); // Đường dẫn đến trang bạn muốn điều hướng
  };
  
  return (
    <div 
      className="mx-auto p-4" 
      style={{ background: "url(https://travel.com.vn/_next/static/media/comboGoodPrice.aa56bfb9.png) no-repeat center center/cover" }}
    >
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-[#1E3A8A] text-[3.2rem] font-bold mb-4">{title}</h1>
        <p className="text-gray-600 text-lg text-center mb-6">
          {description}
        </p>
        {content}
        
        {/* Nút Xem thêm */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleClick} // Thêm hàm xử lý nhấp nút
            className="text-[#1E3A8A] border-2 border-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Xem thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Section;
