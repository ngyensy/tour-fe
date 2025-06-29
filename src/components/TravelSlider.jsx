import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import Banner1 from "../assets/img/1257-dulichtrongnc-danhmuc.jpg"

// Mũi tên trái tuỳ chỉnh
const PreviousArrow = ({ className, onClick }) => {
  return (
    <div
      className={`${className} bg-black hover:bg-blue-200 rounded-full`}
      onClick={onClick}
      style={{ left: '20px', zIndex: 1 }}
    >
    </div>
  );
};

// Mũi tên phải tuỳ chỉnh
const NextArrow = ({ className, onClick }) => {
  return (
    <div
      className={`${className} bg-black hover:bg-blue-200 rounded-full`}
      onClick={onClick}
      style={{ right: '20px', zIndex: 1 }}
    >
    </div>
  );
};

const TravelSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PreviousArrow />
  };

  return (
    <div className="container mx-auto px-1 max-w-7xl"> 
      <div className="container mx-auto px-1 max-w-7xl"> 
        <Slider {...settings}>
        <div>
            <img
              src="https://scontent.fhan15-2.fna.fbcdn.net/v/t39.30808-6/464952156_944898184339055_8095090511433641993_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeG_jqu9zKRDlJqVgPNxCSu-Pl_YVVLLgz0-X9hVUsuDPQdpXBdnFCLX4HNGailrtdh1s61_P9eWEIFjlPpUgKeU&_nc_ohc=Ma76_W3emW0Q7kNvgG7nwk1&_nc_zt=23&_nc_ht=scontent.fhan15-2.fna&_nc_gid=ANVxFXW4TAFaST5WF1VTjMY&oh=00_AYC_7eefxYgeZrD-9zx23eYXTZYaLRzlZsgYVKZwGwZIjA&oe=678E6F2C"
              alt="Destination 2"
              className="w-full h-[640px] object-cover rounded-lg"
            />
          </div>
          <div>
            <img
              src={Banner1}
              alt="Destination 1"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
          <div>
            <img
              src="https://upcontent.vn/wp-content/uploads/2024/07/banner-du-lich-viet-nam-03-1024x640.jpg"
              alt="Destination 3"
              className="w-full h-[auto] object-cover rounded-lg"
            />
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default TravelSlider;
