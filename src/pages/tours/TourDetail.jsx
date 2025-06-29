import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'; 
import axios from 'axios';
import Navbar from '../../components/Nav';
import CategoryNav from '../../components/CategoryNav';
import Footer from '../../components/Footer';
import { MapPinIcon, CalendarIcon, CurrencyDollarIcon, TicketIcon } from '@heroicons/react/24/outline';
import ImportantInfo from '../../components/thongtinluuy';
import Itinerary from '../../components/itinerary';
import TourDatePicker from '../../components/TourDatepicker';
import TourReviews from './TourReviews';
import StarRatings from "react-star-ratings";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TourDetail = () => {
  const navigate = useNavigate();  // Thay vì useHistory, sử dụng useNavigate
  const { id } = useParams();  // Lấy id từ URL
  const [tour, setTour] = useState(null);  // State để lưu thông tin tour
  const [loading, setLoading] = useState(true);  // State để quản lý trạng thái loading
  const [error, setError] = useState(null);  // State để lưu lỗi nếu có
  const [selectedDate, setSelectedDate] = useState('');
  const [averageRating, setAverageRating] = useState(0);

  const handleToastMessage = (message) => {
    // Xử lý thông báo ở đây, có thể sử dụng react-toastify để hiển thị thông báo
    toast.error(message);
  };

  // Hàm để gọi API lấy dữ liệu tour dựa trên id
  const fetchTour = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/v1/Tours/${id}`);  // URL API lấy thông tin tour
      setTour(response.data);  // Cập nhật dữ liệu tour
      setLoading(false);  // Tắt trạng thái loading
    } catch (err) {
      console.error('Error fetching tour:', err);
      setError('Không thể tải dữ liệu tour');
      setLoading(false);  // Tắt trạng thái loading nếu lỗi xảy ra
    }
  };

  // Gọi fetchTour khi component mount hoặc khi id thay đổi
  useEffect(() => {
    fetchTour();
  }, [id]);

  const handleBookingClick = () => {
    navigate(`/booking/${id}`, { state: { tour } });  // Điều hướng tới trang đặt tour với state
    console.log(tour)
  };

  const handleContactClick = () => {
    navigate(`/contact`);  // Điều hướng tới trang đặt tour với state
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!tour) {
    return <div>Tour không tồn tại</div>;
  }

  // Tính giá sau khi áp dụng giảm giá
  const calculateDiscountPrice = (price, discount) => {
    if (!discount || discount <= 0) return price;
    const discountAmount = (price * discount) / 100;
    return price - discountAmount;
  };

   // Giá người lớn sau khi áp dụng giảm giá
   const adultDiscountPrice = calculateDiscountPrice(tour.price, tour.discount);
   
   const handleDateSelect = (date) => {
    // Kiểm tra nếu date là null, nếu đúng thì reset lại thông tin về ban đầu
    if (!date) {
      setTour((prevTour) => ({
        ...prevTour,
        startDate: prevTour.startDate,  // Giữ nguyên ngày bắt đầu ban đầu
        endDate: prevTour.endDate,      // Giữ nguyên ngày kết thúc ban đầu
        tourScheduleId: null,           // Reset tourScheduleId về null
      }));
      setSelectedDate(null);  // Reset selectedDate về null
      return;  // Dừng thực hiện các phần còn lại
    }
  
    setSelectedDate(date);  // Cập nhật ngày người dùng chọn
  
    // Tìm TourSchedule tương ứng với ngày người dùng chọn
    const selectedSchedule = tour.tourSchedules.$values.find(
      (schedule) => schedule.startDate === date
    );
  
    // Nếu tìm thấy lịch trình, cập nhật lại thông tin tour từ TourSchedule
    if (selectedSchedule) {
      setTour((prevTour) => ({
        ...prevTour,
        startDate: selectedSchedule.startDate,
        endDate: selectedSchedule.endDate,
        tourScheduleId: selectedSchedule.id,  // Gán thêm ID của TourSchedule đã chọn
      }));
    } else {
      // Nếu không có lịch trình phù hợp, giữ nguyên thông tin ban đầu
      setTour((prevTour) => ({
        ...prevTour,
        startDate: prevTour.startDate,  // Giữ nguyên ngày bắt đầu ban đầu
        endDate: prevTour.endDate,      // Giữ nguyên ngày kết thúc ban đầu
        tourScheduleId: null,           // Reset tourScheduleId về null
      }));
    }
  };
  

   const formattedDate = tour && tour.startDate ? (() => {
    const formattedStartDate = new Date(tour.startDate);
    const day = formattedStartDate.getDate().toString().padStart(2, '0');
    const month = (formattedStartDate.getMonth() + 1).toString().padStart(2, '0');
    const year = formattedStartDate.getFullYear();
    return `${day}-${month}-${year}`;
  })() : 'Ngày không hợp lệ';


  return (
    <div>
      <Navbar />
      <CategoryNav categoryId={tour.category?.id} tourName={tour.name}/>

      <div className="container mx-auto my-4 px-32">
        <h1 className="text-3xl mb-8">
          <strong className="">{tour.name}</strong>
        </h1>
        <div className="flex flex-col md:flex-row">
          {/* Phần hình ảnh bên trái */}
          <div className="md:w-2/3 pr-4">
          {/* Hiển thị điểm trung bình */}
          <div className="flex items-center text-lg mb-1">
            <div>        
                <strong>Đánh giá: <span>{averageRating.toFixed(1)}/5</span> </strong>
                (<StarRatings
                  rating={averageRating} // Sử dụng điểm trung bình để hiển thị sao
                  starRatedColor="#FF8C00" // Màu của các sao đã được chọn
                  numberOfStars={5} // Số sao tối đa là 5
                  name="avgRating"
                  starDimension="20px" // Kích thước sao
                />)
              </div>
          </div>

            <div className="mb-4">
              <img src={`http://localhost:4000${tour.image}`} alt={tour.name} className="w-full h-[32rem] object-cover rounded-lg" />
            </div>
            
            <div className='my-12'>
              <Itinerary itineraries={tour.itineraries.$values} />
            </div>

            <div className='my-12'>
            <ImportantInfo />
            </div>

            <div className='my-12'>
              {/* Tiêu đề lớn */}
              <h2 className="text-3xl text-center font-bold mb-2">ĐÁNH GIÁ TOUR</h2>

              <TourReviews tourId={id} setAverageRating={setAverageRating} />
              <ToastContainer />
            </div>

          </div>

          {/* Phần thông tin chi tiết bên phải */}
          <div className="md:w-1/3">
            <div className='border-2 mt-6 ml-4 p-4 rounded-lg shadow-md shadow-gray-400 sticky top-4'>
              <div className="text-[1.1rem] flex justify-between font-semibold">
                <strong className="">Giá:</strong>
                {tour.discount > 0 &&(
                  <div className=''>
                  <strong className="text-[#b1b1b1] line-through ml-2">
                    {tour.price.toLocaleString()} ₫ 
                  </strong> 
                  <a className='text-[#b1b1b1] '>/Khách</a>
                  </div>
                )} 
              </div>
              <div className="text-4xl font-semibold mb-4 mt-2">
                <strong className="text-red-600 font-bold"> {adultDiscountPrice.toLocaleString()} ₫</strong><a className='font-normal text-2xl'>/Khách</a>
              </div>

              <ul className="space-y-2 mb-4">
                <li className='flex items-center '>
                  <TicketIcon className="w-6 h-6 text-gray-500 mr-2" />
                  <strong>Mã tour:</strong> <strong className="text-blue-600 pl-1">{tour.id}</strong>
                </li>

                <li className='flex items-center '> 
                  <MapPinIcon className="w-6 h-6 text-gray-500 mr-2" />
                  <strong>Khởi hành:</strong> <strong className="text-blue-600 pl-1">{tour.departureLocation}</strong>
                </li>

                <li className='flex items-center '>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                  <path fill="#000" fillRule="evenodd" d="M3 20.535C3 21.345 3.656 22 4.465 22h15.07c.81 0 1.465-.656 1.465-1.465v-4.794a.293.293 0 0 0-.586 0v4.794a.88.88 0 0 1-.879.88H4.465a.88.88 0 0 1-.879-.88v-1.63a.293.293 0 0 0-.586 0z" clipRule="evenodd"></path>
                  <path fill="#000" fillRule="evenodd" d="M3 19.361c0 .81.657 1.467 1.467 1.467h11.88c.389 0 .762-.154 1.037-.43l3.186-3.186c.275-.275.43-.648.43-1.037V4.805c0-.81-.657-1.466-1.467-1.466H4.467C3.657 3.339 3 3.996 3 4.806zm1.467.881a.88.88 0 0 1-.881-.88V4.805a.88.88 0 0 1 .881-.881h15.066a.88.88 0 0 1 .881.88v11.37a.88.88 0 0 1-.258.623l-3.186 3.186a.88.88 0 0 1-.623.258z" clipRule="evenodd"></path>
                  <path fill="#000" fillRule="evenodd" d="M15.573 20.535c0 .162.13.293.293.293.692 0 1.254-.562 1.254-1.255v-1.955c0-.37.3-.67.67-.67h1.955c.693 0 1.255-.56 1.255-1.254a.293.293 0 0 0-.586 0c0 .37-.3.669-.669.669H17.79c-.693 0-1.255.562-1.255 1.255v1.955c0 .37-.3.67-.668.67a.293.293 0 0 0-.293.292M3 7.819c0 .161.131.292.293.292h3.464a.293.293 0 1 0 0-.585H3.293A.293.293 0 0 0 3 7.819M7.636 7.819c0 .161.131.292.293.292h12.778a.293.293 0 1 0 0-.585H7.929a.293.293 0 0 0-.293.293M5.72 4.786c0 .492.399.891.89.891a.293.293 0 1 0 0-.586.305.305 0 0 1-.304-.305V2.891c0-.169.136-.305.305-.305h.134c.169 0 .305.136.305.305v.74a.293.293 0 0 0 .586 0v-.74A.89.89 0 0 0 6.746 2H6.61a.89.89 0 0 0-.891.89zM16.364 4.786c0 .492.399.891.89.891a.293.293 0 1 0 0-.586.305.305 0 0 1-.304-.305V2.891c0-.169.136-.305.305-.305h.134c.169 0 .305.136.305.305v.74a.293.293 0 1 0 .586 0v-.74A.89.89 0 0 0 17.39 2h-.135a.89.89 0 0 0-.891.89zM4.758 11.25c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572V9.855a.57.57 0 0 0-.572-.572H5.33a.57.57 0 0 0-.572.572zm.586-.014V9.87h1.367v1.367zM8.74 11.25c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572V9.855a.57.57 0 0 0-.572-.572H9.312a.57.57 0 0 0-.572.572zm.586-.014V9.87h1.367v1.367zM12.721 11.25c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572V9.855a.57.57 0 0 0-.572-.572h-1.395a.57.57 0 0 0-.572.572zm.586-.014V9.87h1.367v1.367zM16.703 11.25c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572V9.855a.57.57 0 0 0-.572-.572h-1.395a.57.57 0 0 0-.572.572zm.586-.014V9.87h1.367v1.367zM4.758 14.874c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572V13.48a.57.57 0 0 0-.572-.572H5.33a.57.57 0 0 0-.572.572zm.586-.014v-1.367h1.367v1.367zM8.74 14.874c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572V13.48a.57.57 0 0 0-.572-.572H9.312a.57.57 0 0 0-.572.572zm.586-.014v-1.367h1.367v1.367zM12.721 14.874c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572V13.48a.57.57 0 0 0-.572-.572h-1.395a.57.57 0 0 0-.572.572zm.586-.014v-1.367h1.367v1.367zM16.703 14.961c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572v-1.395a.57.57 0 0 0-.572-.572h-1.395a.57.57 0 0 0-.572.572zm.586-.014V13.58h1.367v1.367zM4.758 18.498c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572v-1.395a.57.57 0 0 0-.572-.572H5.33a.57.57 0 0 0-.572.572zm.586-.014v-1.367h1.367v1.367zM8.74 18.498c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572v-1.395a.57.57 0 0 0-.572-.572H9.312a.57.57 0 0 0-.572.572zm.586-.014v-1.367h1.367v1.367zM12.721 18.498c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572v-1.395a.57.57 0 0 0-.572-.572h-1.395a.57.57 0 0 0-.572.572zm.586-.014v-1.367h1.367v1.367zM16.703 18.498c0 .316.256.572.572.572h1.395a.57.57 0 0 0 .572-.572v-1.395a.57.57 0 0 0-.572-.572h-1.395a.57.57 0 0 0-.572.572zm.586-.014v-1.367h1.367v1.367z" clipRule="evenodd"></path>
                </svg>
                  <strong className='ml-2'>Ngày khởi hành:</strong> <strong className="text-blue-600 pl-1">{formattedDate}</strong>
                </li>

                <li className='flex items-center '>
                  <CurrencyDollarIcon className="w-6 h-6 text-gray-500 mr-2" />
                  <strong>Thời gian:</strong> <strong className="text-blue-600 pl-1">{`${tour.duration}N${tour.duration - 1}Đ`}</strong>
                </li>

                <li className='flex items-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path fill="#000" d="M11.677 15.29q.001-.075-.005-.152l-.53-7.354a2.057 2.057 0 0 0-2.045-1.91h-.645V5.21a1.13 1.13 0 0 0 .886-1.539l-.347-.868A1.27 1.27 0 0 0 7.807 2H5.87a1.27 1.27 0 0 0-1.185.802l-.347.869a1.13 1.13 0 0 0 .887 1.538v.666H4.58a2.057 2.057 0 0 0-2.046 1.908l-.53 7.355Q2 15.215 2 15.29a2.19 2.19 0 0 0 .91 1.774A1.775 1.775 0 0 0 2.042 19l.401 1.803A1.52 1.52 0 0 0 3.936 22h5.806a1.52 1.52 0 0 0 1.492-1.197L11.636 19a1.77 1.77 0 0 0-.868-1.936 2.19 2.19 0 0 0 .91-1.774m-2.58 0a1.1 1.1 0 0 1-.698.258H5.28a1.1 1.1 0 0 1-.698-.258v-.02c0-.444-.012-.889-.02-1.334h4.556c-.008.444-.02.89-.02 1.333zm.03-2H4.55a72 72 0 0 0-.137-2.903h4.85q-.096 1.452-.137 2.903M4.58 16.045c.22.097.457.148.697.148H8.4c.24 0 .478-.051.698-.149v.795H4.58zm.322-11.953q0-.094.035-.182l.348-.868a.63.63 0 0 1 .585-.397h1.936a.63.63 0 0 1 .585.397l.347.868a.49.49 0 0 1-.453.67H5.392a.49.49 0 0 1-.489-.488m.968 1.134h1.936v.649H5.87zM9.097 6.52c.175 0 .349.033.511.097a74 74 0 0 0-.295 3.124H4.365a74 74 0 0 0-.296-3.124 1.4 1.4 0 0 1 .512-.097zm-6.448 8.665.53-7.355c.02-.275.12-.539.29-.757a74 74 0 0 1 .467 8.196v1.544a1.55 1.55 0 0 1-1.29-1.523q0-.053.003-.105m7.956 5.478a.88.88 0 0 1-.863.692H3.936a.88.88 0 0 1-.863-.692l-.337-1.515c.278.177.6.271.93.271h6.346c.33 0 .652-.094.93-.27zm-.702-3.18a1.13 1.13 0 0 1 1.057.74 1.09 1.09 0 0 1-.948.551H3.665a1.09 1.09 0 0 1-.946-.55 1.13 1.13 0 0 1 1.057-.74zm-.161-.67v-1.544a74 74 0 0 1 .467-8.197c.17.218.27.482.29.758l.53 7.355q.004.052.004.106a1.55 1.55 0 0 1-1.291 1.522M22 15.29q0-.075-.005-.152l-.53-7.354a2.057 2.057 0 0 0-2.046-1.91h-.645V5.21a1.13 1.13 0 0 0 .886-1.539l-.347-.868A1.27 1.27 0 0 0 18.13 2h-1.936a1.27 1.27 0 0 0-1.184.802l-.347.869a1.13 1.13 0 0 0 .886 1.538v.666h-.645a2.057 2.057 0 0 0-2.046 1.908l-.53 7.355a2.2 2.2 0 0 0 .237 1.148c.158.308.388.575.669.777A1.77 1.77 0 0 0 12.365 19l.4 1.803A1.52 1.52 0 0 0 14.259 22h5.806a1.52 1.52 0 0 0 1.493-1.197l.4-1.803a1.77 1.77 0 0 0-.867-1.936A2.19 2.19 0 0 0 22 15.29m-2.58 0a1.1 1.1 0 0 1-.698.258H15.6a1.1 1.1 0 0 1-.698-.258v-.02c0-.444-.012-.889-.02-1.334h4.557c-.009.444-.02.89-.02 1.333zm.03-2h-4.577a72 72 0 0 0-.137-2.903h4.85a78 78 0 0 0-.137 2.903m-4.547 2.755c.22.097.457.148.698.148h3.12c.241 0 .479-.051.698-.149v.795h-4.516zm.323-11.953q0-.094.035-.182l.347-.868a.63.63 0 0 1 .585-.397h1.936a.63.63 0 0 1 .585.397l.348.868a.49.49 0 0 1-.454.67h-2.894a.49.49 0 0 1-.488-.488m.967 1.134h1.936v.649h-1.936zM19.42 6.52c.175 0 .349.033.512.097a74 74 0 0 0-.296 3.124h-4.948a74 74 0 0 0-.295-3.124 1.4 1.4 0 0 1 .511-.097zm-6.448 8.665.53-7.355c.02-.275.12-.539.29-.757.308 2.721.464 5.457.467 8.196v1.544a1.55 1.55 0 0 1-1.29-1.523q0-.053.003-.105m7.956 5.478a.88.88 0 0 1-.863.692h-5.806a.88.88 0 0 1-.863-.692l-.336-1.515c.277.177.6.271.929.271h6.347c.329 0 .651-.094.929-.27zm-.701-3.18a1.13 1.13 0 0 1 1.056.74 1.09 1.09 0 0 1-.947.551h-6.347a1.09 1.09 0 0 1-.946-.55 1.13 1.13 0 0 1 1.056-.74zm-.162-.67v-1.544c.003-2.739.16-5.475.468-8.197.17.218.27.482.29.758l.53 7.355q.003.052.003.106a1.55 1.55 0 0 1-1.29 1.522"></path></svg>
                    <strong className='ml-2'>Số chỗ còn:</strong>
                    <strong className=' text-blue-600 pl-1'> {tour.availableSlots} chỗ</strong>
                </li>
              </ul>

              <div className="flex space-x-4 mb-4 items-center">
                <div><button className="bg-red-600 text-white py-2 px-4 rounded-lg" onClick={handleBookingClick}>Đặt tour</button></div>
                <div>
                <TourDatePicker 
                  tourData={tour} 
                  onSelectDate={handleDateSelect} 
                  selectedDate={selectedDate}  />
                  </div>
              </div>


              <div className="flex space-x-4">
                <button className="bg-blue-600 text-white py-2 px-4 rounded-lg">Gọi miễn phí qua internet</button>
                <button className="bg-gray-200 py-2 px-4 rounded-lg" onClick={ handleContactClick}>Liên hệ tư vấn</button>
              </div>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TourDetail;
