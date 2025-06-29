import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';

const UpdateTourForm = ({ tour, onUpdateSuccess }) => {
  const [tourData, setTourData] = useState({
    id: tour.id || '',
    name: tour.name || '',
    description: tour.description || '',
    Price: tour.price || 0,
    childPrice: tour.childPrice || 0,
    discount: tour.discount || 0,
    departureLocation: tour.departureLocation || '',
    destination: tour.destination || '',
    startDate: tour.startDate ? new Date(tour.startDate) : null,
    endDate: tour.endDate ? new Date(tour.endDate) : null,
    duration: tour.duration || 0,
    availableSlots: tour.availableSlots || 0,
    isActive: tour.isActive || true,
    categoryId: tour.categoryId || '',
    image: tour.image,
    singleRoomSurcharge: tour.singleRoomSurcharge || 0,
  });

  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const today = new Date();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:4000/v1/categories');
        if (Array.isArray(response.data.$values)) {
          setCategories(response.data.$values);
        } else {
          console.error('API trả về không phải là mảng:', response.data);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (Array.isArray(categories)) {
      const results = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(results);
    } else {
      setFilteredCategories([]);
    }
  }, [searchTerm, categories]);

  const formatNumber = (value) => {
    if (!value) return '';
    return Number(value).toLocaleString('vi-VN', { maximumFractionDigits: 0 });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value.replace(/\./g, '');
    newValue = newValue.replace(/[^0-9]/g, '');
    setTourData({
      ...tourData,
      [name]: name === 'departureLocation' || name === 'destination' || name ==='name' || name === 'description' ? value : newValue,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imagePreviewUrl = URL.createObjectURL(file);
      setTourData({
        ...tourData,
        image: file,
        imagePreview: imagePreviewUrl,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const startDate = new Date(tourData.startDate);
    const endDate = new Date(tourData.endDate);

    if (startDate >= endDate) {
      alert("Ngày khởi hành phải trước ngày kết thúc.");
      return;
    }

    const formData = new FormData();
    formData.append('StartDate', startDate.toISOString());
    formData.append('EndDate', endDate.toISOString());

    Object.keys(tourData).forEach((key) => {
      if (key !== 'startDate' && key !== 'endDate') {
        formData.append(key, tourData[key]);
      }
    });

    axios.put(`http://localhost:4000/v1/tours/${tourData.id}`, formData)
    .then(response => {
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Cập nhật Tour thành công!',
        confirmButtonText: 'OK'
      }).then(() => {
        // Chỉ chạy onUpdateSuccess() sau khi người dùng nhấn OK
        onUpdateSuccess();
      });
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Thất bại',
        text: error.response?.data?.message || 'Cập nhật Tour thất bại!',
        confirmButtonText: 'OK'
      });
    });
};

  const handleCategorySelect = (category) => {
    setTourData({
      ...tourData,
      categoryId: category.id,
    });
    setSearchTerm(category.name);
    setFilteredCategories([]);
  };

  const currentCategory = categories.find(category => category.id === tourData.categoryId);

  return (
    <div className="bg-white p-6 shadow-md rounded">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-gray-700">Tên tour</label>
          <input
            type="text"
            name="name"
            value={tourData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Mô tả</label>
          <textarea
            name="description"
            value={tourData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Giá người lớn</label>
          <input
            type="text"
            name="Price"
            value={formatNumber(tourData.Price)}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Giá trẻ em</label>
          <input
            type="text"
            name="childPrice"
            value={formatNumber(tourData.childPrice)}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Giá phụ phòng đơn</label>
          <input
            type="text"
            name="singleRoomSurcharge"
            value={formatNumber(tourData.singleRoomSurcharge)}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 ">Giảm giá (%)</label>
          <input
            type="number"
            value={tourData.discount}
            onChange={(e) => setTourData({ ...tourData, discount: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded"
            placeholder="Nhập mức giảm giá"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Nơi khởi hành</label>
          <input
            type="text"
            name="departureLocation"
            value={tourData.departureLocation}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Điểm đến</label>
          <input
            type="text"
            name="destination"
            value={tourData.destination}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Ngày bắt đầu</label>
          <DatePicker
            selected={tourData.startDate}
            onChange={(date) => setTourData({ ...tourData, startDate: date })}
            dateFormat="dd/MM/yyyy"
            minDate={today}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Ngày kết thúc</label>
          <DatePicker
            selected={tourData.endDate}
            onChange={(date) => setTourData({ ...tourData, endDate: date })}
            dateFormat="dd/MM/yyyy"
            minDate={tourData.startDate ? new Date(tourData.startDate) : today}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Thời gian (ngày)</label>
          <input
            type="number"
            name="duration"
            value={tourData.duration}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Số chỗ còn trống</label>
          <input
            type="number"
            name="availableSlots"
            value={tourData.availableSlots}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-2 border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Trạng thái hoạt động</label>
          <select
            name="isActive"
            value={tourData.isActive ? 'true' : 'false'}
            onChange={(e) => setTourData({ ...tourData, isActive: e.target.value === 'true' })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded"
          >
            <option value="true">Hoạt động</option>
            <option value="false">Ngừng hoạt động</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Danh mục</label>
          <div className="relative">
            {/* Hiển thị tên danh mục hiện tại nếu có */}
            <div className="w-full px-4 py-2 border-2 border-gray-300 rounded bg-gray-100 cursor-pointer">
              {currentCategory ? currentCategory.name : 'Chưa chọn danh mục'}
            </div>
            {/* Thanh tìm kiếm danh mục */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm danh mục"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded mt-2"
            />
            {/* Hiển thị danh sách các danh mục tìm thấy */}
            {searchTerm && filteredCategories.length > 0 && (
              <ul className="absolute w-full mt-2 border border-gray-300 bg-white shadow-lg z-10">
                {filteredCategories.map((category) => (
                  <li
                    key={category.id}
                    onClick={() => handleCategorySelect(category)}
                    className="cursor-pointer hover:bg-gray-200 p-2"
                  >
                    {category.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Ảnh</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded"
          />
          {/* Kiểm tra nếu có ảnh preview từ người dùng tải lên */}
          {tourData.imagePreview ? (
            <img
              src={tourData.imagePreview}
              alt="Preview"
              className="mt-2 w-full h-40 object-cover"
            />
          ) : (
            // Nếu không có ảnh preview, hiển thị ảnh hiện tại của tour từ API
            tourData.image && (
              <img
                // Nối địa chỉ API với đường dẫn ảnh tương đối
                src={`http://localhost:4000/${tourData.image}`}
                alt="Current tour image"
                className="mt-2 w-full h-52 object-cover"
              />
            )
          )}
        </div>

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Cập nhật tour
        </button>
      </form>
    </div>
  );
};

export default UpdateTourForm;
