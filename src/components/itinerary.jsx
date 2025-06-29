import { useState } from "react";

const DayItem = ({ day, description }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Xử lý biểu tượng mở/đóng
  const icon = isOpen ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
      <path fill="#000" fillRule="evenodd" d="M6.414 9.532a.75.75 0 0 1 1.055-.118L12 13.04l4.532-3.626a.75.75 0 1 1 .936 1.172l-5 4a.75.75 0 0 1-.937 0l-5-4a.75.75 0 0 1-.117-1.054" clipRule="evenodd"></path>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
      <path fill="#000" fillRule="evenodd" d="M17.586 14.469a.75.75 0 0 1-1.054.117L12 10.96l-4.532 3.626a.75.75 0 0 1-.937-1.172l5-4a.75.75 0 0 1 .938 0l5 4a.75.75 0 0 1 .117 1.055" clipRule="evenodd"></path>
    </svg>
  );

  return (
    <div className="border border-gray-300 rounded-lg my-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center font-medium font-sans text-lg w-full px-4 py-2 bg-gray-50 hover:bg-blue-200 text-left rounded-lg transition duration-200"
      >
        <span>{day}</span>
        <span>{icon}</span>
      </button>
      {isOpen && (
        <div className="px-4 py-2 relative">
          <ul className="list-none pl-0"> {/* Bỏ dấu chấm và lề */}
            <li dangerouslySetInnerHTML={{ __html: description }} /> {/* Hiển thị mô tả với dangerouslySetInnerHTML */}
          </ul>
        </div>
      )}
    </div>
  );
};

const Itinerary = ({ itineraries }) => {
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-bold mb-4 text-center">LỊCH TRÌNH</h2>
      {itineraries.map((item) => (
        <DayItem
          key={item.dayNumber} // Sử dụng dayNumber làm key
          day={item.dayNumber}
          description={item.description}
        />
      ))}
    </div>
  );
};

export default Itinerary;
