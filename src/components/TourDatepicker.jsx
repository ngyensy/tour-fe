import React, { useState } from 'react';

const TourDatePicker = ({ tourData, onSelectDate }) => {
  // Lấy danh sách các ngày khởi hành từ tourSchedules
  const tourSchedules = tourData.tourSchedules.$values;
  
  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    onSelectDate(selectedDate); // Gửi ngày người dùng chọn lên component cha
  };

  return (
    <div className="flex flex-col items-center p-4">
      <label htmlFor="date-picker" className="text-lg font-semibold mb-2">
        Chọn ngày khởi hành khác:
      </label>
      
      {/* Hiển thị danh sách các ngày từ tourSchedules */}
      <select
        id="date-picker"
        onChange={handleDateChange}
        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Chọn ngày</option>
        {tourSchedules.map((schedule) => (
          <option key={schedule.id} value={schedule.startDate}>
            {new Date(schedule.startDate).toLocaleDateString()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TourDatePicker;
