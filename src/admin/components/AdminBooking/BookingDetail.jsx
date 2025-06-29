import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateBookingForm from './BookingUpdate';
import Swal from 'sweetalert2';
import { useAuth } from '../../../context/AuthContext';

const BookingDetail = ({ booking, onBack }) => {
  const { admin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [bookingData, setBookingData] = useState(booking);

  useEffect(() => {
    setBookingData(booking);

    const fetchTourSchedule = async () => {
      if (booking.tourScheduleId) {
        try {
          const response = await axios.get(`http://localhost:4000/v1/Tourschedule/${booking.tourScheduleId}`);
          setBookingData((prev) => ({
            ...prev,
            tour: {
              ...prev.tour,
              startDate: response.data.startDate,
              endDate: response.data.endDate,
            },
          }));
        } catch (error) {
          console.error('Lỗi khi lấy thông tin TourSchedule:', error);
          Swal.fire({
            icon: 'error',
            title: 'Không thể tải thông tin TourSchedule',
            text: 'Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.',
          });
        }
      }
    };

    fetchTourSchedule();
  }, [booking]);

  const adultPriceWithDiscount = bookingData.tour?.price - (bookingData.tour?.price * bookingData.tour?.discount / 100);
  const childPriceWithDiscount = bookingData.tour?.childPrice - (bookingData.tour?.childPrice * bookingData.tour?.discount / 100);

  const calculateTotalPrice = (adults, children) => {
    const adultTotal = adults * (adultPriceWithDiscount || 0);
    const childTotal = children * (childPriceWithDiscount || 0);
    const totalSingleRoomPrice = bookingData.totalSingleRoomSurcharge || 0;
    return adultTotal + childTotal + totalSingleRoomPrice;
  };

  const calculateTotalSingleRooms = () => {
    const singleRoomSurcharge = bookingData.tour?.singleRoomSurcharge || 0;
    const totalSingleRoomSurcharge = bookingData.totalSingleRoomSurcharge || 0;
    return singleRoomSurcharge > 0 ? Math.floor(totalSingleRoomSurcharge / singleRoomSurcharge) : 0;
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleUpdateBooking = async (updatedBooking) => {
    const totalPrice = calculateTotalPrice(updatedBooking.numberOfAdults, updatedBooking.numberOfChildren);

    const finalBooking = {
      ...updatedBooking,
      totalPrice: totalPrice
    };

    try {
      await axios.put(`http://localhost:4000/v1/booking/${bookingData.id}`, finalBooking, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Cập nhật thành công!',
        confirmButtonText: 'OK',
        timer: 3000
      }).then(async () => {
        const response = await axios.get(`http://localhost:4000/v1/booking/${bookingData.id}`, {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        });
        setBookingData(response.data);
        setIsEditing(false);
      });

    } catch (error) {
      console.error('Lỗi khi cập nhật booking:', error);
      Swal.fire({
        icon: 'error',
        title: 'Cập nhật thất bại.',
        text: 'Đã xảy ra lỗi khi cập nhật thông tin booking.',
      });
    }
  };

  if (isEditing) {
    return <UpdateBookingForm booking={bookingData} onUpdate={handleUpdateBooking} onCancel={handleCancel} />;
  }

  const totalSingleRooms = calculateTotalSingleRooms();
  const singleRoomSurcharge = bookingData.tour?.singleRoomSurcharge || 0;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-4 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Chi tiết Booking</h2>
      <div className="p-4 border border-gray-300 rounded shadow-md">
        <div className="flex">
          <div className="w-1/2 pr-4">
            <h3 className="text-2xl font-bold mb-2">Thông tin Booking</h3>
            <div className="mb-2">
              <strong>Mã Booking:</strong> {bookingData.id}
            </div>
            <div className="mb-2">
              <strong>Tên Người Đặt:</strong> {bookingData.guestName}
            </div>
            <div className="mb-2">
              <strong>Ngày Đặt:</strong> {new Date(bookingData.bookingDate).toLocaleDateString()}
            </div>
            <div className="mb-2">
              <strong>Trạng Thái:</strong> {bookingData.status}
            </div>
            <div className="mb-2">
              <strong>Tổng Tiền:</strong> {calculateTotalPrice(bookingData.numberOfAdults, bookingData.numberOfChildren).toLocaleString()} VND
            </div>
            {bookingData.notes && (
              <div className="mb-2">
                <strong>Yêu Cầu Đặc Biệt:</strong> {bookingData.notes}
              </div>
            )}
            <div className="mb-2 ">
              <h3 className='text-2xl font-bold'>Thông Tin Liên Hệ:</h3>
              <div><strong>Tên Khách:</strong> {bookingData.guestName}</div>
              <div><strong>Email:</strong> {bookingData.guestEmail || 'N/A'}</div>
              <div><strong>Số Điện Thoại:</strong> {bookingData.guestPhoneNumber || 'N/A'}</div>
              <div><strong>Địa Chỉ:</strong> {bookingData.guestAddress || 'N/A'}</div>
              <div><strong>Vai Trò:</strong> {bookingData.userId ? 'User' : 'Guest'}</div>
            </div>
          </div>

          <div className="w-1/2 pl-4">
            <h3 className="text-2xl font-bold mb-2">Thông tin Tour</h3>
            <div className="mb-2">
              <strong>Mã Tour:</strong> {bookingData.tour?.id || 'N/A'}
            </div>
            <div className="mb-2">
              <strong>Tên Tour:</strong> {bookingData.tour?.name || 'N/A'}
            </div>
            <div className="mb-2">
              <strong>Địa Điểm Tour:</strong> {bookingData.tour?.departureLocation || 'N/A'}
            </div>
            <div className="mb-2">
              <strong>Ngày Khởi Hành:</strong> {bookingData.tour?.startDate ? new Date(bookingData.tour.startDate).toLocaleDateString() : 'N/A'}
            </div>
            <div className="mb-2">
              <strong>Ngày Kết Thúc:</strong> {bookingData.tour?.endDate ? new Date(bookingData.tour.endDate).toLocaleDateString() : 'N/A'}
            </div>
            <div className="mb-2">
              <strong>Số Người Lớn:</strong> {bookingData.numberOfAdults} x {adultPriceWithDiscount.toLocaleString()} VND
            </div>
            <div className="mb-2">
              <strong>Số Trẻ Em:</strong> {bookingData.numberOfChildren} x {childPriceWithDiscount.toLocaleString()} VND
            </div>
            <div className="mb-2">
              <strong>Số phòng đơn:</strong> {` ${totalSingleRooms} x ${singleRoomSurcharge.toLocaleString()} VND`}
            </div>
            <div className="mb-2">
              <strong>Tổng số người:</strong> {bookingData.numberOfPeople}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-bold">Thông Tin Thanh Toán</h3>
          <div className="mb-2">
            <strong>Phương Thức Thanh Toán:</strong> {bookingData.paymentMethod || 'N/A'}
          </div>
        </div>

        <button
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mt-4 mr-2"
          onClick={handleEditClick}
        >
          Sửa
        </button>

        <button
          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 mt-4"
          onClick={onBack}
        >
          Quay lại danh sách
        </button>
      </div>
    </div>
  );
};

export default BookingDetail;
