import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { motion } from "framer-motion";

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

  const totalTickets = bookings.length;

  const totalRevenue = bookings.reduce((sum, booking) => {
    const showtime = getShowtimeById(booking.showtime_id);
    return sum + (showtime?.price || 0);
  }, 0);

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

  const statCards = [
    {
      label: "Tổng số vé",
      value: totalTickets,
      icon: "🎟️",
      color: "text-blue-400",
    },
    {
      label: "Tổng doanh thu",
      value: `${totalRevenue.toLocaleString("vi-VN")} VNĐ`,
      icon: "💰",
      color: "text-green-400",
    },
    {
      label: "Suất chiếu",
      value: showtimes.length,
      icon: "📅",
      color: "text-purple-400",
    },
    {
      label: "Phim",
      value: movies.length,
      icon: "🎬",
      color: "text-red-400",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">📈 Báo cáo doanh thu</h1>
          <span className="text-gray-400 text-sm">
            {new Date().toLocaleDateString("vi-VN")}
          </span>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-red-500/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{stat.icon}</span>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full bg-neutral-800 ${stat.color}`}
                >
                  STAT
                </span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.label}</h3>
              <p className="text-2xl font-bold group-hover:text-red-400 transition-colors">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Movie Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold mb-6">Số vé đã bán theo phim</h2>

          {Object.keys(movieStats).length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-5xl mb-4">📊</div>
              <p>Chưa có dữ liệu.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(movieStats)
                .sort(([, a], [, b]) => b - a)
                .map(([title, count], index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-xl hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="font-medium">{title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm">vé</span>
                      <span className="text-xl font-bold text-green-400">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default AdminReports;
