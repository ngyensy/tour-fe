  import React, { useEffect, useState  } from 'react';
  import { useLocation, useNavigate, Link } from 'react-router-dom';
  import { useAuth } from '../context/AuthContext'; // Import useAuth để lấy thông tin người dùng
  import Navbar from '../components/Nav';
  import Footer from '../components/Footer';
  import { MapPinIcon, CurrencyDollarIcon, TicketIcon } from '@heroicons/react/24/outline';
  import axios from 'axios';
  import PaymentMethod from '../components/PaymentMethod';
  import TermsAndConditions from '../components/TermsAndConditions';
  import SingleRoomCounter from '../components/SingleRoomCounter';
  import Swal from 'sweetalert2';
  import DiscountCodeComponent from '../components/DiscountCodeComponent';
  import { ToastContainer, toast } from "react-toastify"; // Import toast
  import "react-toastify/dist/ReactToastify.css";


  const BookingPage = () => {
    const location = useLocation(); 
    const navigate = useNavigate();
    const { tour } = location.state || {}; // Lấy thông tin tour từ state
    const { user } = useAuth(); // Lấy thông tin người dùng từ AuthContext
    const [totalPrice, setTotalPrice] = useState(0); 
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [isAgreed, setIsAgreed] = useState(false);
    const [singleRoomCount, setSingleRoomCount] = useState(0);
    const [totalSingleRoomSurcharge, setTotalSingleRoomSurcharge] = useState(0);
    const availableSlots = tour.availableSlots; 
    const [finalPrice, setFinalPrice] = useState(totalPrice);
    const [appliedCode, setAppliedCode] = useState(null);

    const handleAgreementChange = (checked) => {
      setIsAgreed(checked); // Cập nhật trạng thái đồng ý
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng tính từ 0 nên cần +1
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const [formData, setFormData] = useState({
      guestName: '',
      guestEmail: '',
      guestPhoneNumber: '',
      guestAddress: '',
      numberOfAdults: 1,
      numberOfChildren: 0,
      singleRoom: false,
      notes: '',
    });

    // Cập nhật số lượng phòng đơn từ component
    const handleSingleRoomCountChange = (count) => {
      if (count <= formData.numberOfAdults) { // Giới hạn số phòng đơn không vượt quá số người lớn
        setSingleRoomCount(count);
      }
    };
    
    //tu dong dien thong tin user
    useEffect(() => {
      if (user) {
        setFormData({
          ...formData,
          guestName: user.name || '',
          guestEmail: user.email || '',
          guestPhoneNumber: user.phoneNumber || '',
          guestAddress: user.address || ''
        });
      }
    }, [user]);

    useEffect(() => {
      // Nếu số người lớn là 1, tự động có 1 phòng đơn
      if (formData.numberOfAdults + formData.numberOfChildren === 1) {
        setSingleRoomCount(1);
      } else {
        setSingleRoomCount(0); // Nếu số người lớn từ 2 trở lên, không có phòng đơn mặc định
      }
    }, [formData.numberOfAdults, formData.numberOfChildren]);

    useEffect(() => {
      // Tính toán tổng tiền phụ thu phòng đơn
      const calculatedRoomPrice =
        singleRoomCount * tour.singleRoomSurcharge; // Sử dụng `singleRoomCount`
        
      setTotalSingleRoomSurcharge(calculatedRoomPrice);
    }, [formData, singleRoomCount, tour.singleRoomSurcharge]);

     // Tính giá sau khi áp dụng discount
     const adultPriceWithDiscount = tour.price - (tour.price * tour.discount / 100);
     const childPriceWithDiscount = tour.childPrice - (tour.childPrice * tour.discount / 100);

    useEffect(() => {
      // Tính toán tổng tiền bao gồm phụ thu phòng đơn
      const calculatedPrice =
      (formData.numberOfAdults * adultPriceWithDiscount) + 
      (formData.numberOfChildren * childPriceWithDiscount) + 
      totalSingleRoomSurcharge;

      setTotalPrice(calculatedPrice);
    }, [formData, singleRoomCount, tour.price, tour.childPrice, totalSingleRoomSurcharge]);

   

  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    };

    const isFormValid = () => {
      return formData.guestName
      && formData.guestEmail
      && formData.guestPhoneNumber
       ; // Kiểm tra xem tất cả các trường đều đã được điền
    };

    const bookingDate = new Date(); // Tạo một đối tượng Date mới
    const localOffset = bookingDate.getTimezoneOffset(); // Lấy offset múi giờ địa phương
    // Tính toán thời gian địa phương
    const localDate = new Date(bookingDate.getTime() - localOffset * 60000); // Chuyển đổi sang UTC

    //Xử lí logic để gửi về API
    const handleSubmit = async (e) => {
      e.preventDefault();

      if(!selectedPaymentMethod) {
        toast.error('Vui lòng chọn phương thức thanh toán!')
        return;
      }

      // Kiểm tra trạng thái đồng ý trước khi thực hiện submit
      if (!isAgreed) {
        toast.error('Bạn cần đồng ý với các điều khoản trước khi đặt tour!');
        return; // Ngừng thực hiện nếu chưa đồng ý
      }

      try {
        const bookingData = {
          tourId: tour.id,
          userId: user?.id || null, // ID người dùng nếu có
          guestName: formData.guestName,
          guestEmail: formData.guestEmail,
          guestPhoneNumber: formData.guestPhoneNumber,
          guestAddress: formData.guestAddress,
          numberOfAdults: formData.numberOfAdults,
          numberOfChildren: formData.numberOfChildren,
          singleRoom: formData.singleRoom,
          totalPrice: finalPrice,
          totalSingleRoomSurcharge: totalSingleRoomSurcharge,
          notes: formData.notes,
          paymentMethod: selectedPaymentMethod,
          bookingDate: localDate.toISOString().split('.')[0] + 'Z',
          tourScheduleId: tour.tourScheduleId,
          appliedCode: appliedCode || null, 
        };
  
        const response = await axios.post('http://localhost:4000/v1/booking', bookingData);
  
         if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: 'Đặt tour thành công!',
            confirmButtonText: 'OK',
          }).then(() => {
            // Chuyển hướng sau khi người dùng nhấn OK
            navigate("/confirmation", { state: { booking: bookingData, tour } });
          });
        }
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Lỗi!',
              text: 'Đã xảy ra lỗi khi đặt tour. Vui lòng thử lại.',
              confirmButtonText: 'OK',
            });
          }
      };

    if (!tour) {
      return <div>Thông tin tour không có</div>;
    }

    const QuantityInput = ({ label, value, onIncrease, onDecrease, availableSlots, note }) => (
      <div className="mb-4 border p-4 rounded-lg flex items-center justify-between border-gray-700">
        <div className="flex flex-col items-start">
          <label className="block font-bold mb-1">{label}</label>

          <div className='flex'>
            <span className="text-sm text-gray-600 font-medium">{note}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" className="scale-50 relative ">
              <path fill="#5D5D5D" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10"></path><path fill="#fff" d="M12 8.63a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5M12 17.88a1 1 0 0 1-1-1v-5a1 1 0 0 1 0-2h1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1">
              </path>
              <path fill="#fff" d="M13 17.88h-2a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2"></path></svg>
          </div>
        </div>
        <div className="ml-4 flex items-center">
          <button
            type="button"
            className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            onClick={onDecrease}
            disabled={value <= 0} // Disable giảm khi giá trị <= 0
          >
            -
          </button>
          <span className="mx-4 text-lg font-medium">{value}</span>
          <button
            type="button"
            className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            onClick={onIncrease}
            disabled={value > availableSlots} // Disable tăng khi đạt giới hạn
          >
            +
          </button>
        </div>
      </div>
    );
    

    const totalPeople = formData.numberOfAdults + formData.numberOfChildren;

    // Hàm thông báo
      const showAlert = () => {
        toast.error("Số người đã đạt giới hạn chỗ còn lại!");
      };

      // Logic xử lý tăng/giảm số lượng người lớn
      const handleIncreaseAdults = () => {
        if (totalPeople < availableSlots) {
          setFormData({
            ...formData,
            numberOfAdults: formData.numberOfAdults + 1,
          });
        } else {
          showAlert(); // Hiển thị thông báo khi số người đạt giới hạn
        }
      };

      const handleDecreaseAdults = () => {
        setFormData({
          ...formData,
          numberOfAdults: Math.max(formData.numberOfAdults - 1, 1),
        });
      };

      // Logic xử lý tăng/giảm số lượng trẻ em
      const handleIncreaseChildren = () => {
        const maxChildren = formData.numberOfAdults * 2; // Số trẻ em tối đa dựa trên số người lớn
        const totalPeople = formData.numberOfAdults + formData.numberOfChildren; // Tổng số người
      
        if (totalPeople < availableSlots) { 
          if (formData.numberOfChildren < maxChildren) { 
            setFormData({
              ...formData,
              numberOfChildren: formData.numberOfChildren + 1,
            });
          } else {
            toast.error("Số lượng trẻ em không được vượt quá gấp đôi số người lớn."); // Thông báo nếu vượt giới hạn
          }
        } else {
          showAlert(); // Thông báo khi đạt giới hạn tổng số người
        }
      };

      const handleDecreaseChildren = () => {
        setFormData({
          ...formData,
          numberOfChildren: Math.max(formData.numberOfChildren - 1, 0),
        });
      };


    return (
      <div>
        <Navbar />

        <div className="container mx-auto my-4 px-32">
          <div className="flex justify-between mb-6">
            <button className=" font-semibold text-lg" onClick={() => window.history.back()}>
              ← Quay lại
            </button>
          </div>

          <div className="flex justify-center mb-10">
            <h2 className="text-3xl text-blue-700 font-bold">ĐẶT TOUR</h2>
          </div>

          <div className="flex flex-col md:flex-row mb-24">
            {/* Phần thông tin khách hàng */}
            <div className="md:w-2/3 pr-4">
              <form onSubmit={handleSubmit}>
                <h3 className="text-xl font-bold mb-2">THÔNG TIN LIÊN LẠC</h3>

                {/* Thông báo đăng nhập */}
                {!user && (
                  <div className="bg-blue-100 text-blue-800 px-2 py-4 rounded-lg mb-4 items-center flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path fill="#000" fillRule="evenodd" d="M23 12c0 3.315-1.466 6.287-3.785 8.304A10.96 10.96 0 0 1 12 23c-2.76 0-5.283-1.017-7.215-2.696A10.97 10.97 0 0 1 1 12C1 5.925 5.925 1 12 1s11 4.925 11 11m-11 7.7a7.67 7.67 0 0 0 5.5-2.311C16.311 15.465 14.292 14.2 12 14.2s-4.311 1.265-5.5 3.189q.216.22.45.424A7.67 7.67 0 0 0 12 19.7m0-7.7a3.3 3.3 0 1 0 0-6.6 3.3 3.3 0 0 0 0 6.6" clipRule="evenodd"></path></svg>  
                    <span className='ml-2'>
                    <a href="/login" className="text-blue-800 underline font-bold">
                        Đăng nhập
                      </a> để nhận ưu đãi, tích điểm và quản lý đơn hàng dễ dàng hơn!!!
                      </span>
                  </div>
                )}

                {/*Thông tin khách hàng*/}
                <div className="flex flex-wrap mb-4">
                  <div className="w-full md:w-1/2 px-2">
                    <label className="block font-semibold" htmlFor="guestName">Họ tên <span className='text-red-600'>(*)</span></label>
                      <input
                        type="text"
                        id="guestName"
                        name="guestName"
                        className="border border-gray-700 w-full p-2 rounded-lg"
                        placeholder="Nhập họ tên"
                        value={formData.guestName}
                        onChange={handleChange}
                        required
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-2">
                    <label className="block font-semibold" htmlFor="guestEmail">Email <span className='text-red-600'>(*)</span></label>
                      <input
                        type="email"
                        id="guestEmail"
                        name="guestEmail"
                        className="border border-gray-700 w-full p-2 rounded-lg"
                        placeholder="Nhập email"
                        value={formData.guestEmail}
                        onChange={handleChange}
                        required
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-2 mt-2">
                    <label className="block font-semibold" htmlFor="guestPhoneNumber">Điện thoại <span className='text-red-600'>(*)</span></label>
                      <input
                        type="text"
                        id="guestPhoneNumber"
                        name="guestPhoneNumber"
                        className="border border-gray-700 w-full p-2 rounded-lg"
                        placeholder="Nhập số điện thoại"
                        value={formData.guestPhoneNumber}
                        onChange={handleChange}
                        required
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-2 mt-2">
                    <label className="block font-semibold" htmlFor="guestAddress">Địa chỉ</label>
                    <input
                      type="text"
                      id="guestAddress"
                      name="guestAddress"
                      className="border border-gray-700 w-full p-2 rounded-lg"
                      placeholder="Nhập địa chỉ"
                      value={formData.guestAddress}
                      onChange={handleChange}
                    />
                  </div>
                </div>


                <h3 className="text-xl font-bold mb-2">HÀNH KHÁCH</h3>
                <div className='flex space-x-10'>
                  {/*Só lượng người lớn */}
                  <QuantityInput
                    label="Người lớn"
                    note="(Từ 12 tuổi trở lên)"
                    value={formData.numberOfAdults}
                    onIncrease={handleIncreaseAdults}
                    onDecrease={handleDecreaseAdults}
                    availableSlots={availableSlots}
                  />
                  {/*Só lượng trẻ em */}
                  <QuantityInput
                    label="Trẻ em"
                    note="(Từ 5 đến 11 tuổi)"
                    value={formData.numberOfChildren}
                    onIncrease={handleIncreaseChildren}
                    onDecrease={handleDecreaseChildren}
                    availableSlots={availableSlots}
                  />
                </div>

                
                {/* Thanh số lượng phòng đơn */}
                <SingleRoomCounter count={singleRoomCount} onChange={handleSingleRoomCountChange} />

                {/* Thêm ToastContainer để hiển thị thông báo */}
                <ToastContainer position="top-center" autoClose={5000} hideProgressBar={true} />
                
                <h3 className="text-xl font-bold mb-2">GHI CHÚ</h3>

                <div className="mb-4">
                <label className="block font-semibold text-[1.1rem]" htmlFor="notes">Quý khách có ghi chú lưu ý gì, hãy nói với chúng tôi!!</label>
                <textarea
                  id="notes"
                  name="notes"
                  className="border w-full h-32 p-2 rounded-lg"
                  placeholder="Nhập ghi chú"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

              {/*Phương thức thanh toán*/}          
              <PaymentMethod onSelectPayment={setSelectedPaymentMethod} />

               {/*Điều khoản sử dụng dịch vụ */}       
              <TermsAndConditions onAgree={handleAgreementChange} />
              
              </form>
            </div>

            {/* Phần tóm tắt chuyến đi */}
            <div className='md:w-2/4  pl-4'>
              <div className='sticky top-4'>
                <h3 className="text-xl font-bold mb-2">TÓM TẮT CHUYẾN ĐI</h3>
                <div className="bg-[#f8f8f8] rounded-xl">
                  <div className="border p-4 border-none">
                    <div className="mb-4 border-b-2 border-gray-400 flex pb-3">
                        <img src={`http://localhost:4000${tour.image}`} alt={tour.name} className="rounded-lg md:w-2/4 max-h-56" />
                        <p className="font-semibold md:w-2/4 ml-4 text-lg">{tour.name}</p>
                      </div>
                      <ul className="text-gray-700 space-y-2">
                        <li className='flex items-center '>
                          <TicketIcon className="w-6 h-6 text-gray-500 mr-2" />
                          <strong>Mã tour:</strong> <span className="text-blue-600 font-semibold pl-1">{tour.id}</span>
                          </li>
                        <li className='flex items-center pb-5 border-b-2 border-gray-400'>
                          <CurrencyDollarIcon className="w-6 h-6 text-gray-500 mr-1" />
                          <strong>Thời gian:</strong> 
                            <span className="text-blue-600 font-semibold pl-1">
                              {`${tour.duration}N${tour.duration - 1}D`}
                            </span>
                          
                          <MapPinIcon className="w-6 h-6 text-gray-500 mr-1 ml-11" />
                          <strong>Khởi hành:</strong> <span className="text-blue-600 font-semibold pl-1">{tour.departureLocation}</span>
                        </li>

                        <h3 className='text-lg font-bold mb-2'>THỜI GIAN KHỞI HÀNH</h3>
                        <li className='flex justify-between text-[1rem]'>
                          <div>
                            <strong>Ngày đi:</strong> 
                            <span className="text-blue-600 font-bold pl-1">{formatDate(tour.startDate)}</span>
                          </div>
                          <div>
                            <strong>Ngày về:</strong> 
                            <span className="text-blue-600 font-bold pl-1">{formatDate(tour.endDate)}</span>
                          </div>
                        </li>
                        
                        <li className=" pb-5 border-b-2 border-gray-400">
                              <div className='flex items-center mt-6'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                                </svg>
                                <h3 className="text-lg font-bold mb-2 ml-2">KHÁCH HÀNG + PHỤ THU</h3>
                              </div>
                              <div className="flex font-bold justify-between mb-2">
                                <span>Người lớn</span>
                                <span>
                                  {formData.numberOfAdults} x {adultPriceWithDiscount.toLocaleString()} đ
                                </span>
                              </div>
                              <div className="flex font-bold justify-between mb-2">
                                <span>Trẻ em</span>
                                <span>
                                  {formData.numberOfChildren} x {childPriceWithDiscount.toLocaleString()} đ
                                </span>
                              </div>

                              <div className="flex font-bold justify-between mb-2 ">
                                <span>Phụ thu phòng đơn</span>
                                <span>{totalSingleRoomSurcharge.toLocaleString()} đ</span>
                              </div>

                              {/* Thêm DiscountCodeComponent vào đây */}
                              <DiscountCodeComponent 
                                totalPrice={totalPrice} 
                                setFinalPrice={setFinalPrice}
                                appliedCoded={setAppliedCode}  
                              />

                              <div className="flex justify-between border-t-2 pt-4">
                                <h4 className="text-2xl font-bold">Tổng tiền</h4>
                                <h4 className="text-red-600 text-4xl font-bold">
                                  {finalPrice.toLocaleString()} đ
                                </h4>
                              </div>

                              <div className='mt-4'>
                                {!isFormValid() ? (

                                    <button 
                                    type="button"
                                    className=" text-gray-500 text-lg w-full h-12 rounded-lg border border-gray-500 "
                                    disabled={!isAgreed}>
                                      Nhập thông tin để đặt Tour
                                    </button>
                                  ) : (
                                    <button 
                                    type="button"
                                    className="bg-red-600 text-white text-lg w-full h-12 rounded-lg "
                                    onClick={handleSubmit}
                                    >
                                      Đặt Tour
                                    </button>
                                  )}
                              </div>
                          </li>
                      </ul>
                  </div>
                </div>
              </div>
          </div>
        </div>
        </div>
        <Footer />  
      </div>
    );
  };

  export default BookingPage;
