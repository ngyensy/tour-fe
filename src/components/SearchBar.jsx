import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [destination, setDestination] = useState('');
  const [destinationId, setDestinationId] = useState('');  // Thêm state để lưu id của địa danh
  const [departureDate, setDepartureDate] = useState('');
  const [budget, setBudget] = useState('');
  const [errors, setErrors] = useState({});
  const [destinations, setDestinations] = useState([]); // Dữ liệu danh mục điểm đến
  const [filteredDestinations, setFilteredDestinations] = useState([]); // Danh sách địa danh đã lọc theo input

  const navigate = useNavigate(); 

  // Hàm lấy danh sách điểm đến từ API
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('http://localhost:4000/v1/categories'); // Đường dẫn API để lấy danh sách điểm đến
        setDestinations(response.data.$values); // Lưu vào state destinations
        setFilteredDestinations(response.data.$values); // Lưu vào state filteredDestinations
      } catch (error) {
        console.error("Lỗi khi lấy danh sách điểm đến:", error);
      }
    };
    fetchDestinations();
  }, []);

  // Hàm kiểm tra các trường đầu vào
  const validateFields = () => {
    let validationErrors = {};

    return validationErrors;
  };

  // Hàm tìm kiếm
  const handleSearch = () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      console.log({
        destinationId,  // Gửi id thay vì tên
        departureDate,
        budget,
      });
      // Điều hướng đến TourListPage và truyền các tham số tìm kiếm qua URL
      navigate(`/Tourlist?destinationPoint=${destinationId}&departureDate=${departureDate}&budget=${budget}`);
    }
  };

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi'); // Regex tìm kiếm không phân biệt hoa thường
    return text.replace(regex, '<span class="text-blue-500 font-semibold">$1</span>'); // Tô màu xanh chữ tìm kiếm
  };
  

  // Hàm lọc gợi ý địa danh khi người dùng nhập vào
  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setDestination(inputValue);

    // Lọc danh sách địa danh theo tên
    const filtered = destinations.filter((category) =>
      category.name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredDestinations(filtered);
  };

  return (
    <div className="bg-white shadow-2xl rounded-lg py-8 px-12 w-3/4 mx-auto my-12">
      <div className="flex items-center justify-between space-x-4">
        {/* Danh mục điểm đến */}
        <div className="flex flex-col w-1/4">
          <label className="font-bold">Bạn muốn đi đâu? *</label>
          <div className="relative">
            <input
              type="text"
              className={`border rounded-lg p-2 mt-1 w-full ${errors.destination ? 'border-red-500' : 'border-black'}`}
              value={destination} // Hiển thị tên địa danh đã chọn
              onChange={handleInputChange}
              placeholder="Nhập điểm đến..."
            />
            {/* Hiển thị danh sách gợi ý khi có ít nhất một ký tự nhập vào */}
            {destination && (
              <ul className="absolute bg-white border rounded-lg border-gray-300 w-full p-2 mt-1 max-h-60 overflow-y-auto z-10">
                {destination && filteredDestinations.length > 0 && (
                  <p className="text-sm font-medium">Điểm đến</p>
                )}
                {filteredDestinations.map((category) => (
                  <li
                    key={category.id}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      setDestination(category.name); // Gán tên địa danh vào input
                      setDestinationId(category.id); // Gán id địa danh vào state destinationId
                      setFilteredDestinations([]); // Ẩn gợi ý sau khi chọn
                    }}
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightText(category.name, destination), // Gọi hàm highlight
                      }}
                    />
                  </li>
                ))}
                {destination && filteredDestinations.length > 0 && (
                  <p className="text-sm font-medium">Điểm thăm quan</p>
                )}
              </ul>
            )}
          </div>
          {errors.destination && <p className="text-red-500 text-sm">{errors.destination}</p>}
        </div>


        {/* Ngày đi */}
        <div className="flex flex-col w-1/4">
          <label className="font-bold">Ngày đi</label>
          <input
            type="date"
            className="border border-black rounded-lg p-2 mt-1"
            value={departureDate}
            min={new Date().toISOString().split("T")[0]}  // Chỉ cho phép chọn ngày hiện tại và tương lai
            onChange={(e) => setDepartureDate(e.target.value)}
          />
        </div>

        {/* Ngân sách */}
        <div className="flex flex-col w-1/4">
          <label className="font-bold">Ngân sách</label>
          <select
            className="border border-black rounded-lg p-2 mt-1"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            <option value="">Chọn mức giá</option>
            <option value="Dưới+5+triệu">Dưới 5 triệu</option>
            <option value="Từ+5+-+10+triệu">5 - 10 triệu</option>
            <option value="Từ+10+-+20+triệu">Từ 10 - 20 triệu</option>
            <option value="Trên+20+triệu">Trên 20 triệu</option>
          </select>
        </div>

        {/* Nút tìm kiếm */}
        <div className="flex items-center w-1/8">
          <button
            className="bg-blue-600 text-white p-3 rounded-lg flex items-center mt-5"
            onClick={handleSearch}
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
