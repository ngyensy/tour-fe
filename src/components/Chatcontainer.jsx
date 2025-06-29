import React, { useState } from "react";

const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false); // Trạng thái mở/đóng menu

  return (
    <div>
      {/* Nút chính */}
      <div
        className="fixed bottom-5 right-20 bg-blue-500 text-white w-16 h-16 p-2 rounded-full flex items-center shadow-white justify-center shadow-lg cursor-pointer hover:bg-blue-600 transition"
        onClick={() => setIsOpen(!isOpen)} // Chuyển trạng thái
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
          >
            <path
              fill="#fff"
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 0 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06"
              clipRule="evenodd"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
          >
            <path
              fill="#fff"
              d="M20.242 7.804h-1.227c-1.044-2.538-3.343-4.382-5.989-4.734-2.622-.358-5.2.675-6.885 2.755a7.9 7.9 0 0 0-1.176 1.979H3.758C2.788 7.804 2 8.61 2 9.603v2.4c0 .992.789 1.799 1.758 1.799h2.406l-.252-.787c-.733-2.291-.32-4.633 1.132-6.423 1.426-1.76 3.605-2.632 5.83-2.333 2.353.314 4.396 2.018 5.205 4.342l.005.013q.195.532.275 1.096a6.75 6.75 0 0 1-.289 3.288l-.003.007c-.904 2.63-3.338 4.396-6.055 4.396-.976 0-1.77.807-1.77 1.8 0 .992.789 1.799 1.758 1.799.97 0 1.758-.807 1.758-1.8v-.808c2.34-.57 4.305-2.268 5.25-4.59h1.234c.97 0 1.758-.807 1.758-1.8V9.603c0-.992-.788-1.8-1.758-1.8"
            ></path>
            <path
              fill="#fff"
              d="M6.727 15.002v1.2H12c2.908 0 5.274-2.422 5.274-5.4 0-2.976-2.366-5.398-5.274-5.398s-5.273 2.422-5.273 5.399c0 1.213.398 2.386 1.126 3.335a1.17 1.17 0 0 1-1.126.864m7.03-4.8h1.173v1.2h-1.172zm-2.343 0h1.172v1.2h-1.172zm-2.344 0h1.172v1.2H9.07z"
            ></path>
          </svg>
        )}
      </div>

      {/* Menu icon */}
      <div
        className={`fixed bottom-5 ${
          isOpen ? "right-[160px]" : "right-0"
        } flex items-center transition-all duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-[150%]"
        }`}
        style={{ gap: "15px" }} // Khoảng cách giữa các nút
      >
        {/* Icon Facebook */}
        <a
          href="https://www.facebook.com/vietravel/"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "0.1s" }}
        >
          <img
            src="https://travel.com.vn/_next/static/media/facebook.8b562b73.png"
            alt="Facebook"
            className="w-14 h-14"
          />
        </a>

        {/* Icon Zalo */}
        <a
          href="https://id.zalo.me/account?continue=http%3A%2F%2Fzalo%2Eme%2Fvietravel"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center rounded-full shadow-lg shadow-blue-500 transition ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "0.2s" }}
        >
          <img
            src="https://travel.com.vn/_next/static/media/zalo.717909d1.png"
            alt="Zalo"
            className="w-14 h-14"
          />
        </a>
      </div>
    </div>
  );
};

export default FloatingButton;
