import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CategoryNav = ({ categoryId, tourName }) => {
  const [categoryName, setCategoryName] = useState(''); // State để lưu tên danh mục
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái loading
  const [error, setError] = useState(null); // State để lưu lỗi nếu có

  // Hàm để gọi API lấy thông tin danh mục dựa trên categoryId
  const fetchCategory = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/v1/Categories/${categoryId}`);
      setCategoryName(response.data.name); // Cập nhật tên danh mục
      setLoading(false); // Tắt trạng thái loading
    } catch (err) {
      console.error('Error fetching category:', err);
      setError('Không thể tải dữ liệu danh mục');
      setLoading(false); // Tắt trạng thái loading nếu lỗi xảy ra
    }
  };

  // Gọi fetchCategory khi component mount hoặc khi categoryId thay đổi
  useEffect(() => {
    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  if (loading) {
    return <div>Đang tải dữ liệu danh mục...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="py-4">
      <div className="container mx-auto px-32">
        <div className="text-black font-[600] text-[1.1rem]
        ">
          <Link to="/" className="hover:underline ">Trang Chủ</Link>
          <span className="mx-2">/</span>
          <Link to={`/Tourlist?destinationPoint=${categoryId}`} className="hover:underline">
            {categoryName || 'Danh mục không tồn tại'}
          </Link>
          <span className="mx-2">/</span>
          <span className='text-blue-600'>{tourName}</span> {/* Hiển thị tên tour */}
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
