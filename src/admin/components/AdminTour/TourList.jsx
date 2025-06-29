import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt, FaRoute, FaClock } from 'react-icons/fa';
import UpdateTourForm from '../AdminTour/UpdateTour';

const TourList = ({ searchQuery, onEdit }) => {
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  const fetchTours = async () => {
    try {
      const response = await axios.get('http://localhost:4000/v1/tours');
      setTours(response.data.$values || response.data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleDelete = async (tourId) => {
    try {
      await axios.delete(`http://localhost:4000/v1/tours/${tourId}`);
      setTours((prevTours) => prevTours.filter((tour) => tour.id !== tourId));
    } catch (error) {
      console.error('Error deleting tour:', error);
    }
  };

  const handleEdit = (tour) => {
    setSelectedTour(tour);
    onEdit(tour);
  };

  const handleUpdateSuccess = () => {
    fetchTours();
    setSelectedTour(null);
  };

  const handleItinerary = (tourId) => {
    navigate(`/admin/tours/itinerary?tourId=${tourId}`);
  };

  const handleTourschedule = (tourId) => {
    navigate(`/admin/tours/tourSchedule?tourId=${tourId}`);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const filteredTours = tours
    .filter((tour) =>
      tour.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((tour) => {
      if (filterStatus === 'all') return true;
      return filterStatus === 'active' ? tour.isActive === true : tour.isActive === false;
    });

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-4 shadow-lg rounded-lg">
      {selectedTour ? (
        <UpdateTourForm tour={selectedTour} onUpdateSuccess={handleUpdateSuccess} />
      ) : (
        <>
          <div className="mb-4 flex items-center justify-end">
            <label className="mr-2 text-gray-700 font-semibold">Lọc trạng thái:</label>
            <select
              value={filterStatus}
              onChange={handleFilterChange}
              className="px-3 py-2 border rounded shadow focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="all">Tất cả</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
          </div>

          {filteredTours.length > 0 ? (
            <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-gray-200 to-gray-300 text-center">
                  <th className="border border-gray-400 px-4 py-2">STT</th>
                  <th className="border border-gray-400 px-4 py-2">Hình Ảnh</th>
                  <th className="border border-gray-400 px-4 py-2">Tên Tour</th>
                  <th className="border border-gray-400 px-4 py-2">Trạng Thái</th>
                  <th className="border border-gray-400 px-4 py-2">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {filteredTours.map((tour, index) => (
                  <tr key={tour.id} className="hover:bg-gray-100 text-center">
                    <td className="border border-gray-400 px-4 py-2 font-bold text-gray-700">{index + 1}</td>
                    <td className="border border-gray-400 px-4 py-2 whitespace-nowrap">
                      <div className="flex justify-center">
                        <img
                          src={`http://localhost:4000${tour.image}`}
                          alt={tour.name}
                          className="h-20 w-32 object-cover rounded shadow-md"
                        />
                      </div>
                    </td>
                    <td className="border border-gray-400 px-4 py-2 font-semibold text-gray-800">{tour.name}</td>
                    <td className="border border-gray-400 px-6 py-2">
                      {tour.isActive ? (
                        <span className="bg-green-200 text-green-700 px-4 py-1 rounded-full whitespace-nowrap">Đang hoạt động</span>
                      ) : (
                        <span className="bg-red-200 text-red-700 px-4 py-1 rounded-full whitespace-nowrap">Ngừng hoạt động</span>
                      )}
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleEdit(tour)}
                          className="bg-yellow-400 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-yellow-500 shadow"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(tour.id)}
                          className="bg-red-500 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-600 shadow"
                        >
                          <FaTrashAlt />
                        </button>
                        <button
                          onClick={() => handleItinerary(tour.id)}
                          className="bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-600 shadow"
                        >
                          <FaRoute />
                        </button>
                        <button
                          onClick={() => handleTourschedule(tour.id)}
                          className="bg-green-400 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-green-500 shadow"
                        >
                          <FaClock />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Không tìm thấy tour nào.</p>
          )}
        </>
      )}
    </div>
  );
};

export default TourList;
