import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Nav';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const DiscountsPage = () => {
    const { user, updateUser } = useAuth(); // Sử dụng updateUser để cập nhật điểm thưởng
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [discountCodes, setDiscountCodes] = useState([]); // State để lưu mã giảm giá đã đổi
    const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
    const [codesPerPage] = useState(10); // Số mã giảm giá hiển thị trên mỗi trang

    const discountOptions = [
        { rewardPointsRequired: 100, discountAmount: 100000 },
        { rewardPointsRequired: 200, discountAmount: 200000 },
        { rewardPointsRequired: 500, discountAmount: 500000 },
        { rewardPointsRequired: 1000, discountAmount: 1000000 },
    ];

    useEffect(() => {
        // Lấy danh sách mã giảm giá khi user đã đăng nhập
        const fetchDiscountCodes = async () => {
            if (!user) return;

            try {
                const response = await axios.get(`http://localhost:4000/v1/discountcode/user/${user.id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setDiscountCodes(response.data.$values);
            } catch (err) {
                setError("Hiện người dùng không có mã giảm giá nào!!!");
            }
        };

        fetchDiscountCodes();
    }, [user]);

    const handleRedeemPoints = async (option) => {
        if (!user || user.rewardPoints < option.rewardPointsRequired) {
            setError("Không đủ điểm thưởng hoặc bạn chưa đăng nhập.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await axios.post(
                'http://localhost:4000/v1/discountcode/redeem',
                {
                    userId: user.id,
                    amountDiscount: option.discountAmount,
                    rewardPointsRequired: option.rewardPointsRequired,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            // Cập nhật điểm thưởng sau khi đổi mã
            const updatedPoints = user.rewardPoints - option.rewardPointsRequired;
            updateUser({ rewardPoints: updatedPoints });

            // Cập nhật lại danh sách mã giảm giá
            const newDiscountCode = response.data;
            setDiscountCodes(prevCodes => [newDiscountCode, ...prevCodes]);

            setSuccessMessage(`Mã giảm giá của bạn: ${response.data.code}`);
        } catch (err) {
            setError(err.response?.data?.error || "Đã xảy ra lỗi khi đổi mã giảm giá.");
        } finally {
            setIsLoading(false);
        }
    };

    // Lấy các mã giảm giá cho trang hiện tại
    const indexOfLastCode = currentPage * codesPerPage;
    const indexOfFirstCode = indexOfLastCode - codesPerPage;
    const currentCodes = discountCodes.slice(indexOfFirstCode, indexOfLastCode);

    // Chuyển trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (!user) {
        return (
            <div>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-gray-700">Vui lòng đăng nhập để xem thông tin.</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />

            <div className="max-w-4xl mx-auto p-6">
                <h3 className="text-2xl font-semibold mb-4">
                    Điểm thưởng của bạn: {user.rewardPoints || 0}
                </h3>

                {successMessage && (
                    <div className="bg-green-100 p-4 rounded-lg text-green-700 mb-4">
                        <p>{successMessage}</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-4">
                        <p>{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {discountOptions.map((option, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-lg rounded-lg p-6 text-center border border-gray-200"
                        >
                            <h4 className="text-xl font-semibold mb-2">Giảm {option.discountAmount} VND</h4>
                            <p className="text-gray-700 mb-2">
                                Điểm yêu cầu: <strong>{option.rewardPointsRequired}</strong>
                            </p>
                            <p className="text-gray-400 mb-4">Hạn sử dụng: 7 ngày</p>

                            <button
                                onClick={() => handleRedeemPoints(option)}
                                disabled={isLoading || user.rewardPoints < option.rewardPointsRequired}
                                className={`py-2 px-4 rounded-full transition ${
                                    user.rewardPoints < option.rewardPointsRequired
                                        ? 'bg-gray-400 text-white cursor-not-allowed'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                            >
                                {isLoading ? "Đang xử lý..." : "Đổi ngay"}
                            </button>
                        </div>
                    ))}
                </div>

                <h4 className="text-2xl font-semibold mt-8 mb-4">Danh sách mã giảm giá của bạn</h4>
                {discountCodes.length === 0 ? (
                    <p className="text-gray-500">Bạn chưa có mã giảm giá nào.</p>
                ) : (
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left font-bold">Mã giảm giá</th>
                                <th className="px-6 py-3 text-left font-bold">Giảm</th>
                                <th className="px-6 py-3 text-left font-bold">Hạn sử dụng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCodes.map((code, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 text-red-600 font-bold">{code.code}</td>
                                    <td className="px-6 py-4 text-black">{code.amountDiscount} VND</td>
                                    <td className="px-6 py-4 text-black">
                                        {new Date(code.expiryDate).toLocaleDateString('vi-VN')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Pagination Controls */}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="py-2 px-4 bg-blue-500 text-white rounded-lg mr-2 disabled:opacity-50"
                    >
                        Trước
                    </button>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={indexOfLastCode >= discountCodes.length}
                        className="py-2 px-4 bg-blue-500 text-white rounded-lg ml-2 disabled:opacity-50"
                    >
                        Sau
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default DiscountsPage;
