import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const BookingList = ({ onViewDetail }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State cho từ khóa tìm kiếm
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:4000/v1/booking');
        setBookings(response.data.$values);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa booking này?',
      text: "Bạn sẽ không thể hoàn tác hành động này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, xóa!',
      cancelButtonText: 'Hủy'
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      const response = await axios.delete(`http://localhost:4000/v1/booking/${id}`);
      if (response.status !== 200) {
        throw new Error('Không thể xóa booking.');
      }
      setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== id));
      
      Swal.fire(
        'Đã xóa!',
        'Booking đã được xóa thành công.',
        'success'
      );
    } catch (err) {
      setError(err.message);
      Swal.fire(
        'Lỗi!',
        'Không thể xóa booking. Vui lòng thử lại.',
        'error'
      );
    }
  };

  const sortPriority = {  
    "Chờ xác nhận": 1,
    "Đã xác nhận": 2,
    "Đã thanh toán": 3,
    "Đã Hủy Booking": 4,
  };

  const filteredBookings = bookings
  .filter((booking) => {
    const idString = String(booking.id);
    const phoneNumber = String(booking.guestPhoneNumber || '');
    return (
      (statusFilter === '' || booking.status === statusFilter) &&
      (idString.includes(searchTerm) || phoneNumber.includes(searchTerm))
    );
  })
  .sort((a, b) => {
    // Sắp xếp theo ngày đặt giảm dần
    const dateA = new Date(a.bookingDate);
    const dateB = new Date(b.bookingDate);
    return dateB - dateA;
  });


  if (loading) {
    return <p>Loading bookings...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-4 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Danh sách Booking</h2>

      <div className='flex space-x-10'>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm theo mã booking hoặc số điện thoại"
          className="w-full px-4 py-2 mb-4 border rounded"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
        >
          <option value="">Tất cả Tour</option>
          <option value="Chờ xác nhận">Chờ xác nhận</option>
          <option value="Đã xác nhận">Đã xác nhận</option>
          <option value="Đã thanh toán">Đã thanh toán</option>
          <option value="Đã Hủy Booking">Đã Hủy Booking</option>
        </select>
      </div>

      {filteredBookings.length === 0 ? (
        <p className='text-center'>Không có Booking nào!!!</p>
      ) : (
        <div className="table-container">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-blue-500 text-white font-semibold">
              <tr>
                <th className="py-2 px-4 border text-center">Mã Booking</th>
                <th className="py-2 px-4 border text-center">Tên Tour</th>
                <th className="py-2 px-4 border text-center">Tên Người Đặt</th>
                <th className="py-2 px-4 border text-center">Số điện thoại</th>
                <th className="py-2 px-4 border text-center">Ngày Đặt</th>
                <th className="py-2 px-4 border text-center">Trạng Thái</th>
                <th className="py-2 px-4 border text-center">Tổng Tiền</th>
                <th className="py-2 px-4 border text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                let statusClass = '';

                // Gán màu cho từng trạng thái
                switch (booking.status) {
                  case 'Chờ xác nhận':
                    statusClass = 'bg-yellow-100 text-yellow-700';
                    break;
                  case 'Đã xác nhận':
                    statusClass = 'bg-blue-100 text-blue-700';
                    break;
                  case 'Đã thanh toán':
                    statusClass = 'bg-green-100 text-green-700';
                    break;
                  case 'Đã Hủy Booking':
                    statusClass = 'bg-red-100 text-red-700';
                    break;
                  default:
                    statusClass = 'bg-gray-100 text-gray-700';
                }

                return (
                  <tr
                    key={booking.id}
                    className="border-b hover:bg-gray-200 font-semibold"
                  >
                    <td className="py-2 px-4 border border-gray-500 text-center">{booking.id}</td>
                    <td className="py-2 px-4 border border-gray-500 text-center">{booking.tour?.name || 'N/A'}</td>
                    <td className="py-2 px-4 border border-gray-500 text-center">{booking.guestName}</td>
                    <td className="py-2 px-4 border border-gray-500 text-center">{booking.guestPhoneNumber}</td>
                    <td className="py-2 px-4 border border-gray-500 text-center">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                    <td className={`py-2 px-4 border border-gray-500 text-center`}>
                      <span className={`px-4 py-1 rounded-full whitespace-nowrap ${statusClass}`}>{booking.status}</span>
                      </td>
                    <td className="py-2 px-4 border border-gray-500 text-center">{booking.totalPrice.toLocaleString()}</td>
                    <td className="py-2 px-4 border border-gray-500 text-center">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => onViewDetail(booking)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="w-6 h-6"
                            >
                              <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                              <path
                                fillRule="evenodd"
                                d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                                clipRule="evenodd"
                              />
                            </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 0 1 1.414 0L10 7.586l4.293-4.293a1 1 0 0 1 1.414 1.414L11.414 9l4.293 4.293a1 1 0 0 1-1.414 1.414L10 10.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 9 4.293 4.707a1 1 0 0 1 0-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      )}
    </div>
  );
};

export default BookingList;
