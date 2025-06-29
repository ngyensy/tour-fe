import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import "../../styles/account-info.css";

const UserDetail = () => {
    const { user, updateUser } = useAuth(); // Lấy thông tin người dùng từ AuthContext
    const [userData, setUserData] = useState({});
    const [editFields, setEditFields] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // Nếu thông tin người dùng đã có trong context, lưu vào state
        if (user) {
            setUserData(user); // Lưu thông tin người dùng từ context vào state
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleEditClick = (key) => {
        setEditFields((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSubmit = async (e, key) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:4000/v1/Users/${user.id}`, userData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                     Authorization: `Bearer ${user.token}`,
                },
            });
            console.log('Updated User Data:', userData);
            
            // Cập nhật thông tin người dùng trong context
            updateUser(userData);
    
            setEditFields((prev) => ({ ...prev, [key]: false }));
            setSuccessMessage('Cập nhật thông tin thành công!');
            setTimeout(() => {
                setSuccessMessage('');
            }, 5000);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    // Helper to format the date as dd/mm/yyyy
    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa cập nhật';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN'); // format as dd/mm/yyyy
    };

    return (
        <section className='flex flex-row justify-start items-center gap-2'>
            <div className='flex-grow p-4 border border-gray-500'>
                <div className='pb-5 border-b border-gray-500 mb-4'>
                    <h2 className='text-xl font-bold'>Thông tin cá nhân</h2>
                    <p className='text-[1rem] font-medium'>Cập nhật thông tin của Quý khách và tìm hiểu các thông tin này được sử dụng ra sao</p>
                </div>

                {successMessage && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-2 mb-4">
                        {successMessage}
                    </div>
                )}

                    <div className="grid grid-cols-2 gap-4">
                    {Object.entries({
                        'Họ tên': { key: 'name', type: 'text' },
                        'Email': { key: 'email', type: 'email' },
                        'Số điện thoại': { key: 'phoneNumber', type: 'tel' },
                        'Địa chỉ': { key: 'address', type: 'text' },
                        'Giới tính': { key: 'gender', type: 'select', options: ['Nam', 'Nữ', 'Khác'] },
                        'Ngày sinh': { key: 'dateOfBirth', type: 'date' },
                        'Điểm thưởng': { key: 'rewardPoints', type: 'text' },
                        'Tổng Số Tour đã đi': { key: 'numberOfToursTaken', type: 'text' }, // Không cho phép chỉnh sửa
                    }).map(([label, { key, type, options }], index) => (
                        <React.Fragment key={key}>
                        <div className="mb-2 flex-col items-center justify-between mx-8">
                            <div className="flex justify-between w-full">
                            <div>
                                <strong>{label}: </strong>
                                {key === 'dateOfBirth' ? (
                                        <span> {formatDate(userData[key])}</span>
                                    ) : (
                                        <span>
                                            {(key === 'rewardPoints' || key === 'numberOfToursTaken') ? (
                                                <span className="reward-points"> {userData[key] || 'Chưa có dữ liệu'}</span>
                                            ) : (
                                                userData[key] || 'Chưa cập nhật'
                                            )}
                                        </span>
                                    )}
                            </div>
                            {/* Chỉ hiển thị nút sửa cho các trường khác, không có nút sửa cho Điểm thưởng */}
                            {key !== 'rewardPoints' && key !== 'numberOfToursTaken' && (
                                <button onClick={() => handleEditClick(key)} className="text-blue-500">
                                    <FaEdit size={16} />
                                </button>
                            )}
        
                            </div>
                            {editFields[key] && (
                            <form onSubmit={(e) => handleSubmit(e, key)}>
                                {type === 'select' ? (
                                <select
                                    name={key}
                                    value={userData[key] || ''}
                                    onChange={handleChange}
                                    className="border rounded px-2 py-1 mt-2"
                                >
                                    {options.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                    ))}
                                </select>
                                ) : (
                                <input
                                    type={type}
                                    name={key}
                                    value={userData[key] || ''}
                                    onChange={handleChange}
                                    className="border rounded px-2 py-1 mt-2"
                                    placeholder={`Nhập ${label.toLowerCase()}`}
                                />
                                )}
                                <button type="submit" className="bg-blue-500 text-white py-1 px-2 rounded mt-2 ml-2">
                                Cập nhật
                                </button>
                            </form>
                            )}
                        </div>
                        {index % 2 === 1 && (
                            <div className="border-b border-gray-400 col-span-2 my-2" />
                        )}
                        </React.Fragment>
                    ))}
                    </div>
            </div>
        </section>
    );
};

export default UserDetail;
