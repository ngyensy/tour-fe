import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';  // Giả sử bạn có một hook useAuth để lấy thông tin người dùng
import "../styles/discountCode.css"

const DiscountCodeComponent = ({ totalPrice, setFinalPrice, appliedCoded }) => {
  const { user } = useAuth(); // Giả sử useAuth trả về thông tin người dùng
  const [discountCode, setDiscountCode] = useState('');  // Mã giảm giá người dùng nhập vào
  const [discountAmount, setDiscountAmount] = useState(0);  // Số tiền giảm
  const [appliedCode, setAppliedCode] = useState(null);  // Mã giảm giá đã được áp dụng

  // Kiểm tra và áp dụng mã giảm giá
  const handleApplyDiscount = async () => {
    if (!discountCode) {
      toast.error('Vui lòng nhập mã giảm giá!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/v1/discountcode/validate', {
        code: discountCode,
      });

      if (response.data.message === "Mã giảm giá hợp lệ.") {
        setDiscountAmount(response.data.discountAmount);  // Cập nhật số tiền giảm
        setAppliedCode(discountCode);
        appliedCoded(discountCode);  // Lưu mã giảm giá đã áp dụng
        toast.success('Mã giảm giá hợp lệ!');
      } else {
        toast.error('Mã giảm giá không hợp lệ!');
      }
    } catch (error) {
      console.error('Lỗi khi áp dụng mã giảm giá:', error);
      toast.error(error.response.data.message || 'Có lỗi xảy ra khi áp dụng mã giảm giá!');
    }
  };

  // Cập nhật lại giá trị tổng tiền sau khi áp dụng mã giảm giá
  useEffect(() => {
    setFinalPrice(totalPrice - discountAmount);
  }, [discountAmount, totalPrice, setFinalPrice]);

  return (
    <div className="discount-section flex flex-col gap-4 border-y-2 py-4 border-gray-500">
      <div className="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="icon">
          <path fill="#000" d="M15.225 13.894a1.38 1.38 0 1 0 0-2.76 1.38 1.38 0 0 0 0 2.76m0-2.01a.63.63 0 1 1 0 1.26.63.63 0 0 1 0-1.26M16.406 16.23a1.38 1.38 0 1 0 2.76 0 1.38 1.38 0 0 0-2.76 0m2.01 0a.63.63 0 1 1-1.259 0 .63.63 0 0 1 1.259 0M18.144 11.365l-3.998 5.587.61.437 3.998-5.588z"></path>
          <path fill="#000" d="M19.125 1.08a5.1 5.1 0 0 1-1.103 2.396 1.84 1.84 0 0 0-2.182-.356l-3.274.06a3.34 3.34 0 0 0-2.325.986l-8.422 8.426a1.875 1.875 0 0 0 0 2.652l2.306 2.31c.13.474.443.879.87 1.125l6.169 3.562c.254.151.54.24.836.259.323.246.719.378 1.125.375h7.125A1.875 1.875 0 0 0 22.125 21V9.086a3.38 3.38 0 0 0-.945-2.336l-2.625-2.723a5.7 5.7 0 0 0 1.32-2.857zM2.347 13.125l8.427-8.43a2.63 2.63 0 0 1 1.807-.75l.87-.019-1.189.341c-.839.243-1.551.8-1.987 1.557L4.316 16.125a2 2 0 0 0-.165.375l-1.804-1.789a1.125 1.125 0 0 1 0-1.586m3.03 4.913a1.125 1.125 0 0 1-.412-1.538l5.959-10.316a2.63 2.63 0 0 1 1.545-1.212l1.98-.566-2.25 2.336a3.38 3.38 0 0 0-.95 2.344V21q.003.239.068.469zm15.998-8.952V21a1.125 1.125 0 0 1-1.125 1.125h-7.125A1.125 1.125 0 0 1 12 21V9.086a2.63 2.63 0 0 1 .75-1.822l3.142-3.259a1.147 1.147 0 0 1 1.594 0q-.143.105-.296.195a.75.75 0 1 0 .247.72 4 4 0 0 0 .581-.375l2.625 2.734c.467.486.73 1.133.732 1.807"></path>
        </svg>

        <h3 className="text-lg font-bold ml-2">MÃ GIẢM GIÁ</h3>
        <input
          type="text"
          placeholder="Nhập mã giảm giá"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)} // Cập nhật mã giảm giá
          className="input-discount ml-2 border border-gray-400 rounded-lg"
        />
        <button
          className="apply-discount-btn rounded-lg"
          onClick={handleApplyDiscount} // Gọi hàm kiểm tra mã giảm giá
        >
          Áp dụng
        </button>
      </div>

      {/* Hiển thị thông tin mã giảm giá */}
      {appliedCode && (
        <div className="discount-info mt-4 text-gray-700 font-medium">
          <p><strong>Mã giảm giá:</strong> {appliedCode}</p>
          <p><strong>Giá gốc:</strong> {totalPrice.toLocaleString()} đ</p>
          <p className="text-red-400"><strong className='text-gray-700'>Số tiền giảm:</strong> - {discountAmount.toLocaleString()} đ</p> 
          <p><strong>Giá sau giảm:</strong> {(totalPrice - discountAmount).toLocaleString()} đ</p>
        </div>
      )}
    </div>
  );
};

export default DiscountCodeComponent;
