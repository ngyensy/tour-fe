import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import BookingModal from './BookingModal';
import { useNavigate } from 'react-router-dom'; 


const UserBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

     // State để điều khiển việc hiển thị modal
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
    const fetchBookings = async () => {
        if (!user?.id || !user.token) return;

        try {
            const response = await axios.get('http://localhost:4000/v1/booking', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            // Lọc các booking của người dùng
            const userBookings = (response.data.$values || response.data).filter(
                booking => booking.userId === user.id
            );
            
            setBookings(userBookings);
        } catch (err) {
            setError('Lỗi khi lấy dữ liệu booking');
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    fetchBookings();
}, [user]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Lọc booking theo trạng thái
    const filterBookingsByStatus = (status) => {
        if (status === 'all') {
            return bookings;
        }
        return bookings.filter(booking => booking.status === status);
    };

    // Tìm kiếm booking
    const searchBookings = useMemo(() => {
        return bookings.filter((booking) => {
            const tourName = booking.tour?.name?.toLowerCase() || '';
            const tourId = booking.tour?.id?.toLowerCase() || '';
            const bookingId = booking.id.toLowerCase();
            const searchTermLower = searchTerm.toLowerCase();

            return (
                tourName.includes(searchTermLower) ||
                tourId.includes(searchTermLower) ||
                bookingId.includes(searchTermLower)
            );
        });
    }, [searchTerm, bookings]);

    const cancelBooking = async (bookingId) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn có chắc chắn muốn hủy booking này?',
                text: 'Hành động này không thể hoàn tác!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Có',
                cancelButtonText: 'Không',
            });
    
            if (result.isConfirmed) {
                const response = await axios.put(
                    `http://localhost:4000/v1/booking/${bookingId}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );
    
                // Cập nhật trạng thái booking trong state
                setBookings((prevBookings) =>
                    prevBookings.map((booking) =>
                        booking.id === bookingId ? { ...booking, status: 'Đã Hủy Booking' } : booking
                    )
                );
    
                Swal.fire(
                    'Đã hủy!',
                    'Booking của bạn đã được hủy thành công.',
                    'success'
                );
            }
        } catch (err) {
            console.error('Error canceling booking:', err);
            Swal.fire(
                'Lỗi!',
                'Có lỗi xảy ra khi hủy booking. Vui lòng thử lại.',
                'error'
            );
        }
    };
    

    // Lọc theo trạng thái đã chọn
    const filteredBookings = filterBookingsByStatus(activeTab);
    const finalBookings = searchBookings.length ? searchBookings : filteredBookings;

    const tabs = [
        { key: 'all', label: 'Tất cả' },
        { key: 'Chờ xác nhận', label: 'Chờ xác nhận' },
        { key: 'Đã xác nhận', label: 'Đã xác nhận' },
        { key: 'Đã thanh toán', label: 'Đã thanh toán' },
        { key: 'Đã Hủy Booking', label: 'Đã Hủy Booking' },
    ];

    if (!user) {
        return <div>Bạn cần đăng nhập để xem các tour đã đặt.</div>;
    }

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (bookings.length === 0) {
        return <div>Bạn chưa có đơn đặt nào.</div>;
    }

    return (
        <div className='border p-4 border-gray-500'>
            <div className='border-b border-gray-500 pb-5'>
                <h2 className="text-xl font-bold">Tour đã đặt</h2>
                <p className='text-[1rem] font-medium'>Hãy quản lý Tour một cách thông minh để trải nghiệm đầy đủ dịch vụ của chúng tôi!</p>
            </div>

            {/* Tìm kiếm */}
            <div className="mb-5 mt-2">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên tour, ID tour hoặc ID booking..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-600 rounded"
                />
            </div>

            {/* Tabs trạng thái */}
            <div className="flex gap-4 mb-5 justify-center my-4 border-b border-gray-500 pb-4">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded ${activeTab === tab.key ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Danh sách booking */}
            <ul className="space-y-4">
                {filteredBookings.length === 0 ? (
                    <div className="text-center text-gray-500">Không có booking nào!</div>
                ) : (
                    filteredBookings.map((booking) => (
                        <li key={booking.id} className="border p-4 rounded-lg flex gap-4">
                            <img
                                src={`http://localhost:4000${booking.tour?.image}` || '/default-tour.jpg'}
                                alt={booking.tour?.name}
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <div><strong>Tên tour:</strong> {booking.tour?.name}</div>
                                <div><strong>ID tour:</strong> {booking.tour?.id}</div>
                                <div><strong>ID booking:</strong> {booking.id}</div>
                                <div><strong>Ngày đặt:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</div>
                                <div><strong>Số lượng:</strong> {booking.numberOfAdults} người lớn, {booking.numberOfChildren} trẻ em</div>
                                <div><strong>Tổng tiền:</strong> {formatCurrency(booking.totalPrice)}</div>
                                <div><strong>Trạng thái:</strong> {booking.status}</div>
                                <button 
                                    className="text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-1 px-2 my-2 ml-2 rounded-lg transition-colors duration-300"
                                    onClick={() => {
                                        setSelectedBooking(booking);
                                        setIsModalOpen(true);
                                        
                                    }}>
                                        Xem chi tiết
                                    </button>
                                {/* Nút hủy chỉ hiển thị khi trạng thái là "Chờ xác nhận" */}
                                {booking.status === 'Chờ xác nhận' && (
                                    <button
                                        onClick={() => cancelBooking(booking.id)}
                                        className="text-red-600 border border-red-600 hover:bg-red-600 hover:text-white font-semibold py-1 px-2 my-2 ml-2 rounded-lg transition-colors duration-300"
                                    >
                                        Hủy Booking
                                    </button>
                                )}

                                {booking.status === 'Đã thanh toán' && (
                                    <button
                                    className="text-red-600 border border-red-600 hover:bg-red-600 hover:text-white font-semibold py-1 px-2 my-2 ml-2 rounded-lg transition-colors duration-300"
                                    onClick={() => {
                                            navigate(`/tour/${booking.tour?.id}`);
                                        }}
                                    >
                                        Đánh giá
                                    </button>
                                )}
                            </div>
                        </li>
                    ))
                )}
            </ul>

            {/* Modal hiển thị chi tiết booking */}
             <BookingModal
                isModalOpen={isModalOpen}
                selectedBooking={selectedBooking}
                closeModal={() => setIsModalOpen(false)}
            />       
        </div>
    );
};

export default UserBookings;
