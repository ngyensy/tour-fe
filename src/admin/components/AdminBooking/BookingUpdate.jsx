import { useState, useEffect } from 'react';

const UpdateBookingForm = ({ booking, onUpdate, onCancel }) => {
  // Tạo state để lưu giá trị cập nhật của booking
  const [updatedBooking, setUpdatedBooking] = useState({
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    guestPhoneNumber: booking.guestPhoneNumber,
    guestAddress: booking.guestAddress,
    numberOfAdults: booking.numberOfAdults,
    numberOfChildren: booking.numberOfChildren,
    totalPrice: booking.totalPrice,
    notes: booking.notes,
    paymentMethod: booking.paymentMethod, // Thêm PaymentMethod
    status: booking.status,
    totalSingleRoomSurcharge: booking.totalSingleRoomSurcharge 
  });

  // Cập nhật state khi booking thay đổi
  useEffect(() => {
    setUpdatedBooking({
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhoneNumber: booking.guestPhoneNumber,
      guestAddress: booking.guestAddress,
      numberOfAdults: booking.numberOfAdults,
      numberOfChildren: booking.numberOfChildren,
      totalPrice: booking.totalPrice,
      notes: booking.notes,
      paymentMethod: booking.paymentMethod, // Thêm PaymentMethod
      status: booking.status,
      totalSingleRoomSurcharge: booking.totalSingleRoomSurcharge // Thêm Status
    });
  }, [booking]);

  // Tính lại tổng tiền khi số người lớn hoặc trẻ em thay đổi
  const calculateTotalPrice = (numberOfAdults, numberOfChildren, totalSingleRoomSurcharge, discount) => {
    const adultPrice = booking.tour?.price || 0;
    const childPrice = booking.tour?.childPrice || 0;
    const singleRoomPrice = totalSingleRoomSurcharge || 0;
  
    // Áp dụng giảm giá nếu có
    const adultPriceAfterDiscount = adultPrice * (1 - (discount / 100)); // Giảm giá theo tỷ lệ phần trăm
    const childPriceAfterDiscount = childPrice * (1 - (discount / 100));
  
    // Tính tổng tiền
    return (numberOfAdults * adultPriceAfterDiscount) + (numberOfChildren * childPriceAfterDiscount) + singleRoomPrice;
  };
  
  
  // Cập nhật state khi người dùng nhập
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Chuyển giá trị sang kiểu số nếu là số
    const newValue = name === 'totalSingleRoomSurcharge' || name === 'numberOfAdults' || name === 'numberOfChildren'
      ? Number(value)
      : value;
  
    setUpdatedBooking((prev) => {
      const updated = {
        ...prev,
        [name]: newValue,
      };
  
      // Cập nhật lại tổng tiền khi số người lớn, số trẻ em hoặc phụ thu phòng đơn thay đổi
      if (name === 'numberOfAdults' || name === 'numberOfChildren' || name === 'totalSingleRoomSurcharge') {
        updated.totalPrice = calculateTotalPrice(updated.numberOfAdults, updated.numberOfChildren, updated.totalSingleRoomSurcharge, booking.tour?.discount || 0);
      }
  
      return updated;
    });
  };
  

  // Gửi dữ liệu cập nhật khi form được submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!booking.id) {
        console.error("Booking ID is missing. Cannot update the booking.");
        return;
    }
    onUpdate({ ...updatedBooking, tourId: booking.tourId, id: booking.id }); // Thêm ID vào dữ liệu gửi đi
    };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white to-gray-50 p-4 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Cập nhật Booking</h2>

      <div className="mb-2">
        <label className="block font-bold">Tên Người Đặt</label>
        <input
          type="text"
          name="guestName"
          value={updatedBooking.guestName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block font-bold">Email</label>
        <input
          type="email"
          name="guestEmail"
          value={updatedBooking.guestEmail}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block font-bold">Số Điện Thoại</label>
        <input
          type="text"
          name="guestPhoneNumber"
          value={updatedBooking.guestPhoneNumber}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block font-bold">Địa Chỉ</label>
        <input
          type="text"
          name="guestAddress"
          value={updatedBooking.guestAddress}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block font-bold">Số Người Lớn</label>
        <input
          type="number"
          name="numberOfAdults"
          value={updatedBooking.numberOfAdults}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block font-bold">Số Trẻ Em</label>
        <input
          type="number"
          name="numberOfChildren"
          value={updatedBooking.numberOfChildren}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block font-bold">Phụ thu phòng đơn</label>
        <input
          type="text"
          name="totalSingleRoomSurcharge"
          value={updatedBooking.totalSingleRoomSurcharge}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block font-bold">Tổng Tiền</label>
        <input
          type="text"
          name="totalPrice"
          value={updatedBooking.totalPrice.toLocaleString()}
          readOnly
          className="w-full p-2 border rounded bg-gray-200"
        />
      </div>

      <div className="mb-2">
        <label className="block font-bold">Ghi Chú</label>
        <textarea
          name="notes"
          value={updatedBooking.notes}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Thêm trường cho PaymentMethod */}
      <div className="mb-2">
        <label className="block font-bold">Phương Thức Thanh Toán</label>
        <input
          type="text"
          name="paymentMethod"
          value={updatedBooking.paymentMethod}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Thêm trường cho Status */}
      <div className="mb-2">
        <label className="block font-bold">Trạng Thái</label>
        <select
          name="status"
          value={updatedBooking.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Đã xác nhận">Đã xác nhận</option>
          <option value="Chờ xác nhận">Chờ xác nhận</option>
          <option value="Đã Hủy Booking">Đã Hủy Booking</option>
          <option value="Đã thanh toán">Đã thanh toán</option>
        </select>
      </div>

      <div className="flex justify-between mt-4">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Cập nhật
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
          Hủy
        </button>
      </div>
    </form>
  );
};

export default UpdateBookingForm;
