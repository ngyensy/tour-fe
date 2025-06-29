import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';

const AddTourForm = ({ onAddSuccess }) => {
  const [tourData, setTourData] = useState({
    name: '',
    description: '',
    price: '',
    childPrice: '',
    singleRoomSurcharge: 0,
    discount: '',
    departureLocation: '',
    destination: '',
    startDate: null,
    endDate: null,
    duration: 0,
    availableSlots: 0,
    isActive: true,
    categoryId: '',
    image: null,
  });
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const today = new Date();

  // Lấy danh sách danh mục
  useEffect(() => {
    axios.get('http://localhost:4000/v1/categories')
      .then((res) => setCategories(res.data.$values || []))
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  // Lọc danh mục theo từ khóa
  useEffect(() => {
    setFilteredCategories(categories.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }, [searchTerm, categories]);

  // Hàm xử lý thay đổi chung
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTourData({ ...tourData, [name]: name === "price" || name === "childPrice" || name === "singleRoomSurcharge"
      ? value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.') : value });
  };

  // Xử lý chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setTourData({ ...tourData, image: file });
    setPreviewImage(file ? URL.createObjectURL(file) : null);
  };

  const handleCategorySelect = (cat) => {
    setTourData({
      ...tourData,
      categoryId: cat.id,
    });
    setSearchTerm(cat.name);
    setFilteredCategories([]);
  };


  // Gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (new Date(tourData.startDate) >= new Date(tourData.endDate)) {
      Swal.fire('Lỗi', 'Ngày khởi hành phải trước ngày kết thúc!', 'error');
      return;
    }
  
    const formData = new FormData();
  
    Object.entries(tourData).forEach(([key, value]) => {
      if (key === "price" || key === "childPrice" || key === "singleRoomSurcharge") {
        // Xử lý giá trị tiền tệ (loại bỏ dấu chấm)
        formData.append(key, value.replace(/\./g, ''));
      } else if (key === "startDate" || key === "endDate") {
        // Chuyển đổi ngày thành ISO string
        formData.append(key, value ? new Date(value).toISOString() : '');
      } else {
        // Xử lý các trường còn lại
        formData.append(key, value);
      }
    });
  
    try {
      const res = await axios.post('http://localhost:4000/v1/tours', formData);
      if (res.status === 200) {
        Swal.fire('Thành công!', 'Tạo tour thành công!', 'success').then(() => onAddSuccess());
      }
    } catch (error) {
      Swal.fire('Lỗi', 'Đã xảy ra lỗi, vui lòng thử lại.', 'error');
    }
  };
  
 
  return (
    <div className="bg-white p-6 shadow-md rounded">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nhập liệu cơ bản */}
        {[
          { label: 'Tên tour', name: 'name' },
          { label: 'Mô tả', name: 'description', type: 'textarea' },
          { label: 'Giá người lớn', name: 'price' },
          { label: 'Giá trẻ em', name: 'childPrice' },
          { label: 'Phụ phí phòng đơn', name: 'singleRoomSurcharge' },
          { label: 'Giảm giá (%)', name: 'discount', type: 'number' },
          { label: 'Nơi khởi hành', name: 'departureLocation' },
          { label: 'Điểm đến', name: 'destination' },
          { label: 'Thời gian (ngày)', name: 'duration', type: 'number' },
          { label: 'Số chỗ còn trống', name: 'availableSlots', type: 'number' },
        ].map(({ label, name, type }) => (
          <div key={name} className="mb-4">
            <label className="block text-gray-700">{label}</label>
            {type === 'textarea' ? (
              <textarea name={name} value={tourData[name]} onChange={handleChange} className="w-full px-4 py-2 border rounded border-gray-700" />
            ) : (
              <input type={type || 'text'} name={name} value={tourData[name]} onChange={handleChange} className="w-full px-4 py-2 border rounded border-gray-700" />
            )}
          </div>
        ))}

        {/* Chọn ngày */}
        <div className="mb-4">
          <label className="block text-gray-700">Ngày bắt đầu</label>
          <DatePicker
            selected={tourData.startDate}
            onChange={(date) => setTourData({ ...tourData, startDate: date })}
            minDate={today}
            className="w-full px-4 py-2 border rounded border-gray-700"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Ngày kết thúc</label>
          <DatePicker
            selected={tourData.endDate}
            onChange={(date) => setTourData({ ...tourData, endDate: date })}
            minDate={tourData.startDate || today}
            className="w-full px-4 py-2 border rounded border-gray-700"
          />
        </div>

        {/* Tìm kiếm danh mục */}
        <div className="mb-4 col-span-2">
          <label className="block text-gray-700">Danh mục</label>
          <input
            type="text"
            placeholder="Tìm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded border-gray-700"
          />
          {searchTerm && filteredCategories.length > 0 && (
            <ul className="border rounded max-h-40 overflow-auto">
              {filteredCategories.map((cat) => (
                <li key={cat.id} onClick={() => handleCategorySelect(cat)} className="p-2 cursor-pointer hover:bg-gray-200">
                  {cat.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Ảnh */}
        <div className="mb-4 col-span-2">
          <label className="block text-gray-700 ">Ảnh tour</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-4 py-2 border rounded border-gray-700" />
          {previewImage && <img src={previewImage} alt="Preview" className="mt-4 max-w-12 h-auto" />}
        </div>

        {/* Nút submit */}
        <div className="col-span-2">
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Tạo Tour
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTourForm;
