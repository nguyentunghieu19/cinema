import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "http://127.0.0.1:8000/api";

function PaymentResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4">
      <AnimatePresence mode="wait">
        {status === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center"
          >
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-neutral-700 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-2xl font-bold">Đang xác nhận thanh toán...</h1>
            <p className="text-gray-400 mt-2">Vui lòng chờ trong giây lát</p>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-5xl">✓</span>
            </div>
            <h1 className="text-4xl font-bold text-green-500 mb-4">
              Thanh toán thành công!
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Vé của bạn đã được xác nhận
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-xl transition-colors"
              >
                Về trang chủ
              </button>
              <button
                onClick={() => navigate("/bookings")}
                className="px-8 py-3 bg-red-600 hover:bg-red-500 rounded-xl transition-colors"
              >
                Xem vé đã đặt
              </button>
            </div>
          </motion.div>
        )}

        {status === "failed" && (
          <motion.div
            key="failed"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-5xl">✕</span>
            </div>
            <h1 className="text-4xl font-bold text-red-500 mb-4">
              Thanh toán thất bại
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Giao dịch không thành công hoặc bị hủy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-xl transition-colors"
              >
                Về trang chủ
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-8 py-3 bg-red-600 hover:bg-red-500 rounded-xl transition-colors"
              >
                Thử lại
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PaymentResultPage;
