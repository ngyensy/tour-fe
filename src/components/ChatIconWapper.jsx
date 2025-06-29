import React from 'react';
import { useLocation } from 'react-router-dom';
import ChatIcon from './Chatcontainer';

const ChatIconWrapper = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin'); // Kiểm tra nếu là route admin
  return !isAdminRoute && <ChatIcon />; // Ẩn ChatIcon nếu là admin route
};

export default ChatIconWrapper;