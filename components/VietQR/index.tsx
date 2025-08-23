import {notification} from "antd";
import React, {useEffect, useState} from "react";

interface VietQRProps {
  amount: number;
  orderNumber?: string;
  bankAccount?: string;
  accountName?: string;
  bankCode?: string;
  memo?: string;
}

// eslint-disable-next-line react/function-component-definition
const VietQR: React.FC<VietQRProps> = ({
  amount,
  orderNumber = "",
  bankAccount = "0123456789",
  accountName = "CONG TY ART EXHIBITION",
  memo = "",
  bankCode = "VCB",
}) => {
  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    const qrData = {
      bankCode: bankCode,
      accountNumber: bankAccount,
      accountName: accountName,
      amount: amount,
      description: memo || `Thanh toan don hang ${orderNumber}`,
      template: "compact",
    };

    const qrString = `https://img.vietqr.io/image/${qrData.bankCode}-${
      qrData.accountNumber
    }-${qrData.template}.png?amount=${
      qrData.amount
    }&addInfo=${encodeURIComponent(qrData.description)}`;

    setQrValue(qrString);
  }, [amount, orderNumber, bankAccount, accountName, memo]);

  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(bankAccount);
      notification.success({
        message: "Đã sao chép số tài khoản!",
        duration: 8,
      });
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleCopyAmount = async () => {
    try {
      await navigator.clipboard.writeText(amount.toString());
      notification.success({
        message: "Đã sao chép số tiền!",
        duration: 8,
      });
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border">
      <h3 className="font-semibold text-lg mb-4 text-center">
        Thanh toán qua VietQR
      </h3>

      {/* QR Code */}
      <div className="flex justify-center mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          {qrValue ? (
            <img
              src={qrValue}
              alt="VietQR Code"
              className="w-48 h-48 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded">
              <span className="text-gray-500">Đang tạo mã QR...</span>
            </div>
          )}

          {/* Fallback QR Code */}
          <div className="hidden w-48 h-48 flex items-center justify-center bg-gray-200 rounded">
            <span className="text-gray-500 text-center">
              Không thể tải mã QR
              <br />
              Vui lòng sử dụng thông tin chuyển khoản bên dưới
            </span>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Ngân hàng:</span>
          <span className="font-medium">Vietcombank (VCB)</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Số tài khoản:</span>
          <div className="flex items-center gap-2">
            <span className="font-medium font-mono">{bankAccount}</span>
            <button
              onClick={handleCopyAccount}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              📋 Copy
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Chủ tài khoản:</span>
          <span className="font-medium">{accountName}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Số tiền:</span>
          <div className="flex items-center gap-2">
            <span className="font-medium text-red-600">
              {amount.toLocaleString("vi-VN")} ₫
            </span>
            <button
              onClick={handleCopyAmount}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              📋 Copy
            </button>
          </div>
        </div>

        <div className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Nội dung CK:</span>
          <span className="font-medium text-right max-w-[200px] break-words">
            {memo || `Thanh toan don hang ${orderNumber}`}
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">
          Hướng dẫn thanh toán:
        </h4>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Mở app ngân hàng của bạn</li>
          <li>2. Quét mã QR hoặc nhập thông tin chuyển khoản</li>
          <li>3. Kiểm tra thông tin và xác nhận thanh toán</li>
          <li>4. Lưu lại ảnh chụp màn hình giao dịch thành công</li>
          <li>5. Chọn hoàn tất đơn hàng và chờ thông tin xác nhận</li>
        </ol>
      </div>

      {/* Notice */}
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Lưu ý:</strong> Đơn hàng sẽ được xử lý sau khi chúng tôi xác
          nhận thanh toán. Thời gian xác nhận: 5-15 phút trong giờ hành chính.
        </p>
      </div>
    </div>
  );
};

export default VietQR;
