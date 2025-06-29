import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookingModal = ({ isModalOpen, selectedBooking, closeModal }) => {
    const [updatedBooking, setUpdatedBooking] = useState(selectedBooking);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTourSchedule = async () => {
            if (selectedBooking?.tourScheduleId) {
                try {
                    setLoading(true);
                    const response = await axios.get(
                        `http://localhost:4000/v1/TourSchedule/${selectedBooking.tourScheduleId}`
                    );
                    const tourSchedule = response.data;

                    if (tourSchedule?.startDate && tourSchedule?.endDate) {
                        // Chỉ ghi đè `startDate` và `endDate`
                        setUpdatedBooking((prevBooking) => ({
                            ...prevBooking, // Giữ nguyên các trường cũ
                            tour: {
                                ...prevBooking.tour, // Giữ nguyên thông tin cũ của tour
                                startDate: tourSchedule.startDate,
                                endDate: tourSchedule.endDate,
                            },
                        }));
                    }
                } catch (error) {
                    console.error('Error fetching tour schedule:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        // Reset `updatedBooking` mỗi khi `selectedBooking` thay đổi
        setUpdatedBooking(selectedBooking);

        if (selectedBooking) {
            fetchTourSchedule();
        }
    }, [selectedBooking]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    if (!isModalOpen || !updatedBooking) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-full sm:w-2/3">
                <h3 className="text-2xl font-bold mb-4">Chi tiết booking</h3>

                {loading ? (
                    <div>Đang tải thông tin...</div>
                ) : (
                    <div className="flex">
                        {/* Thông tin Booking bên trái */}
                        <div className="w-1/2 pr-4">
                            <h4 className="text-xl font-semibold mb-2">Thông tin Booking</h4>
                            <div><strong>ID booking:</strong> {updatedBooking.id}</div>
                            <div><strong>Ngày đặt:</strong> {new Date(updatedBooking.bookingDate).toLocaleDateString()}</div>  

                            {/* Số lượng người lớn và trẻ em với giá tiền */}
                            <div><strong>Số người lớn:</strong> {updatedBooking.numberOfAdults} x {formatCurrency(updatedBooking.tour?.price)}</div>
                            <div><strong>Số trẻ em:</strong> {updatedBooking.numberOfChildren} x {formatCurrency(updatedBooking.tour?.childPrice)}</div>
                            <div><strong>Phụ thu phòng đơn:</strong> {formatCurrency(updatedBooking.totalSingleRoomSurcharge)}</div>
                            <div><strong>Tổng tiền:</strong> {formatCurrency(updatedBooking.totalPrice)}</div>
                            <div><strong>Trạng thái:</strong> {updatedBooking.status}</div>
                        </div>

                        {/* Thông tin Tour bên phải */}
                        <div className="w-1/2 pl-4">
                            <h4 className="text-xl font-semibold mb-2">Thông tin Tour</h4>
                            <div><strong>Tên tour:</strong> {updatedBooking.tour?.name}</div>
                            <div><strong>ID tour:</strong> {updatedBooking.tour?.id}</div>
                            <div><strong>Địa điểm khởi hành:</strong> {updatedBooking.tour?.departureLocation || 'N/A'}</div>
                            <div><strong>Ngày khởi hành:</strong> {updatedBooking.tour?.startDate ? new Date(updatedBooking.tour.startDate).toLocaleDateString() : 'N/A'}</div>
                            <div><strong>Ngày kết thúc:</strong> {updatedBooking.tour?.endDate ? new Date(updatedBooking.tour.endDate).toLocaleDateString() : 'N/A'}</div>
                        </div>
                    </div>
                )}

                {/* Thêm thông tin thanh toán */}
                <div><strong>Phương thức thanh toán:</strong> {updatedBooking.paymentMethod || 'N/A'}</div>

                {/* Nút đóng modal */}
                <button
                    onClick={closeModal}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                >
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default BookingModal;
