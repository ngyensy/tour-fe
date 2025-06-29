import React, { useState } from 'react';
import BookingList from './AdminBooking/BookingList'; // Import component BookingList
import BookingDetail from './AdminBooking/BookingDetail'; // Import component BookingDetail

const BookingManagement = () => {
  const [selectedBooking, setSelectedBooking] = useState(null); // Lưu trạng thái booking được chọn

  // Hàm xử lý khi nhấn "Chi Tiết"
  const handleViewDetail = (booking) => {
    setSelectedBooking(booking); // Đặt booking đã chọn vào state
  };

  // Hàm xử lý khi nhấn "Quay lại"
  const handleBackToList = () => {
    setSelectedBooking(null); // Quay lại danh sách
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Quản lý Booking</h1>

      {selectedBooking ? (
        // Nếu có booking được chọn, hiển thị chi tiết booking
        <BookingDetail booking={selectedBooking} onBack={handleBackToList} />
      ) : (
        // Nếu không có booking được chọn, hiển thị danh sách booking
        <BookingList onViewDetail={handleViewDetail} />
      )}
    </div>
  );
};

export default BookingManagement;
