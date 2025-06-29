import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Section = ({ title, description }) => {
  const navigate = useNavigate(); // Khởi tạo hàm điều hướng

  const handleNavigate = (path) => {
    navigate(path); // Điều hướng đến đường dẫn tương ứng
  };

  return (
    <div className="mx-auto p-4">
      <div className="flex flex-col p-12">
        <h1 className="text-[#1E3A8A] text-[2.6rem] font-semibold mb-4 text-left">{title}</h1>
        <p className="text-lg font-normal text-left">{description}</p>
      </div>
      
      {/* Phần hiển thị hình ảnh với điều hướng và chữ */}
      <div className="flex justify-center gap-4 px-12 mb-12">
        {/* Ảnh 1 */}
        <div className="relative w-1/3">
          <img
            src="https://media.travel.com.vn/Advertisings/bn_241112_dulichtetcopy.webp" // Đường dẫn ảnh 1
            alt="Image 1"
            className="w-full h-auto cursor-pointer hover:opacity-80 rounded-lg"
            onClick={() => handleNavigate('/TourList')} // Điều hướng đến path1
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white font-semibold text-center py-2 text-lg rounded-lg">
            CHỌN NGAY TOUR TẾT CHO GIA ĐÌNH
          </div>
        </div>

        {/* Ảnh 2 */}
        <div className="relative w-1/3">
          <img
            src="https://media.travel.com.vn/Advertisings/bn_240925_KPSP1-tour-noi-dia-kich-cau.jpg" // Đường dẫn ảnh 2
            alt="Image 2"
            className="w-full h-auto cursor-pointer hover:opacity-80 rounded-lg"
            onClick={() => handleNavigate('/TourList')} // Điều hướng đến path2
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white font-semibold text-center py-2 text-lg rounded-lg">
            TOUR TỰ HÀO NÉT VIỆT NAM
          </div>
        </div>

        {/* Ảnh 3 */}
        <div className="relative w-1/3">
          <img
            src="https://media.travel.com.vn/Advertisings/bn_240925_348915kenya-safari.jpg" // Đường dẫn ảnh 3
            alt="Image 3"
            className="w-full h-full cursor-pointer hover:opacity-80 rounded-lg"
            onClick={() => handleNavigate('/TourList')} // Điều hướng đến path3
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white font-semibold text-center py-2 text-lg rounded-lg">
            ✨ Tour mới - Hành trình độc đáo
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section;
