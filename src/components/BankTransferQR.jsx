import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

const VietinBankQR = ({ accountNumber, accountName, amount }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState("");

    useEffect(() => {
        const generateQR = async () => {
            try {
                // Kiểm tra và ép kiểu amount thành số
                const validAmount = parseFloat(amount);
                if (isNaN(validAmount)) {
                    console.error("Lỗi: Amount không hợp lệ.");
                    return;
                }

                // Dữ liệu QR
                const data = [
                    "000201", // Payload Format Indicator
                    "010211", // Point of Initiation Method
                    "26340010A000000727012300069704000000000003", // VietQR Template ID
                    "0203ICB", // Mã ngân hàng VietinBank
                    "5303704", // Currency Code (VND)
                    `5403${validAmount.toFixed(0)}`, // Số tiền
                    "5802VN", // Quốc gia
                    `59${accountName.length}${accountName}`, // Tên tài khoản
                    `60${accountNumber.length}${accountNumber}`, // Số tài khoản
                ].join("");

                // Tính CRC checksum
                const crc = calculateCRC(data);
                const finalPayload = `${data}6304${crc}`;

                // Tạo QR code
                const qrCode = await QRCode.toDataURL(finalPayload);
                setQrCodeUrl(qrCode);   
            } catch (error) {
                console.error("Lỗi tạo mã QR:", error);
            }
        };

        generateQR();
    }, [accountNumber, accountName, amount]);

    // Hàm tính CRC
    const calculateCRC = (data) => {
        let crc = 0xFFFF;
        for (let i = 0; i < data.length; i++) {
            crc ^= data.charCodeAt(i) << 8;
            for (let j = 0; j < 8; j++) {
                if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
                else crc <<= 1;
            }
        }
        return ((crc & 0xFFFF) >>> 0).toString(16).toUpperCase().padStart(4, "0");
    };

    return (
        <div className="text-center">
            <h3 className="text-lg font-semibold">Quét mã QR để thanh toán:</h3>
            {qrCodeUrl ? (
                <div className="mt-4">
                    <img src={qrCodeUrl} alt="QR Code" className="mx-auto w-64 h-64" />
                    <div className="mt-4">
                        <p><strong>Tên ngân hàng:</strong> VietinBank</p>
                        <p><strong>Số tài khoản:</strong> {accountNumber}</p>
                        <p><strong>Số tiền:</strong> {Number(amount).toLocaleString()} VND</p>
                    </div>
                </div>
            ) : (
                <p>Đang tạo mã QR, vui lòng chờ...</p>
            )}
        </div>
    );
};

export default VietinBankQR;
