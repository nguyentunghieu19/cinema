import axiosInstance from "./axios";

// =========================
// Tạo thanh toán VNPay
// =========================
export const createVNPayPayment = (bookingId) => {
  return axiosInstance.post("/api/payments/vnpay/create", {
    booking_id: bookingId,
  });
};

// =========================
// Lấy payment theo order id
// =========================
export const getPaymentByOrderId = (orderId) => {
  return axiosInstance.get(`/api/payments/${orderId}`);
};
