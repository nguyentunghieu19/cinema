import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // ĐOẠN ĐÃ THAY ĐỔI: Thêm comment vô hiệu hóa cảnh báo dependency của ESLint
  useEffect(() => {
    fetchMyTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hàm bổ trợ ép chuỗi thời gian trần về đúng chuẩn UTC để định dạng không bị lệch 7 tiếng
  const formatToUTCDate = (dateStr) => {
    if (!dateStr) return 0;
    // Nếu chuỗi chưa có ký tự múi giờ Z hoặc dấu +, tự động format thành ISO và thêm Z ở cuối
    return dateStr.endsWith("Z") || dateStr.includes("+")
      ? dateStr
      : `${dateStr.replace(" ", "T")}Z`;
  };

  const fetchMyTickets = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const bookingRes = await axios.get(`${API_URL}/bookings/`);

      const myBookings = bookingRes.data.filter(
        (booking) => booking.user_id === user.id,
      );

      const enrichedTickets = await Promise.all(
        myBookings.map(async (booking) => {
          const showtimeRes = await axios.get(
            `${API_URL}/showtimes/${booking.showtime_id}`,
          );
          const showtime = showtimeRes.data;

          const movieRes = await axios.get(
            `${API_URL}/movies/${showtime.movie_id}`,
          );
          const movie = movieRes.data;

          return {
            ...booking,
            showtime,
            movie,
          };
        }),
      );

      // Sắp xếp: Vé mới đặt nhất (timestamp lớn nhất) lên đầu danh sách
      enrichedTickets.sort((a, b) => {
        const timeA = new Date(formatToUTCDate(a.created_at)).getTime();
        const timeB = new Date(formatToUTCDate(b.created_at)).getTime();
        return timeB - timeA;
      });

      setTickets(enrichedTickets);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách vé:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-red-500">🎟️ Vé của tôi</h1>
          <span className="bg-neutral-900 px-4 py-2 rounded-xl border border-neutral-800 text-gray-300">
            {tickets.length} vé
          </span>
        </div>

        {tickets.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🎟️</div>
            <p className="text-gray-400 text-lg">Bạn chưa đặt vé nào.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket, index) => {
              // Xử lý múi giờ đồng bộ cho cả Suất chiếu lẫn Thời gian đặt
              const startTime = new Date(
                formatToUTCDate(ticket.showtime.start_time),
              );
              const isExpired = startTime < new Date();

              const qrValue = JSON.stringify({
                booking_id: ticket.id,
                movie: ticket.movie.title,
                seat: ticket.seat_number,
                room: ticket.showtime.theater_room,
                start_time: ticket.showtime.start_time,
              });

              return (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col lg:flex-row hover:border-red-500/50 transition-all"
                >
                  {/* Poster */}
                  <div className="lg:w-64 h-64 lg:h-auto relative">
                    <img
                      src={
                        ticket.movie.poster_url ||
                        "https://via.placeholder.com/300x400"
                      }
                      alt={ticket.movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-red-600 px-3 py-1 rounded-full text-xs font-bold">
                      #{ticket.id}
                    </div>
                    <div
                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                        isExpired
                          ? "bg-gray-700 text-white"
                          : "bg-green-600 text-white"
                      }`}
                    >
                      {isExpired ? "Đã chiếu" : "Sắp chiếu"}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-6">
                    <h2 className="text-2xl font-bold mb-4 text-red-500">
                      {ticket.movie.title}
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-neutral-800/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400">🕒 Suất chiếu</p>
                        <p>
                          {startTime.toLocaleString("vi-VN", {
                            timeZone: "Asia/Ho_Chi_Minh",
                          })}
                        </p>
                      </div>

                      <div className="bg-neutral-800/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400">🏢 Phòng chiếu</p>
                        <p>{ticket.showtime.theater_room}</p>
                      </div>

                      <div className="bg-neutral-800/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400">💺 Ghế</p>
                        <p className="font-bold text-green-400 text-lg">
                          {ticket.seat_number}
                        </p>
                      </div>

                      <div className="bg-neutral-800/50 rounded-xl p-3">
                        <p className="text-xs text-gray-400">💰 Giá vé</p>
                        <p className="text-yellow-400 font-semibold">
                          {ticket.showtime.price.toLocaleString()} VNĐ
                        </p>
                      </div>

                      <div className="bg-neutral-800/50 rounded-xl p-3 sm:col-span-2">
                        <p className="text-xs text-gray-400">
                          📅 Thời gian đặt
                        </p>
                        <p>
                          {ticket.created_at
                            ? new Date(
                                formatToUTCDate(ticket.created_at),
                              ).toLocaleString("vi-VN", {
                                timeZone: "Asia/Ho_Chi_Minh",
                              })
                            : "Dữ liệu cũ"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-neutral-800 pt-4">
                      <p className="text-sm text-gray-500">
                        📌 Vui lòng đến trước giờ chiếu 15 phút để check-in.
                      </p>
                    </div>
                  </div>

                  {/* QR */}
                  {!isExpired && (
                    <div className="bg-white p-6 flex flex-col items-center justify-center lg:w-52">
                      <QRCodeCanvas value={qrValue} size={140} />
                      <p className="text-black font-bold text-xs mt-3 text-center">
                        QUÉT MÃ CHECK-IN
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTicketsPage;
