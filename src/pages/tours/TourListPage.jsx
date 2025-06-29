import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/TourListPage.css';
import FilterComponent from '../../components/boloctimkiem';
import Navbar from '../../components/Nav';
import TourItem from './TourItem';
import axios from 'axios';
import { useQuery } from 'react-query';
import Footer from '../../components/Footer';
import Erro from '../../assets/img/loikothaytour.png'

// Hàm lấy dữ liệu từ API
const fetchTours = async () => {
  const { data } = await axios.get('http://localhost:4000');
  return data.$values.filter(tour => tour.discount === 0); // Lọc ngay tại đây các tour có discount = 0
};


const fetchCategories = async () => {
  const { data } = await axios.get('http://localhost:4000/v1/Categories');
  return data.$values;
};

const TourListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sortOption, setSortOption] = useState('asc'); // Trạng thái sắp xếp
  const [filters, setFilters] = useState({
    category: 'Tất cả',
    budget: '',
    departurePoint: 'Tất cả',
    destinationPoint: 'Tất cả',
    startDate: '',  // Add startDate
    tourType: '',
    transport: '',
  });

  // Đồng bộ bộ lọc từ URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const initialFilters = {
      category: queryParams.get('category') || 'Tất cả',
      budget: queryParams.get('budget') || '',
      departurePoint: queryParams.get('departurePoint') || 'Tất cả',
      destinationPoint: queryParams.get('destinationPoint') || 'Tất cả',
      startDate: queryParams.get('startDate') || '',
      tourType: queryParams.get('tourType') || '',
      transport: queryParams.get('transport') || '',
    };
    setFilters(initialFilters);
  }, [location.search]);

  // Cập nhật URL khi áp dụng bộ lọc
  const syncFiltersToURL = (newFilters) => {
    const queryParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'Tất cả') queryParams.set(key, value);
    });
    navigate(`?${queryParams.toString()}`);
  };

  // Lấy dữ liệu tour và danh mục từ API
  const { data: tours = [], isLoading: isLoadingTours, isError: isErrorTours } = useQuery('tours', fetchTours);
  const { data: categories = [] } = useQuery('categories', fetchCategories);

  

  // Xác định danh mục được chọn (hoặc là 'Tất cả')
  const selectedCategory = categories.find(
    (category) => category.id === parseInt(filters.destinationPoint)
  );

  const categoryName = selectedCategory ? selectedCategory.name : 'Tất cả các tour';
  const categoryDescription = selectedCategory ? selectedCategory.description : '';

  // Hàm chuyển đổi ngân sách thành khoảng giá
  const getBudgetRange = (budget) => {
    const budgetRanges = {
      'Dưới 5 triệu': { min: 0, max: 5000000 },
      'Từ 5 - 10 triệu': { min: 5000000, max: 10000000 },
      'Từ 10 - 20 triệu': { min: 10000000, max: 20000000 },
      'Trên 20 triệu': { min: 20000000, max: Infinity },
    };
    return budgetRanges[budget] || { min: 0, max: Infinity };
  };

 // Lọc và sắp xếp danh sách tour
  const sortedTours = [...tours]
  .filter((tour) => {
    const { min, max } = getBudgetRange(filters.budget);
    return (
      tour.isActive === true && // Chỉ lấy các tour có trạng thái true
      (filters.departurePoint === 'Tất cả' || tour.departureLocation === filters.departurePoint) &&
      (filters.destinationPoint === 'Tất cả' || tour.categoryId === parseInt(filters.destinationPoint)) &&
      (!filters.budget || (tour.price >= min && tour.price <= max)) &&
      (!filters.startDate || new Date(tour.startDate) >= new Date(filters.startDate))
    );
  })
  .sort((a, b) => {
    const priceA = a.price || 0;
    const priceB = b.price || 0;
    return sortOption === 'asc' ? priceA - priceB : priceB - priceA;
  });


  // Nhận dữ liệu lọc từ FilterComponent
  const handleFilterApply = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    syncFiltersToURL(updatedFilters);
  };

  if (isLoadingTours) return <div>Đang tải dữ liệu...</div>;
  if (isErrorTours) return <div>Lỗi khi tải dữ liệu tour</div>;

  return (
    <div>
      <Navbar />
      <div className="tour-list-page">
        <div>
          <h1 className="category-title text-center font-bold">{categoryName}</h1>
          {categoryDescription && (
            <p className="category-description">
              {categoryDescription}
            </p>
          )}
        </div>
        <div className="content flex">
          <div className="sidebar bg-white shadow-none mt-6">
            <p className="font-bold text-xl mb-4">Bộ Lọc Tìm Kiếm</p>
            <FilterComponent filters={filters} onFilterApply={handleFilterApply} />
          </div>
          <div className="main-content mt-6 ml-4 w-full">
            <div className="flex border-b-2 border-gray-400 p-3 justify-between items-center mb-6">
            <p className="font-normal text-[20px]">
              {sortedTours.length > 0
                ? <>Tìm thấy <strong className='text-blue-500'>{sortedTours.length}</strong> chương trình tour cho Quý khách</>
                : 'Không tìm thấy chương trình tour nào'}
            </p>
              <div className="sort-section flex items-center">
                <p className="font-normal text-lg">Sắp xếp theo:</p>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="ml-2 p-2 border rounded"
                >
                  <option value="asc">Giá tăng dần</option>
                  <option value="desc">Giá giảm dần</option>
                </select>
              </div>
            </div>
            <div className="tour-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedTours.length > 0 ? (
                sortedTours.map((tour) => <TourItem key={tour.id} tour={tour} />)
              ) : (
                <div className="items-center">
                  <img
                    src={Erro}
                    alt="Error"
                    className="w-[800px] h-[400px]" // Kích thước cố định cho ảnh
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TourListPage;
