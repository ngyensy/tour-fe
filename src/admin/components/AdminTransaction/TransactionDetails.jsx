import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Swal from 'sweetalert2';

const TransactionDetails = ({ transactionId, onBack }) => {
  const [transaction, setTransaction] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchTransactionDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:4000/v1/transaction/${transactionId}`);
        setTransaction(response.data);
      } catch (error) {
        Swal.fire('Lỗi', 'Không thể tải chi tiết giao dịch.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [transactionId]);

  if (isLoading) return <div>Đang tải chi tiết giao dịch...</div>;
  if (!transaction) return <div>Không tìm thấy giao dịch.</div>;

  const booking = transaction.booking || {};

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Chi tiết Giao dịch</h2>

      {/* Giao dịch */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">ID Giao dịch:</span>
          <span>{transaction.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Số tiền:</span>
          <span>{transaction.amount?.toLocaleString()} VNĐ</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Trạng thái Giao dịch:</span>
          <span>{transaction.status}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Phương thức thanh toán:</span>
          <span>{transaction.paymentMethod || 'Không xác định'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Ngày tạo giao dịch:</span>
          <span>{new Date(transaction.transactionDate).toLocaleString()}</span>
        </div>
      </div>

      {/* Booking */}
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Thông tin Booking</h3>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">ID Booking:</span>
          <span>{booking.id || 'Không xác định'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Tên khách:</span>
          <span>{booking.guestName || 'Không xác định'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Email khách:</span>
          <span>{booking.guestEmail || 'Không xác định'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Số điện thoại khách:</span>
          <span>{booking.guestPhoneNumber || 'Không xác định'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Địa chỉ khách:</span>
          <span>{booking.guestAddress || 'Không xác định'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Ngày đặt phòng:</span>
          <span>{booking.bookingDate ? new Date(booking.bookingDate).toLocaleString() : 'Không xác định'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Trạng thái Booking:</span>
          <span>{booking.status || 'Không xác định'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Số lượng người lớn:</span>
          <span>{booking.numberOfAdults}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Số lượng trẻ em:</span>
          <span>{booking.numberOfChildren}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Tổng số người:</span>
          <span>{booking.numberOfPeople}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Tổng giá trị:</span>
          <span>{booking.totalPrice?.toLocaleString()} VNĐ</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Phương thức thanh toán:</span>
          <span>{booking.paymentMethod || 'Không xác định'}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Phụ thu phòng đơn:</span>
          <span>{booking.totalSingleRoomSurcharge?.toLocaleString()} VNĐ</span>
        </div>
      </div>

      {/* Quay lại Button */}
      <div className="mt-6 flex justify-end">
        <button onClick={onBack} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none">
          Quay lại
        </button>
      </div>
    </div>
  );
};

TransactionDetails.propTypes = {
  transactionId: PropTypes.number.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default TransactionDetails;
