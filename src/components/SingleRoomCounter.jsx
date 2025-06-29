import React from 'react';

const SingleRoomCounter = ({ count, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block font-semibold">Số lượng phòng đơn</label>
      <div className="flex items-center">
        <button
          type="button"
          className="px-3 py-1 bg-gray-200 rounded-lg"
          onClick={() => onChange(Math.max(count - 1, 0))} // Đảm bảo không âm
        >
          -
        </button>
        <span className="mx-4">{count}</span>
        <button
          type="button"
          className="px-3 py-1 bg-gray-200 rounded-lg"
          onClick={() => onChange(count + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default SingleRoomCounter;