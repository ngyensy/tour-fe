import React, { useState } from 'react';
import Navbar from '../components/Nav';
import Footer from '../components/Footer';

const Contact = () => {
  // State để lưu trữ thông tin người dùng nhập vào
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Hàm xử lý khi người dùng nhập vào form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Hàm xử lý khi người dùng bấm nút gửi
  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu hợp lệ
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Gửi dữ liệu form đến API (nếu có)
    console.log('Submitted:', formData);

    // Hiển thị thông báo thành công
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.');

    // Reset form sau khi gửi thành công
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <div>
      <Navbar />
      <div className="w-[90%] mx-auto mt-8 mb-4">
        <h1 className="text-[2.6rem] font-bold text-blue-800 text-center mb-4">Liên hệ với chúng tôi</h1>
        <p className="text-lg mb-8 text-center">
          Để có thể đáp ứng được các yêu cầu và đóng góp ý kiến của quý khách, xin vui lòng gửi thông tin hoặc gọi đến hotline các chi nhánh bên dưới để liên hệ một cách nhanh chóng.
        </p>

        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8">
          {/* Form nhập thông tin liên hệ */}
          <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Họ tên
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Nhập họ tên của bạn"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Nhập email của bạn"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                Số điện thoại
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Nhập số điện thoại của bạn"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                Nội dung liên hệ
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="5"
                placeholder="Nhập nội dung liên hệ"
              ></textarea>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Gửi thông tin
              </button>
            </div>
          </form>

          {/* Phần thông tin chi nhánh */}
          <div className="bg-white shadow-md rounded p-6 h-full w-full max-w-lg">
            <h2 className="text-[2rem] font-bold text-blue-700 mb-4 text-center">Thông tin chi nhánh</h2>
            <div className="max-h-[395px] overflow-y-auto">
              <div className="mb-6">
                <h3 className="font-bold text-lg">CHI NHÁNH HÀ NỘI</h3>
                <p>VPDL khách lẻ: 03 Hai Bà Trưng, Hà Nội - Tel: 024.3933 1978</p>
                <p>VPDL khách đoàn: Tầng 7, tòa nhà Hồng Hà - Số 37 Ngô Quyền, Hà Nội - Tel: 024.3971 1159</p>
                <p>Hotline: (84.24) 3933 1978 | DLTN - 0989 37 00 33 | DLNN - 0983 16 00 22</p>
                <p>Email: vtv.hanoi@vietravel.com</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg">CHI NHÁNH QUẢNG NINH</h3>
                <p>18 Đường 25/4, P. Bạch Đằng, Tp. Hạ Long, Quảng Ninh</p>
                <p>Hotline: (84-203) 6262 266 | 0911 67 65 88</p>
                <p>Email: vtv.quangninh@vietravel.com</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg">CHI NHÁNH HẢI PHÒNG</h3>
                <p>04 Trần Hưng Đạo, P. Hoàng Văn Thụ, Q.Hồng Bàng, TP. Hải Phòng</p>
                <p>Hotline: (0225) 3 842 888 | 0936 900 085</p>
                <p>Email: vtv.haiphong@vietravel.com</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg">VIETRAVEL NGHỆ AN</h3>
                <p>201 Đặng Thái Thân, P. Quang Trung, TP. Vinh, Nghệ An</p>
                <p>Hotline: (84.238) 355 22 99 | 0946 376 288</p>
                <p>Email: info.vii@vietravel.com</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg">CHI NHÁNH THANH HÓA</h3>
                <p>Số 109 Dương Đình Nghệ, P.Tân Sơn, TP.Thanh Hóa</p>
                <p>Hotline: (84 237) 8728 969 | 0967 931 969</p>
                <p>Email: vtv.thanhhoa@vietravel.com</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg">CHI NHÁNH THÁI NGUYÊN</h3>
                <p>52 Hoàng Văn Thụ, TP. Thái Nguyên, tỉnh Thái Nguyên</p>
                <p>Hotline: 0208 3522 020</p>
                <p>Email: vtv.thainguyen@vietravel.com.vn</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
