import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom'; 
import Home from './pages/Home';
import TourDetail from './pages/tours/TourDetail';
import BookingPage from './pages/Booking';
import TourListPage from './pages/tours/TourListPage';
import LoginForm from './pages/Login';
import RegisterForm from './pages/Register';
import AuthProvider from './context/AuthContext';
import CreateTour from './components/creatTour';
import Contact from './pages/contact';
import Confirmation from './pages/Confirmation';
import DiscountsPage from './pages/Doimagiamgia';
import ChatIconWrapper from './components/ChatIconWapper';
import About from './pages/About'

// ------- Các thành phần admin ---------
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/components/Dashboard';
import TourManagement from './admin/components/TourManagement';
import CategoryManagement from './admin/components/CategoryManagement';
import UserManagement from './admin/components/UserManagement';
import BookingManagement from './admin/components/BookingManagement';
import AdminLoginForm from './admin/AdminLogin'; // Đường dẫn tới form đăng nhập admin
import ProtectedRoute from './context/ProtectedRoute';
import ItineraryManagement from './admin/components/ItinenaryManagement';
import Userinfor from './pages/account-info'
import TourSchedule from './admin/components/TourSchedule';
import Reviews from './admin/components/ReviewMannagement'
import TransactionsPage from './admin/components/TransactionManagement';

// Component AdminRoutes kiểm tra admin từ context
const AdminRoutes = () => {
  return (
    <Routes>
      {/* Route cho Admin Login */}
      <Route path="/admin/login" element={<AdminLoginForm />} />

      {/* Kiểm tra nếu admin đã đăng nhập mới cho phép truy cập các route bên dưới */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute isAdminRoute={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tours" element={<TourManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="tours/itinerary" element={<ItineraryManagement />} />
        <Route path="tours/itineraries/:tourId" element={<ItineraryManagement />} />
        <Route path="tours/tourSchedule" element={<TourSchedule />} />
        <Route path="tours/tourSchedule/:tourId" element={<TourSchedule />} />
        <Route path="tours/reviews" element={<Reviews />} />
        <Route path="tours/transactions" element={<TransactionsPage />} />
      </Route>
    </Routes>
  );
};

const App = () => {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Các route cho người dùng */}
          <Route path="/" element={<Home />} />
          <Route path='/TourList' element={<TourListPage />} />
          <Route path="/tour/:id" element={<TourDetail />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/creatTour" element={<CreateTour />} />
          <Route path="/account-info" element={<Userinfor />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/Doi-thuong" element={<DiscountsPage />} />
          <Route path="/about" element={<About />} />
          {/* Các route cho admin */}
          <Route path="/*" element={<AdminRoutes />} /> {/* Bao bọc AdminRoutes */}
        </Routes>
        <ChatIconWrapper />
      </Router>
    </AuthProvider>
  );
};

export default App;
