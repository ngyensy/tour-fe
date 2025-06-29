import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, ClockIcon, CurrencyDollarIcon, TicketIcon } from '@heroicons/react/24/outline';

const TourCard = ({ tour }) => {
  // Giới hạn số ký tự cho tên tour
  const titleLimit = 60;

  // Hàm để cắt bớt tên tour
  const getShortTitle = (title) => {
    return title.length > titleLimit ? `${title.substring(0, titleLimit)}...` : title;
  };

  // Tính giá sau khi áp dụng giảm giá
  const calculateDiscountPrice = (price, discount) => {
    if (!discount || discount <= 0) return price;
    const discountAmount = (price * discount) / 100;
    return price - discountAmount;
  };

  // Giá người lớn sau khi áp dụng giảm giá
  const adultDiscountPrice = calculateDiscountPrice(tour.price, tour.discount);


  return (
    <Link to={`/tour/${tour.id}`} className="bg-white shadow-md rounded-lg overflow-hidden w-[350px] h-[480px] flex flex-col hover:shadow-lg transition-shadow duration-200">
      {/* Bọc div với class để đảm bảo kích thước */}
      <div className='w-full h-full flex flex-col'>
        {/* Ảnh tour với chiều cao cố định và hiệu ứng hover */}
        <img 
          src={`http://localhost:4000${tour.image}`} 
          alt={tour.name} 
          className="w-full h-[200px] object-cover rounded-t-lg transition-transform duration-200 transform" 
        />
        {/* Nội dung thông tin tour */}
        <div className="px-3 py-1 flex-grow flex flex-col justify-between">

          {/* Tên tour */}
          <div>
            <h2 className="text-[1.2rem] font-semibold mb-2 max-w-[380px]">{getShortTitle(tour.name)}</h2>
          </div>

          {/* Mã tour */}
          <div className="flex items-center mb-1">
            <TicketIcon className="w-6 h-6 text-gray-600 mr-2" />
            <strong className="">{tour.id}</strong>
          </div>

          {/* Địa điểm khởi hành */}
          <div className="flex items-center font-semibold mb-1">
            <MapPinIcon className="w-6 h-6 text-gray-600 mr-2" />
            <span className="">Khởi hành:</span> 
            <span className="text-blue-600 font-bold px-1">{tour.departureLocation}</span>
          </div>

           {/* Ngày khởi hành */}
           <div className="flex items-center font-semibold mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
            <path fill="#000" fillRule="evenodd" d="M3 20.535C3 21.345 3.656 22 4.465 22h15.07c.81 0 1.465-.656 1.465-1.465v-4.794a.293.293 0 0 0-.586 0v4.794a.88.88 0 0 1-.879.88H4.465a.88.88 0 0 1-.879-.88v-1.63a.293.293 0 0 0-.586 0z" clipRule="evenodd"></path>
            <path fill="#000" fillRule="evenodd" d="M3 19.361c0 .81.657 1.467 1.467 1.467h11.88c.389 0 .762-.154 1.037-.43l3.186-3.186c.275-.275.43-.648.43-1.037V4.805c0-.81-.657-1.466-1.467-1.466H4.467C3.657 3.339 3 3.996 3 4.806zm1.467.881a.88.88 0 0 1-.881-.88V4.805a.88.88 0 0 1 .881-.881h15.066a.88.88 0 0 1 .881.88v11.37a.88.88 0 0 1-.258.623l-3.186 3.186a.88.88 0 0 1-.623.258z" clipRule="evenodd"></path>
            <path fill="#000" fillRule="evenodd" d="M15.573 20.535c0 .162.13.293.293.293.692 0 1.254-.562 1.254-1.255v-1.955c0-.37.3-.67.67-.67h1.955c.693 0 1.255-.56 1.255-1.254a.293.293 0 0 0-.586 0c0 .37-.3.669-.669.669H17.79c-.693 0-1.255.562-1.255 1.255v1.955c0 .37-.3.67-.668.67a.293.293 0 0 0-.293.292M3 7.819c0 .161.131.292.293.292h3.464a.293.293 0 1 0 0-.585H3.293A.293.293 0 0 0 3 7.819M7.636 7.819c0 .161.131.292.293.292h12.778a.293.293 0 1 0 0-.585H7.929a.293.293 0 0 0-.293.293M5.72 4.786c0 .492.399.891.89.891a.293.293 0 1 0 0-.586.305.305 0 0 1-.304-.305V2.891c0-.169.136-.305.305-.305h.134c.169 0 .305.136.305.305v.74a.293.293 0 0 0 .586 0v-.74A.89.89 0 0 0 6.746 2H6.61a.89.89 0 0 0-.891.89zM16.364 4.786c0 .492.399.891.89.891a.293.293 0 1 0 0-.586.305.305 0 0 1-.304-.305V2.891c0-.169.136-.305.305-.305h.134c.169 0 .305.136.305.305v.74a.293.293 0 1 0 .586 0v-.74A.89.89 0 0 0 17.39 2h-.135a.89.89 0 0 0-.891.89zM4.758 11.25c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572V9.855a.57.57 0 0 0-.572-.572H5.33a.57.57 0 0 0-.572.572zm.586-.014V9.87h1.367v1.367zM8.74 11.25c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572V9.855a.57.57 0 0 0-.572-.572H9.312a.57.57 0 0 0-.572.572zm.586-.014V9.87h1.367v1.367zM12.721 11.25c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572V9.855a.57.57 0 0 0-.572-.572h-1.395a.57.57 0 0 0-.572.572zm.586-.014V9.87h1.367v1.367zM16.703 11.25c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572V9.855a.57.57 0 0 0-.572-.572h-1.395a.57.57 0 0 0-.572.572zm.586-.014V9.87h1.367v1.367zM4.758 14.874c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572V13.48a.57.57 0 0 0-.572-.572H5.33a.57.57 0 0 0-.572.572zm.586-.014v-1.367h1.367v1.367zM8.74 14.874c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572V13.48a.57.57 0 0 0-.572-.572H9.312a.57.57 0 0 0-.572.572zm.586-.014v-1.367h1.367v1.367zM12.721 14.874c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572V13.48a.57.57 0 0 0-.572-.572h-1.395a.57.57 0 0 0-.572.572zm.586-.014v-1.367h1.367v1.367zM16.703 14.961c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572v-1.395a.57.57 0 0 0-.572-.572h-1.395a.57.57 0 0 0-.572.572zm.586-.014V13.58h1.367v1.367zM4.758 18.498c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572v-1.395a.57.57 0 0 0-.572-.572H5.33a.57.57 0 0 0-.572.572zm.586-.014v-1.367h1.367v1.367zM8.74 18.498c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572v-1.395a.57.57 0 0 0-.572-.572H9.312a.57.57 0 0 0-.572.572zm.586-.014v-1.367h1.367v1.367zM12.721 18.498c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572v-1.395a.57.57 0 0 0-.572-.572h-1.395a.57.57 0 0 0-.572.572zm.586-.014v-1.367h1.367v1.367zM16.703 18.498c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572v-1.395a.57.57 0 0 0-.572-.572h-1.395a.57.57 0 0 0-.572.572zm.586-.014v-1.367h1.367v1.367z" clipRule="evenodd"></path>
          </svg>
            <span className=" ml-2">Ngày khởi hành:</span> 
            <span className="font-semibold px-1">{new Date(tour.startDate).toLocaleDateString('vi-VN')}</span>
          </div>

           {/* Thời gian tour */}
           <div className="flex items-center mb-1 font-semibold">
            <div className='flex'>
              <ClockIcon className="w-6 h-6 text-gray-600 mr-1" />
                <span className="">
                  <span className="font-semibold px-1">
                    {`${tour.duration}N${tour.duration - 1}Đ`} {/* Hiển thị dạng "X ngày Y đêm" */}
                  </span>
                </span>
            </div>

            <div className='flex ml-12'>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path fill="#000" d="M11.677 15.29q.001-.075-.005-.152l-.53-7.354a2.057 2.057 0 0 0-2.045-1.91h-.645V5.21a1.13 1.13 0 0 0 .886-1.539l-.347-.868A1.27 1.27 0 0 0 7.807 2H5.87a1.27 1.27 0 0 0-1.185.802l-.347.869a1.13 1.13 0 0 0 .887 1.538v.666H4.58a2.057 2.057 0 0 0-2.046 1.908l-.53 7.355Q2 15.215 2 15.29a2.19 2.19 0 0 0 .91 1.774A1.775 1.775 0 0 0 2.042 19l.401 1.803A1.52 1.52 0 0 0 3.936 22h5.806a1.52 1.52 0 0 0 1.492-1.197L11.636 19a1.77 1.77 0 0 0-.868-1.936 2.19 2.19 0 0 0 .91-1.774m-2.58 0a1.1 1.1 0 0 1-.698.258H5.28a1.1 1.1 0 0 1-.698-.258v-.02c0-.444-.012-.889-.02-1.334h4.556c-.008.444-.02.89-.02 1.333zm.03-2H4.55a72 72 0 0 0-.137-2.903h4.85q-.096 1.452-.137 2.903M4.58 16.045c.22.097.457.148.697.148H8.4c.24 0 .478-.051.698-.149v.795H4.58zm.322-11.953q0-.094.035-.182l.348-.868a.63.63 0 0 1 .585-.397h1.936a.63.63 0 0 1 .585.397l.347.868a.49.49 0 0 1-.453.67H5.392a.49.49 0 0 1-.489-.488m.968 1.134h1.936v.649H5.87zM9.097 6.52c.175 0 .349.033.511.097a74 74 0 0 0-.295 3.124H4.365a74 74 0 0 0-.296-3.124 1.4 1.4 0 0 1 .512-.097zm-6.448 8.665.53-7.355c.02-.275.12-.539.29-.757a74 74 0 0 1 .467 8.196v1.544a1.55 1.55 0 0 1-1.29-1.523q0-.053.003-.105m7.956 5.478a.88.88 0 0 1-.863.692H3.936a.88.88 0 0 1-.863-.692l-.337-1.515c.278.177.6.271.93.271h6.346c.33 0 .652-.094.93-.27zm-.702-3.18a1.13 1.13 0 0 1 1.057.74 1.09 1.09 0 0 1-.948.551H3.665a1.09 1.09 0 0 1-.946-.55 1.13 1.13 0 0 1 1.057-.74zm-.161-.67v-1.544a74 74 0 0 1 .467-8.197c.17.218.27.482.29.758l.53 7.355q.004.052.004.106a1.55 1.55 0 0 1-1.291 1.522M22 15.29q0-.075-.005-.152l-.53-7.354a2.057 2.057 0 0 0-2.046-1.91h-.645V5.21a1.13 1.13 0 0 0 .886-1.539l-.347-.868A1.27 1.27 0 0 0 18.13 2h-1.936a1.27 1.27 0 0 0-1.184.802l-.347.869a1.13 1.13 0 0 0 .886 1.538v.666h-.645a2.057 2.057 0 0 0-2.046 1.908l-.53 7.355a2.2 2.2 0 0 0 .237 1.148c.158.308.388.575.669.777A1.77 1.77 0 0 0 12.365 19l.4 1.803A1.52 1.52 0 0 0 14.259 22h5.806a1.52 1.52 0 0 0 1.493-1.197l.4-1.803a1.77 1.77 0 0 0-.867-1.936A2.19 2.19 0 0 0 22 15.29m-2.58 0a1.1 1.1 0 0 1-.698.258H15.6a1.1 1.1 0 0 1-.698-.258v-.02c0-.444-.012-.889-.02-1.334h4.557c-.009.444-.02.89-.02 1.333zm.03-2h-4.577a72 72 0 0 0-.137-2.903h4.85a78 78 0 0 0-.137 2.903m-4.547 2.755c.22.097.457.148.698.148h3.12c.241 0 .479-.051.698-.149v.795h-4.516zm.323-11.953q0-.094.035-.182l.347-.868a.63.63 0 0 1 .585-.397h1.936a.63.63 0 0 1 .585.397l.348.868a.49.49 0 0 1-.454.67h-2.894a.49.49 0 0 1-.488-.488m.967 1.134h1.936v.649h-1.936zM19.42 6.52c.175 0 .349.033.512.097a74 74 0 0 0-.296 3.124h-4.948a74 74 0 0 0-.295-3.124 1.4 1.4 0 0 1 .511-.097zm-6.448 8.665.53-7.355c.02-.275.12-.539.29-.757.308 2.721.464 5.457.467 8.196v1.544a1.55 1.55 0 0 1-1.29-1.523q0-.053.003-.105m7.956 5.478a.88.88 0 0 1-.863.692h-5.806a.88.88 0 0 1-.863-.692l-.336-1.515c.277.177.6.271.929.271h6.347c.329 0 .651-.094.929-.27zm-.701-3.18a1.13 1.13 0 0 1 1.056.74 1.09 1.09 0 0 1-.947.551h-6.347a1.09 1.09 0 0 1-.946-.55 1.13 1.13 0 0 1 1.056-.74zm-.162-.67v-1.544c.003-2.739.16-5.475.468-8.197.17.218.27.482.29.758l.53 7.355q.003.052.003.106a1.55 1.55 0 0 1-1.29 1.522"></path></svg>
                <span className='ml-1'>Số chỗ còn nhận:
                  <span className='text-red-600'> {tour.availableSlots}</span>
                </span>
            </div>
          </div>

          {/* Giá từ */}
          <div className="flex justify-between mb-1">
            <div className='flex flex-col '>
              <div className='flex items-center'>
                <div className="font-semibold">Giá từ:</div>
                {/* nếu ko có giảm giá ẩn đi và chỉ hiện giá gốc */}
                {tour.discount > 0 &&(
                  <span className="text-gray-600 line-through font-semibold mr-2 ml-2">
                    {tour.price.toLocaleString()} ₫
                  </span>
                )}
                  </div>
                <div className=" items-start">
                  <span className="text-red-600 font-bold text-[1.8rem]">
                    {adultDiscountPrice.toLocaleString()} ₫
                  </span>
                </div>
              </div>
            
            <div className='py-2'>
              <button 
                className="bg-white text-red-600 font-semibold py-1.5 px-3.5 ml-4 mt-3 rounded-lg hover:bg-red-500 hover:text-white duration-200 border border-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  // Thêm logic điều hướng đến trang đặt tour nếu cần thiết
                  window.location.href = `/booking/${tour.id}`;
                }}
              >
                Đặt ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;
