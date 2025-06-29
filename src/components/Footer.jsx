import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTiktok, faWhatsapp, faFacebookMessenger } from '@fortawesome/free-brands-svg-icons'; // Sử dụng faFacebookMessenger
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import momoImg from '../assets/img/momo.png';
import shoppeImg from '../assets/img/Shoppe.png';
import vnpayImg from '../assets/img/VNpay.png';
import visaImg from '../assets/img/Visa.png';
import mastercardImg from '../assets/img/Mastercard.png';
import msbImg from '../assets/img/MSB.png';
import chungnhanImg from '../assets/img/chungnhan.png';
import dmcImg from '../assets/img/DMC.png';
import '../styles/footer.css';




const Footer = () => {
  return (
    <footer className="footer bg-[#daefff] py-8 px-32">
      <div className="container mx-auto flex justify-between">
        {/* Các cột khác */}

        {/* Cột 1: Liên hệ */}
         <div className="w-1/4">
          <h3 className="font-bold mb-4">Liên hệ</h3>
          <p>190 Pasteur, Phường Võ Thị Sáu, Quận 3, TP.HCM</p>
          <p>(+84 28) 3822 8898</p>
          <p>(+84 28) 3829 9142</p>
          <p>info@vietravel.com</p>
          <div className="flex space-x-2 mt-4">
            <FontAwesomeIcon icon={faFacebook} className="text-xl" />
            <FontAwesomeIcon icon={faInstagram} className="text-xl" />
            <FontAwesomeIcon icon={faTiktok} className="text-xl" />
            <FontAwesomeIcon icon={faWhatsapp} className="text-xl" />
            <FontAwesomeIcon icon={faFacebookMessenger} className="text-xl" /> {/* Thay đổi */}
          </div>
          <button className="bg-red-600 text-white mt-4 py-2 px-4 rounded-lg">
            <FontAwesomeIcon icon={faPhone} /> 1900 1839
          </button>
          <p className="mt-2">Từ 8:00 - 23:00 hằng ngày</p>
        </div>

        {/* Cột 2: Thông tin */}
        <div className="w-1/4">
            <h3 className="font-bold mb-4">Thông tin</h3>
                <ul>
                    <li><a href="/tap-chi-du-lich" className="link">Tạp chí du lịch</a></li>
                    <li><a href="/cam-nang-du-lich" className="link">Cẩm nang du lịch</a></li>
                    <li><a href="/tin-tuc" className="link">Tin tức</a></li>
                    <li><a href="/tro-giup" className="link">Trợ giúp</a></li>
                    <li><a href="/chinh-sach-rieng-tu" className="link">Chính sách riêng tư</a></li>
                    <li><a href="/thoa-thuan-su-dung" className="link">Thỏa thuận sử dụng</a></li>
                    <li><a href="/chinh-sach-bao-ve-du-lieu" className="link">Chính sách bảo vệ dữ liệu cá nhân</a></li>
                </ul>
        </div>
        {/* Cột 3: Chứng nhận */}
        <div className="w-1/4">
          <h3 className="font-bold mb-4">Chứng nhận</h3>
          <img src={chungnhanImg} alt="Đã thông báo Bộ Công Thương" className="mb-2 w-48" />
          <img src={dmcImg} alt="DMCA Protected" className='mb-2 w-48' />
        </div>

        {/* Cột 4: Thanh toán */}
        <div className="w-1/4">
          <h3 className="font-bold mb-4">Chấp nhận thanh toán</h3>
          <div className="flex">
            <img src={momoImg} alt="Momo" className="mb-2 px-2 w-24" />
            <img src={shoppeImg} alt="Shoppe pay" className="mb-2 px-2 w-24" />
            <img src={vnpayImg} alt="VN pay" className="mb-2 px-2 w-24" />
          </div>
          <div className="flex">
            <img src={visaImg} alt="Visa" className="mb-2 px-2 w-24" />
            <img src={mastercardImg} alt="Mastercard" className="mb-2 px-2 w-24" />
            <img src={msbImg} alt="MSB" className="mb-2 px-2 w-24" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
