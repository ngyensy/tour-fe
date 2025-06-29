import React from "react";
import Navbar from "../components/Nav";
import Footer from "../components/Footer";

const Aboutpage = () => {
  return (
    <div>
      <Navbar />
      <div className="bg-gradient-to-br from-white to-gray-50 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-blue-800 mb-6">
            Về Chúng Tôi
          </h1>
          <p className="text-lg text-gray-700 mb-10">
            Chào mừng bạn đến với <span className="font-semibold text-blue-600">Travel</span> – 
            nơi khơi nguồn cảm hứng cho những chuyến đi đáng nhớ. Với sứ mệnh kết nối mọi người với thế giới, 
            chúng tôi cam kết mang đến những trải nghiệm du lịch tốt nhất cho khách hàng.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center">
            <img
              src="/images/mission.jpg"
              alt="Sứ mệnh của chúng tôi"
              className="h-40 w-40 rounded-full object-cover shadow-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Sứ Mệnh</h3>
            <p className="text-gray-600 text-center">
              Đưa bạn đến những vùng đất mới, khám phá những nền văn hóa đặc sắc và tạo nên những kỷ niệm không thể quên.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <img
              src="/images/vision.jpg"
              alt="Tầm nhìn của chúng tôi"
              className="h-40 w-40 rounded-full object-cover shadow-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Tầm Nhìn</h3>
            <p className="text-gray-600 text-center">
              Trở thành nền tảng du lịch hàng đầu, nơi mà mọi người đều có thể dễ dàng tiếp cận và lên kế hoạch cho chuyến đi hoàn hảo.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <img
              src="/images/values.jpg"
              alt="Giá trị cốt lõi"
              className="h-40 w-40 rounded-full object-cover shadow-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Giá Trị Cốt Lõi</h3>
            <p className="text-gray-600 text-center">
              Tận tâm với khách hàng, trung thực trong dịch vụ, và luôn đổi mới để mang lại giá trị tốt nhất.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="/TourList"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
          >
            Khám phá các tour của chúng tôi
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Aboutpage;
