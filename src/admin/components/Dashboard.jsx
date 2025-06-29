import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faClipboard, faUsers, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [tourCount, setTourCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [data, setData] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]); // Thêm state cho popularCategories
  const [loading, setLoading] = useState(true);
  const [popularTours, setPopularTours] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          tourResponse,
          bookingResponse,
          userResponse,
          revenueResponse,
          revenueChartResponse,
          popularCategoriesResponse,
          popularToursResponse, // Gọi API cho popular categories
        ] = await Promise.all([
          axios.get("http://localhost:4000/v1/tours/count"),
          axios.get("http://localhost:4000/v1/booking/count"),
          axios.get("http://localhost:4000/v1/users/count"),
          axios.get("http://localhost:4000/v1/booking/revenue"),
          axios.get("http://localhost:4000/v1/booking/monthly-revenue"),
          axios.get("http://localhost:4000/v1/booking/popular-categories"), // Gọi API cho popular categories
          axios.get("http://localhost:4000/v1/booking/popular-tours"),
        ]);

        setTourCount(tourResponse.data.count);
        setBookingCount(bookingResponse.data.count);
        setUserCount(userResponse.data.count);
        setTotalRevenue(revenueResponse.data.totalRevenue);
        setData(revenueChartResponse.data.$values);
        setPopularCategories(popularCategoriesResponse.data.$values); // Lưu dữ liệu vào state
        setPopularTours(popularToursResponse.data.$values);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">THỐNG KÊ SỐ LIỆU</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-4">
            <FontAwesomeIcon icon={faPlane} className="text-4xl" />
            <div>
              <h2 className="text-2xl font-semibold">Số lượng Tour</h2>
              <p className="text-3xl font-bold">{tourCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-4">
            <FontAwesomeIcon icon={faClipboard} className="text-4xl" />
            <div>
              <h2 className="text-2xl font-semibold">Số lượng Booking</h2>
              <p className="text-3xl font-bold">{bookingCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-4">
            <FontAwesomeIcon icon={faUsers} className="text-4xl" />
            <div>
              <h2 className="text-2xl font-semibold">Người dùng</h2>
              <p className="text-3xl font-bold">{userCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-4">
            <FontAwesomeIcon icon={faDollarSign} className="text-4xl" />
            <div>
              <h2 className="text-2xl font-semibold">Doanh thu</h2>
              <p className="text-3xl font-bold">{totalRevenue.toLocaleString()} VNĐ</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between mt-8">
        
        <div className="w-[50%] border bg-white rounded-lg p-4">
          <h2 className="text-2xl text-center mb-4 font-semibold">Thống kê doanh thu các tháng năm {new Date().getFullYear()}</h2>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={data} margin={{ top: 20, right: 50, left: 50, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                label={{ value: 'Tháng',
                position: 'insideBottom',
                offset: -5,
                style: { fill: '#FF5733', fontSize: '16px', fontWeight: 'bold' } }} 
              />
              <YAxis 
                label={{ value: 'Doanh thu (VNĐ)',
                angle: -90,
                position: 'insideLeft',
                offset: -32,
                style: { fill: '#4CAF50', fontSize: '16px', fontWeight: 'bold' } }} 
              />
              <Tooltip />
              <Bar dataKey="totalRevenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full md:w-[45%] border bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Tour được yêu thích</h2>
            <ul className="list-disc pl-6">
              {popularTours.map((tour, index) => (
                <li key={index} className="text-lg mb-2">
                  <span className="font-semibold">{tour.tourName}</span>:{" "}
                  <span>{tour.totalVisitors} khách</span>
                </li>
              ))}
            </ul>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
