import React, { useState } from 'react';
import '../styles/methodpayment.css';
import zalopay from '../assets/icon/zalopay.png';
import momopay from '../assets/icon/momo.png';

const paymentMethods = [
  { id: 1, name: 'Tiền mặt', icon: '💵' },
  { id: 2, name: 'Chuyển khoản', icon: '🏦' },
];

const PaymentMethod = ({ onSelectPayment }) => {
    const [selectedMethod, setSelectedMethod] = useState(null);
  
    const handleSelect = (methodName) => {
        setSelectedMethod(methodName); // Lưu tên phương thức thanh toán
        onSelectPayment(methodName);   // Truyền tên phương thức thanh toán lên component cha
    };

    return (
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-4">CÁC HÌNH THỨC THANH TOÁN</h3>
          <ul className="space-y-4">
            {paymentMethods.map((method) => (
              <li
              key={method.id}
              onClick={() => handleSelect(method.name)} // Truyền method.name thay vì method.id
              className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors 
                ${selectedMethod === method.name ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-100'}`}
            >
              {method.image ? (
                <img src={method.image} alt={method.name} className="w-8 h-8 mr-4" />
              ) : (
                <span className="text-2xl mr-4">{method.icon}</span>
              )}
              <span className="text-lg">{method.name}</span>
              <input
                type="checkbox"
                checked={selectedMethod === method.name} // Kiểm tra bằng method.name
                onChange={() => handleSelect(method.name)} // Truyền method.name thay vì method.id
                className="ml-auto h-6 w-6"
              />
            </li>
            ))}
          </ul>
        </div>
      );
    };

export default PaymentMethod;
