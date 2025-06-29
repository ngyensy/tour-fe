import React from 'react';
import Navbar from '../components/Nav'
import TravelSlider from '../components/TravelSlider';
import Section from './tours/Section';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import Discover from '../pages/tours/Discover'
import Tours from './tours/Tours';
import TourDiscount from './tours/TourDiscount';

const Home = () => {
    return (
      <div>
        <Navbar />
        <TravelSlider />
        <SearchBar />

        <Section 
          title="Ưu đãi khủng!!!" 
          description="Nhanh tay nắm bắt cơ hội giảm giá cuối cùng. Đặt ngay để không bỏ lỡ!" 
          content={<TourDiscount/>}
        />

        <Discover
          title="Khám phá sản phẩm của chúng tôi"
          description="Hãy tận hưởng trải nghiệm du lịch chuyên nghiệp, mang lại cho bạn những khoảnh khắc tuyệt vời và nâng tầm cuộc sống. Chúng tôi cam kết mang đến những chuyến đi đáng nhớ, giúp bạn khám phá thế giới theo cách hoàn hảo nhất."
        />

        <Section 
          title="Điểm đến yêu thích" 
          description="" 
          content={<Tours/>}
        />
        <Footer />
      </div>
    );
  };
  
  export default Home;