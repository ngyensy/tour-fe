import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const TourSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({ startDate: '', tourId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const apiBaseUrl = 'http://localhost:4000/v1/Tourschedule';
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tourIdFromUrl = queryParams.get('tourId');

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiBaseUrl);
      setSchedules(response.data.$values);
    } catch (err) {
      setError('Không thể tải dữ liệu lịch trình.');
    } finally {
      setLoading(false);
    }
  };

  const addSchedule = async () => {
    if (!newSchedule.startDate) return alert('Vui lòng chọn ngày khởi hành!');
    if (!newSchedule.tourId) return alert('Vui lòng chọn Tour ID!');
    try {
      const response = await axios.post(apiBaseUrl, {
        startDate: newSchedule.startDate,
        tourId: newSchedule.tourId,
      });
      setSchedules([...schedules, response.data]);
      setNewSchedule({ startDate: '', tourId: tourIdFromUrl || '' });
    } catch (err) {
      setError('Không thể thêm lịch trình.');
    }
  };

  const removeSchedule = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/${id}`);
      setSchedules(schedules.filter((schedule) => schedule.id !== id));
    } catch (err) {
      setError('Không thể xóa lịch trình.');
    }
  };

  useEffect(() => {
    if (tourIdFromUrl) {
      setSearchTerm(tourIdFromUrl);
      setNewSchedule((prev) => ({ ...prev, tourId: tourIdFromUrl }));
    }
    fetchSchedules();
  }, [tourIdFromUrl]);

  const filteredSchedules = schedules.filter((schedule) =>
    schedule.tourId && schedule.tourId.toString().includes(searchTerm)
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const today = new Date().toISOString().split('T')[0]; // Lấy ngày hôm nay

  return (
    <div className="p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-3xl font-bold mb-6 text-center">Quản lý Ngày khởi hành</h2>

      {/* Thanh tìm kiếm */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo Tour ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-3 rounded-md w-full"
        />
      </div>

      {/* Hiển thị lỗi */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Loading */}
      {loading ? (
        <div className="text-center text-gray-500">Đang tải dữ liệu...</div>
      ) : (
        <>
          {/* Form thêm lịch trình */}
          <div className="mb-6 flex items-center">
            <input
              type="date"
              value={newSchedule.startDate}
              min={today} // Không cho phép chọn ngày đã qua
              onChange={(e) => setNewSchedule({ ...newSchedule, startDate: e.target.value })}
              className="border p-3 rounded-md flex-1 mr-4"
            />
            <button
              onClick={addSchedule}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Thêm
            </button>
          </div>

          {/* Bảng lịch trình */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">STT</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Ngày khởi hành</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Ngày kết thúc</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Tour ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map((schedule, index) => (
                    <tr key={schedule.id}>
                      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2">{formatDate(schedule.startDate)}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {schedule.endDate ? formatDate(schedule.endDate) : 'N/A'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{schedule.tourId}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <button
                          onClick={() => removeSchedule(schedule.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                    >
                      Không tìm thấy lịch trình nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default TourSchedule;
