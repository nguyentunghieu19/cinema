import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { createVNPayPayment } from "../api/paymentApi";

const API_URL = "http://127.0.0.1:8000/api";

function BookingPage() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();

  const [showtime, setShowtime] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);

  const seatRows = ["A", "B", "C", "D", "E"];
  const seatCols = 10;

  useEffect(() => {
    fetchShowtime();
    fetchBookings();
  }, [showtimeId]);

  const fetchShowtime = async () => {
    try {
      const res = await axios.get(`${API_URL}/showtimes/${showtimeId}`);
      setShowtime(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_URL}/bookings/`);

      const filteredSeats = res.data
        .filter(
          (booking) =>
            booking.showtime_id === parseInt(showtimeId) &&
            booking.status !== "cancelled",
        )
        .map((booking) => booking.seat_number);

      setBookedSeats(filteredSeats);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBooking = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Vui lòng đăng nhập trước khi đặt vé");
      navigate("/login");
      return;
    }

    if (!selectedSeat) {
      alert("Vui lòng chọn ghế");
      return;
    }

    try {
      // =========================
      // 1. Tạo booking
      // =========================
      const bookingRes = await axios.post(`${API_URL}/bookings/`, {
        user_id: user.id,
        showtime_id: parseInt(showtimeId),
        seat_number: selectedSeat,
      });

      const booking = bookingRes.data;

      // =========================
      // 2. Tạo thanh toán VNPay
      // =========================
      const paymentRes = await createVNPayPayment(booking.id);

      console.log("VNPay Response:", paymentRes.data);

      const paymentUrl = paymentRes.data.payment_url;

      if (!paymentUrl) {
        alert("Không thể tạo liên kết thanh toán VNPay");
        return;
      }

      // =========================
      // 3. Chuyển sang VNPay
      // =========================
      window.location.href = paymentUrl;
    } catch (err) {
      console.error(err);

      console.log("Payment Error:", err.response?.data);

      if (err.response?.data?.detail) {
        alert(err.response.data.detail);
      } else {
        alert("Đặt vé hoặc tạo thanh toán thất bại");
      }
    }
  };

  if (!showtime) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Đang tải thông tin suất chiếu...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Thông tin suất chiếu */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">Đặt Vé Xem Phim</h1>

          <div className="grid md:grid-cols-3 gap-4 text-gray-300">
            <p>🕒 {new Date(showtime.start_time).toLocaleString("vi-VN")}</p>

            <p>🏢 {showtime.theater_room}</p>

            <p>💰 {showtime.price.toLocaleString()} VNĐ</p>
          </div>
        </div>

        {/* Màn hình */}
        <div className="mb-10">
          <div className="w-full h-6 bg-gradient-to-r from-gray-700 via-white to-gray-700 rounded-full shadow-lg mb-2"></div>

          <p className="text-center text-gray-400 uppercase tracking-widest">
            Màn hình
          </p>
        </div>

        {/* Chú thích */}
        <div className="flex gap-6 justify-center mb-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-600 rounded"></div>
            <span>Ghế trống</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500 rounded"></div>
            <span>Đang chọn</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-500 rounded"></div>
            <span>Đã đặt</span>
          </div>
        </div>

        {/* Danh sách ghế */}
        <div className="bg-gray-900 rounded-xl p-8 mb-8">
          <div className="space-y-4">
            {seatRows.map((row) => (
              <div key={row} className="flex justify-center gap-3">
                {Array.from({ length: seatCols }, (_, i) => {
                  const seat = `${row}${i + 1}`;

                  const isBooked = bookedSeats.includes(seat);

                  return (
                    <button
                      key={seat}
                      disabled={isBooked}
                      onClick={() => setSelectedSeat(seat)}
                      className={`w-14 h-14 rounded-lg font-semibold transition ${
                        isBooked
                          ? "bg-red-500 cursor-not-allowed"
                          : selectedSeat === seat
                            ? "bg-green-500"
                            : "bg-gray-600 hover:bg-gray-500"
                      }`}
                    >
                      {seat}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Thanh toán */}
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-lg">
                Ghế đã chọn:
                <span className="font-bold text-green-400 ml-2">
                  {selectedSeat || "Chưa chọn"}
                </span>
              </p>

              <p className="text-lg">
                Tổng tiền:
                <span className="font-bold text-yellow-400 ml-2">
                  {selectedSeat
                    ? `${showtime.price.toLocaleString()} VNĐ`
                    : "0 VNĐ"}
                </span>
              </p>
            </div>

            <button
              onClick={handleBooking}
              className="bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-lg font-bold text-lg"
            >
              Thanh toán VNPay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
