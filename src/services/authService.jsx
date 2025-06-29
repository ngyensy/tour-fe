import axios from 'axios';

const API_URL = 'http://localhost:4000/v1/auth/login'; // Đảm bảo rằng URL API của bạn là chính xác

export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}login`, loginData);
    return response.data;
  } catch (error) {
    throw new Error('Đăng nhập không thành công. Vui lòng kiểm tra lại.');
  }
}