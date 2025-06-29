import React, { useState, useEffect } from "react";
import axios from "axios";

const FilterComponent = ({ onFilterApply }) => {
  const [selectedBudget, setSelectedBudget] = useState("");
  const [departurePoint, setDeparturePoint] = useState("Tất cả");
  const [destinationPoint, setDestinationPoint] = useState("Tất cả");
  const [startDate, setStartDate] = useState("");
  const [categories, setCategories] = useState([]);
  const [tourType, setTourType] = useState("");
  const [transport, setTransport] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  useEffect(() => {
    // Gọi API để lấy danh mục
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:4000/v1/categories");
        setCategories(response.data.$values); // Giả định API trả về danh sách trong response.data
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleApply = () => {
    const budgetRanges = {
      "Dưới 5 triệu": { min: 0, max: 5000000 },
      "Từ 5 - 10 triệu": { min: 5000000, max: 10000000 },
      "Từ 10 - 20 triệu": { min: 10000000, max: 20000000 },
      "Trên 20 triệu": { min: 20000000, max: Infinity },
    };

    const selectedRange = budgetRanges[selectedBudget] || { min: 0, max: Infinity };

    // Truyền tất cả các giá trị lọc vào onFilterApply
    onFilterApply({
      budget: selectedBudget,
      departurePoint,
      destinationPoint: selectedCategory,
      startDate,
      tourType,
      transport,
    });
  };

  const handleReset = () => {
    // Reset tất cả các giá trị về mặc định
    setSelectedBudget("");
    setDeparturePoint("Tất cả");
    setDestinationPoint("Tất cả");
    setStartDate("");
    setTourType("");
    setTransport("");
    setSelectedCategory("Tất cả");

    // Gọi lại filter với các giá trị mặc định
    onFilterApply({
      budget: "",
      departurePoint: "Tất cả",
      destinationPoint: "Tất cả",
      startDate: "",
      tourType: "",
      transport: "",
    });
  };

  // Kiểm tra xem có thay đổi bộ lọc nào không
  const isFilterChanged =
    selectedBudget ||
    departurePoint !== "Tất cả" ||
    selectedCategory !== "Tất cả" ||
    startDate ||
    tourType ||
    transport;

  return (
    <div className="p-4 bg-gray-200 rounded-lg shadow-md w-84">
      {/* Ngân sách */}
      <div className="mb-4">
        <p className="font-bold mb-2">Ngân sách:</p>
        <div className="grid grid-cols-2 gap-2">
          {["Dưới 5 triệu", "Từ 5 - 10 triệu", "Từ 10 - 20 triệu", "Trên 20 triệu"].map((budget) => (
            <button
              key={budget}
              onClick={() => setSelectedBudget(budget)}
              className={`p-2 border rounded-md ${
                selectedBudget === budget ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {budget}
            </button>
          ))}
        </div>
      </div>

      {/* Điểm khởi hành */}
      <div className="mb-4">
          <p className="font-bold mb-2">Điểm khởi hành:</p>
          <select
              className="p-2 border rounded-md w-full max-h-40 overflow-y-auto"
              value={departurePoint}
              onChange={(e) => setDeparturePoint(e.target.value)}
          >
              <option value="Tất cả">Tất cả</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="TP. HCM">TP. HCM</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
              <option value="Hải Phòng">Hải Phòng</option>
              <option value="Cần Thơ">Cần Thơ</option>
              <option value="Nha Trang">Nha Trang</option>
              <option value="Đà Lạt">Đà Lạt</option>
              <option value="Quảng Ninh">Quảng Ninh</option>
              <option value="Vũng Tàu">Vũng Tàu</option>
              <option value="Huế">Huế</option>
              <option value="Quy Nhơn">Quy Nhơn</option>
              <option value="Phú Quốc">Phú Quốc</option>
              <option value="Sapa">Sapa</option>
              <option value="Hạ Long">Hạ Long</option>
          </select>
      </div>

      {/* Điểm đến */}
      <div className="mb-4">
        <p className="font-bold mb-2">Điểm đến:</p>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded-md w-full"
        >
          <option value="Tất cả">Tất cả</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Ngày đi */}
      <div className="mb-4">
        <p className="font-bold mb-2">Ngày đi:</p>
        <input
          type="date"
          className="p-2 border rounded-md w-full"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]} // Set today's date as the minimum
        />
      </div>

      {/* Nút Hủy */}
      {isFilterChanged && (
        <button
          className="w-full mb-2 bg-gray-500 text-white p-2 rounded-md"
          onClick={handleReset}
        >
          Hủy lựa chọn
        </button>
      )}

      {/* Nút Áp dụng */}
      <button
        className="w-full bg-blue-500 text-white p-2 rounded-md"
        onClick={handleApply}
      >
        Tìm kiếm
      </button>

      
    </div>
  );
};

export default FilterComponent;
