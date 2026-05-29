import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { motion } from "framer-motion";

const API_URL = "http://127.0.0.1:8000/api";

function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTickets();
  }, []);

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

      setTickets(enrichedTickets);
    } catch (err) {
      console.error(err);
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">🎟️ Vé của tôi</h1>
          <span className="text-gray-400 text-sm">{tickets.length} vé</span>
        </div>

        {tickets.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🎟️</div>
            <p className="text-gray-400 text-lg">Bạn chưa đặt vé nào.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {tickets.map((ticket, index) => {
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
                  transition={{ delay: index * 0.1 }}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col lg:flex-row hover:border-red-500/50 transition-all"
                >
                  {/* Poster */}
                  <div className="lg:w-64 h-64 lg:h-auto relative">
                    <img
                      src={
                        ticket.movie.poster_url ||
                        "https://via.placeholder.com/300x400?text=No+Poster"
                      }
                      alt={ticket.movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      #{ticket.id}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-6">
                    <h2 className="text-2xl font-bold mb-2 text-red-500 truncate">
                      {ticket.movie.title}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-xl">
                        <span className="text-xl">🕒</span>
                        <div>
                          <p className="text-gray-400 text-xs">Suất chiếu</p>
                          <p className="font-medium">
                            {new Date(
                              ticket.showtime.start_time,
                            ).toLocaleString("vi-VN")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-xl">
                        <span className="text-xl">🏢</span>
                        <div>
                          <p className="text-gray-400 text-xs">Phòng</p>
                          <p className="font-medium">
                            {ticket.showtime.theater_room}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-xl">
                        <span className="text-xl">💺</span>
                        <div>
                          <p className="text-gray-400 text-xs">Ghế</p>
                          <p className="font-bold text-green-400 text-lg">
                            {ticket.seat_number}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-xl">
                        <span className="text-xl">💰</span>
                        <div>
                          <p className="text-gray-400 text-xs">Giá vé</p>
                          <p className="font-medium text-yellow-400">
                            {ticket.showtime.price.toLocaleString()} VNĐ
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Note */}
                    <div className="mt-6 pt-4 border-t border-neutral-800">
                      <p className="text-sm text-gray-500">
                        📌 Vui lòng đến trước giờ chiếu 15 phút để check-in.
                      </p>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="bg-white p-6 flex flex-col items-center justify-center lg:w-48">
                    <QRCodeCanvas value={qrValue} size={140} />
                    <p className="text-black text-xs mt-3 font-bold">
                      QUÉT MÃ CHECK-IN
                    </p>
                  </div>
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
