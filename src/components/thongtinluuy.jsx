import { useState } from "react";

const InfoItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-lg my-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
         className="flex justify-between items-center font-medium text-lg w-full px-2 py-3 bg-gray-50 hover:bg-blue-200 text-left rounded-lg transition duration-200"
      >
        <span>{title}</span>
        <span>{isOpen ? 
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
                <path fill="#000" fillRule="evenodd" d="M6.414 9.532a.75.75 0 0 1 1.055-.118L12 13.04l4.532-3.626a.75.75 0 1 1 .936 1.172l-5 4a.75.75 0 0 1-.937 0l-5-4a.75.75 0 0 1-.117-1.054" clipRule="evenodd"></path></svg> 
            : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path fill="#000" fillRule="evenodd" d="M17.586 14.469a.75.75 0 0 1-1.054.117L12 10.96l-4.532 3.626a.75.75 0 0 1-.937-1.172l5-4a.75.75 0 0 1 .938 0l5 4a.75.75 0 0 1 .117 1.055" clipRule="evenodd"></path></svg>
        }</span>
      </button>
      {isOpen && (
        <div className="px-4 py-2">
          {children}
        </div>
      )}
    </div>
  );
};

const ImportantInfo = () => {
  return (
    <div className="pt-4">
      <h2 className="text-2xl font-bold mb-4 text-center">
        NHỮNG THÔNG TIN CẦN LƯU Ý
      </h2>
      <div className="flex flex-wrap justify-between">
        <ul className="w-full md:w-1/2 pr-3">
          <InfoItem title="Giá tour bao gồm">
            <ul className="list-none text-justify">
              <div>- Xe tham quan (15, 25, 35, 45 chỗ tùy theo số lượng khách) theo chương trình</div>
              <div>- Hành lý ký gửi: 20 kg, xách tay 7 kg/1 khách</div>
              <div>- Khách sạn theo tiêu chuẩn 2 khách/phòng hoặc 3 khách/phòng</div>
              <div>- Ăn theo chương trình, thực đơn món Việt (set menu)</div>
              <div>- Vé tham quan theo chương trình</div>
              <div>- Hướng dẫn viên tiếng Việt nối tuyến</div>
              <div>- Bảo hiểm du lịch với mức bồi thường cao nhất 120.000.000đ/vụ</div>
              <div>- Nón Vietravel + Nước suối + Khăn lạnh</div>
              <div>- Thuế VAT</div>
            </ul>
          </InfoItem>
          <InfoItem title="Giá tour không bao gồm">
            <ul className="list-none text-justify">
                <div>- Vé cáp treo Bà Nà và 01 bữa trưa tại Bà Nà</div>
                <div>- Chi phí hủy đổi hành trình bay, hành lý quá cước, giặt ủi,…   </div>
                <div>- Chi phí cá nhân trong quá trình đi tour.</div>
            </ul>
          </InfoItem>
          <InfoItem title="Lưu ý giá trẻ em">
            <ul className="list-none text-justify">
                <div>- - Trẻ em từ 5 tuổi đến dưới 12 tuổi: 75% giá tour người lớn (không có chế độ giường riêng). Hai người lớn chỉ được kèm 1 trẻ em từ 5 - dưới 12 tuổi, em thứ hai trở lên phải mua 1 suất giường đơn.
                - Trẻ em từ 12 tuổi trở lên: mua một vé như người lớn</div>
                <div>- Trẻ em từ 12 tuổi trở lên: mua một vé như người lớn</div>
            </ul>
          </InfoItem>
          <InfoItem title="Điều kiện thanh toán">
            <ul className="list-none text-justify">
                <div>- Khi đăng ký đặt cọc 50% số tiền tour.</div>
                <div>- Thanh toán hết trước ngày khởi hành 7-10 ngày (tour ngày thường), 20-25 ngày (tour lễ tết).</div>
            </ul>
          </InfoItem>
          <InfoItem title="Điều kiện đăng ký">
            <ul className="list-none text-justify">
            </ul>
          </InfoItem>
          
        </ul>
        
        <ul className="w-full md:w-1/2 pl-3">
            <InfoItem title="Lưu ý về chuyển hoặc hủy tour">
                <ul className="list-none text-justify">
                <div>- Sau khi đóng tiền, nếu Quý khách muốn chuyển/hủy tour xin vui lòng mang Vé Du Lịch đến văn phòng đăng ký tour để làm thủ tục chuyển/hủy tour và chịu mất phí theo quy định của Vietravel. Không giải quyết các trường hợp liên hệ chuyển/hủy tour qua điện thoại.</div>
                </ul>
            </InfoItem>
          <InfoItem title="Điều kiện hủy tour đối với ngày thường">
            <ul className="list-none text-justify">
                <div>- Được chuyển sang các tuyến du lịch khác trước ngày khởi hành 20 ngày : Không mất chi phí.</div>
                <div>- Nếu hủy hoặc chuyển sang các chuyến du lịch khác ngay sau khi đăng ký đến từ 15-19 ngày trước ngày khởi hành: Chi phí hủy tour: 50% tiền cọc tour.</div>
                <div>- Nếu hủy hoặc chuyển sang các chuyến du lịch khác từ 12-14 ngày trước ngày khởi hành: Chi phí hủy tour: 100% tiền cọc tour.</div>
                <div>- Nếu hủy chuyến du lịch trong vòng từ 08-11 ngày trước ngày khởi hành: Chi phí hủy tour: 50% trên giá tour du lịch.</div>
                <div>- Nếu hủy chuyến du lịch trong vòng từ 05-07 ngày trước ngày khởi hành: Chi phí hủy tour: 70% trên giá tour du lịch.</div>
                <div>- Nếu hủy chuyến du lịch trong vòng từ 02-04 ngày trước ngày khởi hành: Chi phí hủy tour: 90% trên giá vé du lịch.</div>
                <div>- Nếu hủy chuyến du lịch trong vòng 1 ngày trước ngày khởi hành : Chi phí hủy tour: 100% trên giá vé du lịch.</div>
            </ul>
          </InfoItem>
          <InfoItem title="Điều kiện hủy tour đối với ngày lễ, tết">
            <ul className="list-none text-justify">
                <div>- Được chuyển sang các tuyến du lịch khác trước ngày khởi hành 30 ngày : Không mất chi phí.</div>
                <div>- Nếu hủy hoặc chuyển sang các chuyến khác ngay sau khi đăng ký đến từ 25-29 ngày trước ngày khởi hành: Chi phí hủy tour: 50% tiền cọc tour.</div>
                <div>- Nếu hủy hoặc chuyển sang các chuyến khác từ 20-24 ngày trước ngày khởi hành: Chi phí hủy tour: 100% tiền cọc tour.</div>
                <div>- Nếu hủy chuyến du lịch trong vòng từ 17-19 ngày trước ngày khởi hành: Chi phí hủy tour: 50% trên giá tour du lịch.</div>
                <div>- Nếu hủy chuyến du lịch trong vòng từ 08-16 ngày trước ngày khởi hành: Chi phí hủy tour: 70% trên giá tour du lịch.</div>
                <div>- Nếu hủy chuyến du lịch trong vòng từ 02-07 ngày trước ngày khởi hành: Chi phí hủy tour: 90% trên giá vé du lịch.</div>
                <div>- Nếu hủy chuyến du lịch trong vòng 1 ngày trước ngày khởi hành : Chi phí hủy tour: 100% trên giá vé du lịch.</div>
                <div>*Các tour Lễ, Tết là tour có thời gian diễn ra rơi vào một trong các ngày Lễ, Tết theo quy định</div>
                <div>*Thời gian hủy được tính cho ngày làm việc, không tính thứ 7, Chủ Nhật và các ngày Lễ, Tết.</div>
                <div></div>

            </ul>
          </InfoItem>
          <InfoItem title="Trường hợp lý do bất khả kháng">
            <ul className="list-none text-justify">
             <div>Nếu chương trình du lịch bị hủy bỏ hoặc thay đổi bởi một trong hai bên vì lý do bất khả kháng (hỏa hoạn, thời tiết, tai nạn, thiên tai, chiến tranh, dịch bệnh, hoãn, dời, và hủy chuyến hoặc thay đổi khác của các phương tiện vận chuyển công cộng hoặc các sự việc bất khả kháng khác theo quy định pháp luật…), thì hai bên sẽ không chịu bất kỳ nghĩa vụ bồi hoàn các tổn thất đã xảy ra và không chịu bất kỳ trách nhiệm pháp lý nào. Tuy nhiên mỗi bên có trách nhiệm cố gắng tối đa để giúp đỡ bên bị thiệt hại nhằm giảm thiểu các tổn thất gây ra vì lý do bất khả kháng.</div>
            </ul>
          </InfoItem>
          
          <InfoItem title="Liên hệ">
            <ul className="list-none text-justify">
                <div>Mọi chi tiết vui lòng liên hệ:
                        Tổng đài tư vấn <strong className="text-blue-500">1900 1839</strong> <br />

                    VIETRAVEL KÍNH CHÚC QUÝ KHÁCH MỘT CHUYẾN DU LỊCH VUI VẺ</div>
            </ul>
          </InfoItem>
        </ul>
      </div>
    </div>
  );
};

export default ImportantInfo;
