import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

function AdminReports() {
  const [bookings, setBookings] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingRes, showtimeRes, movieRes] = await Promise.all([
        axiosInstance.get("/api/bookings/"),
        axiosInstance.get("/api/showtimes/"),
        axiosInstance.get("/api/movies/"),
      ]);

      setBookings(bookingRes.data);
      setShowtimes(showtimeRes.data);
      setMovies(movieRes.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu báo cáo:", error);
      alert("Không thể tải báo cáo.");
    } finally {
      setLoading(false);
    }
  };

  const getShowtimeById = (id) =>
    showtimes.find((showtime) => showtime.id === id);

  const getMovieById = (id) => movies.find((movie) => movie.id === id);

  // Tổng số vé
  const totalTickets = bookings.length;

  // Tổng doanh thu
  const totalRevenue = bookings.reduce((sum, booking) => {
    const showtime = getShowtimeById(booking.showtime_id);
    return sum + (showtime?.price || 0);
  }, 0);

  // Thống kê số vé theo phim
  const movieStats = {};

  bookings.forEach((booking) => {
    const showtime = getShowtimeById(booking.showtime_id);
    if (!showtime) return;

    const movie = getMovieById(showtime.movie_id);
    if (!movie) return;

    if (!movieStats[movie.title]) {
      movieStats[movie.title] = 0;
    }

    movieStats[movie.title] += 1;
  });

  if (loading) {
    return (
      <div className="text-white flex items-center justify-center min-h-[300px]">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Báo cáo doanh thu</h1>

      {/* Tổng quan */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-xl text-gray-400 mb-2">Tổng số vé</h2>
          <p className="text-4xl font-bold">{totalTickets}</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl">
          <h2 className="text-xl text-gray-400 mb-2">Tổng doanh thu</h2>
          <p className="text-4xl font-bold text-green-400">
            {totalRevenue.toLocaleString("vi-VN")} VNĐ
          </p>
        </div>
      </div>

      {/* Thống kê theo phim */}
      <div className="bg-gray-900 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-6">Số vé đã bán theo phim</h2>

        {Object.keys(movieStats).length === 0 ? (
          <p className="text-gray-400">Chưa có dữ liệu.</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(movieStats).map(([title, count]) => (
              <div
                key={title}
                className="flex justify-between border-b border-gray-800 pb-2"
              >
                <span>{title}</span>
                <span className="font-bold">{count} vé</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReports;
