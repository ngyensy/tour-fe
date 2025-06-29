import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Đảm bảo bạn đã cài đặt axios

const ChangePassword = ({ userId }) => { // Thêm userId nếu cần
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const [error, setError] = useState(''); // Trạng thái để lưu lỗi
    const [successMessage, setSuccessMessage] = useState(''); // Trạng thái để lưu thông báo thành công

    // Hàm kiểm tra độ mạnh mật khẩu
    const checkPasswordStrength = (password) => {
        let strength = '';
        const lengthCriteria = password.length >= 8;
        const uppercaseCriteria = /[A-Z]/.test(password);
        const lowercaseCriteria = /[a-z]/.test(password);
        const numberCriteria = /[0-9]/.test(password);
        const specialCharCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const fulfilledCriteria = [
            lengthCriteria,
            uppercaseCriteria,
            lowercaseCriteria,
            numberCriteria,
            specialCharCriteria,
        ].filter(Boolean).length;

        if (fulfilledCriteria === 5) {
            strength = 'Mạnh';
        } else if (fulfilledCriteria >= 3) {
            strength = 'Trung bình';
        } else {
            strength = 'Yếu';
        }

        return strength;
    };

    // Cập nhật độ mạnh mật khẩu khi mật khẩu mới thay đổi
    useEffect(() => {
        setPasswordStrength(checkPasswordStrength(newPassword));
    }, [newPassword]);

    // Hàm xử lý thay đổi mật khẩu
    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Xác nhận mật khẩu không khớp!');
            return;
        }

        try {
            // Gửi yêu cầu đổi mật khẩu
            const response = await axios.put(`http://localhost:4000/v1/users/${userId}/change-password`, {
                OldPassword: oldPassword,
                NewPassword: newPassword,
            });
            setSuccessMessage(response.data.message || "Đổi mật khẩu thành công!"); // Lưu thông báo thành công
            // Reset các trường sau khi thành công
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setError('');

            // Đặt hẹn giờ để xóa thông báo thành công
            setTimeout(() => {
                setSuccessMessage('');
            }, 5000); // 5000ms = 5 giây
        } catch (err) {
            // Xử lý lỗi trả về từ API
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
            setSuccessMessage(''); // Reset thông báo thành công nếu có lỗi
        }
    };

    // Hàm để xóa thông báo lỗi sau một khoảng thời gian
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 5000); // 5000ms = 5 giây

            return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount
        }
    }, [error]);

    return (
        <div>
            <div className='flex-grow p-4 border border-gray-500'>
                <div className='pb-5 border-b border-gray-400 mb-4'>
                    <h2 className='text-xl font-bold'>Đổi mật khẩu</h2>
                    <p className='text-[1rem] font-medium'>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
                </div>
                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-4">{error}</div>} {/* Hiển thị lỗi */}
                {successMessage && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-2 mb-4">{successMessage}</div>} {/* Hiển thị thông báo thành công */}
                <form onSubmit={handlePasswordChange}>
                    <div className="mb-4">
                        <label className="block font-bold mb-2">Mật khẩu cũ:</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="border border-gray-400 p-2 rounded w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-bold mb-2">Mật khẩu mới:</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="border border-gray-500 p-2 rounded w-full"
                            required
                        />
                        {newPassword && (
                            <p className="text-sm font-medium mt-2">
                                Độ mạnh mật khẩu: <span className={`font-bold ${
                                    passwordStrength === 'Mạnh' ? 'text-green-600' :
                                    passwordStrength === 'Trung bình' ? 'text-yellow-600' :
                                    'text-red-600'
                                }`}>{passwordStrength}</span>
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block font-bold mb-2">Xác nhận mật khẩu mới:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border border-gray-500 p-2 rounded w-full"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                        Đổi mật khẩu
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
