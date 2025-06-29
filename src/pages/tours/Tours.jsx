import React, { useState } from 'react';
import { useQuery } from 'react-query';  // Import từ react-query
import axios from 'axios';
import TourCard from './TourCard';

// Hàm lấy dữ liệu từ API
const fetchTours = async () => {
    const { data } = await axios.get('http://localhost:4000/v1/Tours');
    return data.$values || []; 
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