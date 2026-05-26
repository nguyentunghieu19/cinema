import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

function PaymentResultPage() {
  const location = useLocation();

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const query = location.search;

        const res = await axios.get(`${API_URL}/payments/vnpay/return${query}`);

        if (res.data.status === "success") {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error(error);
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      {status === "loading" && (
        <h1 className="text-3xl font-bold">Đang xác nhận thanh toán...</h1>
      )}

      {status === "success" && (
        <div className="text-center">
          <h1 className="text-5xl font-bold text-green-500 mb-4">
            Thanh toán thành công
          </h1>

          <p className="text-xl text-gray-300">Vé của bạn đã được xác nhận</p>
        </div>
      )}

      {status === "failed" && (
        <div className="text-center">
          <h1 className="text-5xl font-bold text-red-500 mb-4">
            Thanh toán thất bại
          </h1>

          <p className="text-xl text-gray-300">Giao dịch không thành công</p>
        </div>
      )}
    </div>
  );
}

export default PaymentResultPage;
