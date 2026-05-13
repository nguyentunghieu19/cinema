import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { deleteBooking } from "../api/bookingApi";
const API_URL = "http://127.0.0.1:8000/api";

function MyTicketsPage() {
  const handleCancelTicket = async (bookingId) => {
    const confirmCancel = window.confirm("Bạn có chắc chắn muốn hủy vé này?");

    if (!confirmCancel) return;

    try {
      await deleteBooking(bookingId);
      alert("Hủy vé thành công");
      fetchMyTickets();
    } catch (error) {
      console.error(error);
      alert("Hủy vé thất bại");
    }
  };
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const fetchMyTickets = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

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
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Vé của tôi</h1>

        {tickets.length === 0 ? (
          <p className="text-gray-400">Bạn chưa đặt vé nào.</p>
        ) : (
          <div className="grid gap-6">
            {tickets.map((ticket) => {
              const qrValue = JSON.stringify({
                booking_id: ticket.id,
                movie: ticket.movie.title,
                seat: ticket.seat_number,
                room: ticket.showtime.theater_room,
                start_time: ticket.showtime.start_time,
              });

              return (
                <div
                  key={ticket.id}
                  className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-800 flex flex-col md:flex-row"
                >
                  <img
                    src={
                      ticket.movie.poster_url ||
                      "https://via.placeholder.com/300x400?text=No+Poster"
                    }
                    alt={ticket.movie.title}
                    className="w-full md:w-56 h-80 object-cover"
                  />

                  <div className="flex-1 p-6">
                    <h2 className="text-3xl font-bold mb-4 text-red-500">
                      {ticket.movie.title}
                    </h2>

                    <div className="space-y-2 text-gray-300">
                      <p>🎫 Mã vé: #{ticket.id}</p>
                      <p>
                        🕒 Suất chiếu:{" "}
                        {new Date(ticket.showtime.start_time).toLocaleString(
                          "vi-VN",
                        )}
                      </p>
                      <p>🏢 Phòng: {ticket.showtime.theater_room}</p>
                      <p>💺 Ghế: {ticket.seat_number}</p>
                      <p>
                        💰 Giá vé: {ticket.showtime.price.toLocaleString()} VNĐ
                      </p>
                    </div>

                    <div className="mt-6 border-t border-dashed border-gray-700 pt-4">
                      <p className="text-sm text-gray-500">
                        Vui lòng đến trước giờ chiếu 15 phút.
                      </p>
                      <button
                        onClick={() => handleCancelTicket(ticket.id)}
                        className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                      >
                        Hủy vé
                      </button>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="bg-white p-6 flex flex-col items-center justify-center">
                    <QRCodeCanvas value={qrValue} size={160} />
                    <p className="text-black text-sm mt-3 font-medium">
                      Quét mã để check-in
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTicketsPage;
