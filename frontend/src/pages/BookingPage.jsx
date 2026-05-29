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
  const [selectedSeat, setSelectedSeat] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;

    if (selectedSeat.includes(seat)) {
      setSelectedSeat(selectedSeat.filter((s) => s !== seat));
    } else {
      setSelectedSeat([...selectedSeat, seat]);
    }
  };

  const handleBooking = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Vui lòng đăng nhập trước khi đặt vé");
      navigate("/login");
      return;
    }

    if (selectedSeat.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế");
      return;
    }

    try {
      // 1. Create booking for each selected seat
      for (const seat of selectedSeat) {
        const bookingRes = await axios.post(`${API_URL}/bookings/`, {
          user_id: user.id,
          showtime_id: parseInt(showtimeId),
          seat_number: seat,
        });

        const booking = bookingRes.data;

        // 2. Create VNPay payment
        const paymentRes = await createVNPayPayment(booking.id);

        const paymentUrl = paymentRes.data.payment_url;

        if (paymentUrl) {
          window.location.href = paymentUrl;
        }
      }
    } catch (err) {
      console.error(err);

      if (err.response?.data?.detail) {
        alert(err.response.data.detail);
      } else {
        alert("Đặt vé hoặc tạo thanh toán thất bại");
      }
    }
  };

  if (loading || !showtime) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Đang tải thông tin suất chiếu...</p>
        </div>
      </div>
    );
  }

  const totalPrice = selectedSeat.length * showtime.price;

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 sm:px-6 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Showtime Info */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8">
          <h1 className="text-2xl font-bold mb-4">🎬 Đặt Vé Xem Phim</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🕒</span>
              <span className="text-gray-300">
                {new Date(showtime.start_time).toLocaleString("vi-VN")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xl">🏢</span>
              <span className="text-gray-300">{showtime.theater_room}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xl">💰</span>
              <span className="text-yellow-400 font-semibold">
                {showtime.price.toLocaleString()} VNĐ
              </span>
            </div>
          </div>
        </div>

        {/* Screen indicator with glow effect */}
        <div className="mb-10 text-center">
          <div className="relative">
            <div className="w-full h-8 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full blur-lg opacity-20"></div>
            <div className="w-full h-6 bg-gradient-to-r from-gray-700 via-white to-gray-700 rounded-full shadow-lg shadow-red-500/20 mt-[-32px]"></div>
          </div>
          <p className="text-gray-500 uppercase tracking-widest mt-2 text-sm">
            Màn hình
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-6 justify-center mb-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-neutral-700 border border-neutral-600 rounded"></div>
            <span className="text-gray-400">Ghế trống</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded"></div>
            <span className="text-green-400">Đang chọn</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded"></div>
            <span className="text-red-400">Đã đặt</span>
          </div>
        </div>

        {/* Seat Grid */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 mb-8">
          <div className="space-y-3">
            {seatRows.map((row) => (
              <div key={row} className="flex justify-center items-center gap-2">
                <span className="w-6 text-gray-500 font-bold text-sm">
                  {row}
                </span>
                <div className="flex gap-2">
                  {Array.from({ length: seatCols }, (_, i) => {
                    const seat = `${row}${i + 1}`;
                    const isBooked = bookedSeats.includes(seat);
                    const isSelected = selectedSeat.includes(seat);

                    return (
                      <button
                        key={seat}
                        disabled={isBooked}
                        onClick={() => toggleSeat(seat)}
                        className={`w-12 h-12 rounded-lg font-semibold text-sm transition-all duration-200 ${
                          isBooked
                            ? "bg-red-600/50 text-red-400 cursor-not-allowed opacity-50"
                            : isSelected
                              ? "bg-green-500 text-white shadow-lg shadow-green-500/30 scale-110"
                              : "bg-neutral-700 hover:bg-neutral-600 text-gray-300 hover:scale-105"
                        }`}
                      >
                        {seat}
                      </button>
                    );
                  })}
                </div>
                <span className="w-6 text-gray-500 font-bold text-sm text-right">
                  {row}
                </span>
              </div>
            ))}
          </div>

          {/* Row labels */}
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: seatCols }, (_, i) => (
              <div key={i} className="w-12 text-center text-gray-600 text-sm">
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2">
              <p className="text-lg">
                Ghế đã chọn:
                <span className="font-bold text-green-400 ml-2">
                  {selectedSeat.length > 0
                    ? selectedSeat.join(", ")
                    : "Chưa chọn"}
                </span>
              </p>

              <p className="text-xl">
                Tổng tiền:
                <span className="font-bold text-yellow-400 ml-2">
                  {selectedSeat.length > 0
                    ? `${totalPrice.toLocaleString()} VNĐ`
                    : "0 VNĐ"}
                </span>
              </p>
            </div>

            <button
              onClick={handleBooking}
              disabled={selectedSeat.length === 0}
              className={`px-10 py-4 rounded-xl font-bold text-lg transition-all ${
                selectedSeat.length > 0
                  ? "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                  : "bg-neutral-700 text-gray-500 cursor-not-allowed"
              }`}
            >
              💳 Thanh toán VNPay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
