import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Nav";
import Footer from "../components/Footer";
import VietinBankQR from "../components/BankTransferQR"; // Import component QR
import { FaUser, FaMapMarkerAlt, FaCreditCard, FaInfoCircle } from "react-icons/fa"; // Thêm icon
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Confirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const totalAmount = location.state?.booking.totalPrice;
    const amountToPay = (totalAmount * 0.5).toFixed(0);

    const { booking, tour } = location.state || {};

    if (!booking || !tour) {
        return (
            <div>
                <Navbar />

                <div className="flex justify-center mb-10">
                    <h2 className="text-3xl text-blue-700 font-bold">XÁC NHẬN ĐẶT TOUR</h2>
                </div>

                <div className="text-center my-32">
                    <p className="text-red-500">Không có dữ liệu để hiển thị.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
                    >
                        Quay về trang đặt tour
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    const isBankTransfer = booking.paymentMethod.toLowerCase() === "chuyển khoản";
    const isCash = booking.paymentMethod.toLowerCase() === "tiền mặt";
    const isMomo = booking.paymentMethod.toLowerCase() === "Thanh toán bằng MoMo";
    const isZaloPay = booking.paymentMethod.toLowerCase() === "Thanh toán bằng ZaloPay";

    const exportToPDF = () => {
        const content = document.getElementById("confirmation-content");
        html2canvas(content).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 190;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 10, position + 10, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 10, position + 10, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save("XacNhanDatTour.pdf");
        });
    };

    return (
        <div>
            <Navbar />

            <div className="flex justify-center my-10">
                <h2 className="text-3xl text-blue-700 font-bold">XÁC NHẬN ĐẶT TOUR</h2>
            </div>

            <div id="confirmation-content" className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Xác Nhận Đặt Tour</h1>

                {/* Thông Tin Khách Hàng */}
                <div className="p-6 bg-gray-50 rounded-lg shadow-md mb-6">
                    <h2 className="text-lg font-semibold text-blue-700 flex items-center mb-4">
                        <FaUser className="mr-2" /> Thông Tin Khách Hàng
                    </h2>
                    <p><strong>Họ tên:</strong> {booking.guestName}</p>
                    <p><strong>Email:</strong> {booking.guestEmail}</p>
                    <p><strong>Số điện thoại:</strong> {booking.guestPhoneNumber}</p>
                    <p><strong>Địa chỉ:</strong> {booking.guestAddress}</p>
                </div>

                {/* Thông Tin Tour */}
                <div className="p-6 bg-gray-50 rounded-lg shadow-md mb-6">
                    <h2 className="text-lg font-semibold text-blue-700 flex items-center mb-4">
                        <FaMapMarkerAlt className="mr-2" /> Thông Tin Tour
                    </h2>
                    <p><strong>Tên tour:</strong> {tour.name}</p>
                    <p><strong>Mô tả:</strong> {tour.description}</p>
                    <p><strong>Địa điểm khởi hành:</strong> {tour.departureLocation}</p>
                    <p><strong>Điểm đến:</strong> {tour.destination}</p>
                </div>

                {/* Chi Tiết Booking */}
                <div className="p-6 bg-gray-50 rounded-lg shadow-md mb-6">
                    <h2 className="text-lg font-semibold text-blue-700 flex items-center mb-4">
                        <FaInfoCircle className="mr-2" /> Chi Tiết Booking
                    </h2>
                    <p><strong>Số lượng người lớn:</strong> {booking.numberOfAdults}</p>
                    <p><strong>Số lượng trẻ em:</strong> {booking.numberOfChildren}</p>
                    <p><strong>Tổng tiền:</strong> {booking.totalPrice.toLocaleString()} VND</p>
                    <p><strong>Phương thức thanh toán:</strong> {booking.paymentMethod}</p>
                </div>

                {/* Phương Thức Thanh Toán */}
                {isBankTransfer && (
                    <div className="p-6 bg-green-50 rounded-lg shadow-md mb-6 text-center">
                        <p className="text-lg font-semibold text-green-700">Quý khách vui lòng thanh toán 50% tổng số tiền qua chuyển khoản:</p>
                        <VietinBankQR
                            accountNumber="0342965559"
                            accountName="NGUYEN THI HONG HA"
                            amount={amountToPay}
                        />
                    </div>
                )}

                {isCash && (
                    <div className="p-6 bg-yellow-50 rounded-lg shadow-md mb-6 text-center">
                        <p className="text-lg font-semibold text-yellow-700">Vui lòng đến chi nhánh gần nhất để thanh toán.</p>
                        <a href="/contact" className="text-blue-500 hover:underline">Danh sách chi nhánh</a>
                    </div>
                )}

                {isMomo && (
                    <div className="p-6 bg-purple-50 rounded-lg shadow-md mb-6 text-center">
                        <p className="text-lg font-semibold text-purple-700">Sử dụng MoMo để thanh toán {amountToPay} VND:</p>
                        <img src="/images/momo-qr.png" alt="QR Momo" className="mx-auto w-40 h-40" />
                    </div>
                )}

                {isZaloPay && (
                    <div className="p-6 bg-blue-50 rounded-lg shadow-md mb-6 text-center">
                        <p className="text-lg font-semibold text-blue-700">Sử dụng ZaloPay để thanh toán {amountToPay} VND:</p>
                        <img src="/images/zalopay-qr.png" alt="QR ZaloPay" className="mx-auto w-40 h-40" />
                    </div>
                )}

                {/* Nút xuất PDF */}
                <div className="text-center">
                    <button
                        onClick={exportToPDF}
                        className="bg-green-500 text-white px-6 py-2 rounded-md shadow hover:bg-green-600"
                    >
                        Xuất PDF
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Confirmation;
