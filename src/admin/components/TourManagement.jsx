import React, { useState } from 'react';
import TourList from '../components/AdminTour/TourList';
import AddTourForm from '../components/AdminTour/AddTourForm';
import UpdateTourForm from '../components/AdminTour/UpdateTour';

const TourManagement = () => {
  const [view, setView] = useState('list');
  const [editTour, setEditTour] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State tìm kiếm chung

  const switchToListView = () => {
    setView('list');
    setEditTour(null);
  };

  const switchToAddTourView = () => {
    setView('addTour');
  };

  const switchToEditTourView = (tour) => {
    setEditTour(tour);
    setView('editTour');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Quản lý Tour</h1>

      <div className="mb-4">
        {view === 'list' ? (
          <>
            <button
              onClick={switchToAddTourView}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Thêm Tour mới
            </button>
            <div className="mt-4">
              {/* Thanh tìm kiếm chung */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo mã hoặc tên tour"
                className="border border-gray-300 rounded px-4 py-2 w-full"
              />
            </div>
          </>
        ) : (
          <button
            onClick={switchToListView}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Quay lại Danh sách Tour
          </button>
        )}
      </div>

      {view === 'list' ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Danh sách Tour</h2>
          {/* Truyền giá trị tìm kiếm cho TourList */}
          <TourList searchQuery={searchQuery} onEdit={switchToEditTourView} />
        </div>
      ) : view === 'addTour' ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Thêm Tour mới</h2>
          <AddTourForm onAddSuccess={switchToListView}/>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Chỉnh sửa Tour</h2>
          <UpdateTourForm tour={editTour} onUpdateSuccess={switchToListView} />
        </div>
      )}
    </div>
  );
};

export default TourManagement;
