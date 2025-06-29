import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Swal from 'sweetalert2';

const UpdateTransaction = ({ transactionId, onBack }) => {
  const [formData, setFormData] = useState({
    status: '',
    paymentMethod: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch current transaction data when the component mounts
  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/v1/transaction/${transactionId}`);
        const transaction = response.data;

        // Set the form data with the existing transaction data
        setFormData({
          status: transaction.status || '',
          paymentMethod: transaction.paymentMethod || '',
        });
      } catch (error) {
        Swal.fire('Lỗi', 'Không thể lấy thông tin giao dịch.', 'error');
      }
    };

    fetchTransactionData();
  }, [transactionId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.put(`http://localhost:4000/v1/transaction/${transactionId}`, formData);
      Swal.fire('Thành công', 'Giao dịch đã được cập nhật.', 'success');
      onBack();
    } catch (error) {
      Swal.fire('Lỗi', 'Cập nhật giao dịch thất bại.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Cập nhật Giao dịch</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Trạng thái
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Chọn trạng thái</option>
            <option value="Đang xử lí">Đang xử lí</option>
            <option value="Đã đặt cọc">Đã đặt cọc</option>
            <option value="Đã hoàn thành">Đã hoàn thành</option>
            <option value="Đã hủy giao dịch">Đã hủy giao dịch</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
            Phương thức thanh toán
          </label>
          <input
            type="text"
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="ml-4 px-4 py-2 bg-gray-500 text-white rounded"
        >
          Hủy
        </button>
      </form>
    </div>
  );
};

UpdateTransaction.propTypes = {
  transactionId: PropTypes.string.isRequired, // Chuyển sang string vì ID có thể là chuỗi
  onBack: PropTypes.func.isRequired,
};

export default UpdateTransaction;
