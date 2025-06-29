import React, { useState } from 'react';
import { useQuery } from 'react-query';  // Import từ react-query
import axios from 'axios';
import TourCard from './TourCard';

const API_URL = import.meta.env.VITE_API_URL;


// Hàm lấy dữ liệu từ API
export const fetchTours = async () => {
  const res = await axios.get(`${API_URL}/Tours`);
  return res.data?.$values || [];
};

const Tours = () => {
    const [visibleProducts, setVisibleProducts] = useState(6); // Số sản phẩm hiển thị ban đầu

    // Sử dụng useQuery để lấy dữ liệu
    const { data: tours = [], error, isLoading, isError } = useQuery('tours', fetchTours);

    const handleShowMore = () => {
        setVisibleProducts((prev) => prev + 6); // Tăng số sản phẩm hiển thị lên 6 mỗi lần nhấp
    };

    // Xử lý trạng thái loading, error
    if (isLoading) return <div>Đang tải dữ liệu...</div>;
    if (isError) return <div>Lỗi: {error.message}</div>;

    // Lọc các tour có trạng thái là true
    const activeTours = tours.filter((tour) => tour.isActive === true && tour.discount === 0);

    return (
        <div>
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
                {activeTours.slice(0, visibleProducts).map((tour, index) => (
                    <TourCard key={index} tour={tour} />
                ))}
            </div>
        </div>
    );
};

export default Tours;