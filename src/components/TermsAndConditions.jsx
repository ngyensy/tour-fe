import React, { useState } from 'react';
import Dieukhoan from './dieukhoan';

const TermsAndConditions = ({ onAgree }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
    onAgree(e.target.checked); // Gọi hàm callback để truyền trạng thái "đồng ý"
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 mt-10">ĐIỀU KHOẢN BẮT BUỘC KHI ĐĂNG KÝ ONLINE</h2>
      <div className="p-6 bg-gray-100 border rounded-lg h-64 overflow-y-auto">
        <Dieukhoan />
      </div>
      <div className="mt-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="mr-2 h-4 w-4"
          />
          <span className="text-lg font-semibold">
            Tôi đồng ý với <a href="#" className="text-blue-500 underline">Chính sách bảo vệ dữ liệu cá nhân</a> và các <a href="#" className="text-blue-500 underline">điều khoản trên</a>.
          </span>
        </label>
      </div>
    </div>
  );
};

export default TermsAndConditions;
