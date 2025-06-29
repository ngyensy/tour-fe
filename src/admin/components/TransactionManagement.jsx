import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { debounce } from 'lodash';
import TransactionDetails from '../components/AdminTransaction/TransactionDetails'; // Import TransactionDetails
import UpdateTransaction from '../components/AdminTransaction/UpdateTransaction'; // Import UpdateTransaction

// Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState(null); // Track the selected transaction
    const [editingTransactionId, setEditingTransactionId] = useState(null); // Track the transaction being edited
  
    // Fetch transactions
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get('/transaction');
        // Sắp xếp dữ liệu theo ngày tạo giảm dần
        const sortedTransactions = response.data.$values.sort(
          (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
        );
        setTransactions(sortedTransactions);
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra');
      } finally {
        setLoading(false);
      }
    };
  
    // Xóa giao dịch
    const deleteTransaction = async (transactionId) => {
      try {
        await axiosInstance.delete(`/transaction/${transactionId}`);
        Swal.fire('Thành công!', 'Giao dịch đã được xóa.', 'success');
        fetchTransactions(); // Refetch after deletion
      } catch (err) {
        Swal.fire('Thất bại!', 'Không thể xóa giao dịch.', 'error');
      }
    };
  
    const handleDeleteTransaction = (transactionId) => {
      Swal.fire({
        title: 'Bạn có chắc chắn?',
        text: 'Giao dịch này sẽ bị xóa và không thể hoàn tác!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa!',
      }).then((result) => {
        if (result.isConfirmed) {
          deleteTransaction(transactionId);
        }
      });
    };
  
    const handleViewTransaction = (transactionId) => {
      setSelectedTransaction(transactionId); // Set selected transaction for viewing
    };
  
    const handleUpdateTransaction = (transactionId) => {
      setEditingTransactionId(transactionId); // Set transaction to edit
    };
  
    const handleBackFromUpdate = () => {
      setEditingTransactionId(null); // Reset editing state
      fetchTransactions(); // Re-fetch transactions after update
    };

    
  
    // Debounce tìm kiếm
    const handleSearchChange = useCallback(
      debounce((e) => {
        setSearchTerm(e.target.value);
      }, 500),
      []
    );

    const handleStatusChange = (e) => {
      setSelectedStatus(e.target.value);
    };
  
    useEffect(() => {
      fetchTransactions();
    }, []);

    
  
    const removeDiacritics = (str) =>
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  
    const filteredTransactions = transactions
      .filter((transaction) => {
        // Lọc trạng thái
        const statusMatch =
          !selectedStatus || transaction.status === selectedStatus;
  
        // Lọc theo tìm kiếm
        const searchMatch =
          removeDiacritics(transaction.id.toString()).includes(removeDiacritics(searchTerm)) ||
          removeDiacritics(transaction.booking?.guestName || '').includes(removeDiacritics(searchTerm));
  
        return statusMatch && searchMatch;
      });
  
    const getStatusColor = (status) => {
      switch (status) {
        case 'Đang xử lí':
          return 'bg-yellow-200 text-yellow-600 border-yellow-300';
        case 'Đã đặt cọc':
          return 'text-blue-600 bg-blue-100 border-blue-300';
        case 'Đã hoàn thành':
          return 'text-green-600 bg-green-100 border-green-300';
        case 'Đã hủy giao dịch': // Thêm trường hợp cho trạng thái "Đã hủy giao dịch"
          return 'text-red-600 bg-red-100 border-red-300'; // Màu đỏ cho trạng thái "Đã hủy"
        default:
          return 'text-gray-600 bg-gray-100 border-gray-300';
      }
    };
  
    if (loading) {
      return <div>Đang tải dữ liệu...</div>;
    }
  
    if (error) {
      return <div>Có lỗi xảy ra: {error}</div>;
    }
  
    if (selectedTransaction) {
      return <TransactionDetails transactionId={selectedTransaction} onBack={() => setSelectedTransaction(null)} />;
    }
  
    if (editingTransactionId) {
      return <UpdateTransaction transactionId={editingTransactionId} onBack={handleBackFromUpdate} />;
    }
  
    return (
      <div className="p-6 bg-white">
        <h1 className="text-2xl font-bold mb-6">Quản lý Giao dịch</h1>
  
        {/* Thanh tìm kiếm và lọc trạng thái */}
        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm mã giao dịch hoặc tên người dùng..."
            onChange={handleSearchChange}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Đang xử lí">Đang xử lí</option>
            <option value="Đã đặt cọc">Đã đặt cọc</option>
            <option value="Đã hoàn thành">Đã hoàn thành</option>
            <option value="Đã hủy giao dịch">Đã hủy giao dịch</option>
          </select>
        </div>
  
        {/* Bảng danh sách giao dịch */}
        <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-3 border-b border-r border-gray-500 text-center">ID</th>
              <th className="px-4 py-3 border-b border-r border-gray-500 text-center">Người dùng</th>
              <th className="px-4 py-3 border-b border-r border-gray-500 text-center">Số tiền</th>
              <th className="px-4 py-3 border-b border-r border-gray-500 text-center">Trạng thái</th>
              <th className="px-4 py-3 border-b border-r border-gray-500 text-center">Phương thức</th>
              <th className="px-4 py-3 border-b border-r border-gray-500 text-center">Ngày tạo</th>
              <th className="px-4 py-3 border-b border-gray-500 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction, index) => (
              <tr key={transaction.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="px-4 py-3 border-b border-r border-gray-500 text-center">{transaction.id}</td>
                <td className="px-4 py-3 border-b border-r border-gray-500 text-center">{transaction.booking?.guestName || 'Không xác định'}</td>
                <td className="px-4 py-3 border-b border-r border-gray-500 text-center">{transaction.amount.toLocaleString()} VNĐ</td>
                <td className={`px-4 py-2 text-center border-gray-500 border rounded-md`}>
                  <span className={`px-4 py-1 rounded-full whitespace-nowrap ${getStatusColor(transaction.status)}`}>{transaction.status}</span>
                </td>
                <td className="px-4 py-3 border-b border-r border-gray-500 text-center">{transaction.paymentMethod || 'Không xác định'}</td>
                <td className="px-4 py-3 border-b border-r border-gray-500 text-center">
                  {new Date(transaction.transactionDate).toLocaleString()}
                </td>
                <td className="px-4 py-3 border-b border-gray-500 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button onClick={() => handleViewTransaction(transaction.id)} className="text-blue-500 hover:text-blue-600" title="Xem chi tiết">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button onClick={() => handleUpdateTransaction(transaction.id)} className="text-yellow-500 hover:text-yellow-600" title="Cập nhật">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => handleDeleteTransaction(transaction.id)} className="text-red-500 hover:text-red-600" title="Xóa">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4">Không có giao dịch nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default TransactionsPage;
  