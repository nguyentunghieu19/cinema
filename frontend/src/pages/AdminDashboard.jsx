import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { motion } from "framer-motion";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_movies: 0,
    total_showtimes: 0,
    total_users: 0,
    total_bookings: 0,
    total_revenue: 0,
    movie_stats: [],
  });

  const [bookings, setBookings] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    fetchStats();
    fetchBookings();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/stats");
      setStats({
        total_movies: res.data.total_movies ?? 0,
        total_showtimes: res.data.total_showtimes ?? 0,
        total_users: res.data.total_users ?? 0,
        total_bookings: res.data.total_bookings ?? 0,
        total_revenue: res.data.total_revenue ?? 0,
        movie_stats: res.data.movie_stats ?? [],
      });
    } catch (error) {
      console.error("Lỗi tải thống kê:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/bookings");
      setBookings(res.data || []);
    } catch (error) {
      console.error("Lỗi tải danh sách booking:", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  if (loadingStats) {
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
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-wrap gap-4 justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Tổng quan hệ thống</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin/movies")}
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl font-medium transition-colors"
            >
              🎬 Quản lý phim
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin/showtimes")}
              className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl font-medium transition-colors"
            >
              📅 Quản lý lịch chiếu
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin/users")}
              className="bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-xl font-medium transition-colors"
            >
              👥 Quản lý người dùng
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/admin/reports")}
              className="bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-xl font-medium transition-colors"
            >
              📈 Báo cáo
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[
            {
              label: "Tổng vé bán",
              value: stats.total_bookings,
              icon: "🎟️",
              color: "text-blue-400",
            },
            {
              label: "Doanh thu",
              value: Number(stats.total_revenue).toLocaleString("vi-VN") + " đ",
              icon: "💰",
              color: "text-green-400",
            },
            {
              label: "Phim có booking",
              value: stats.movie_stats.length,
              icon: "🎬",
              color: "text-red-400",
            },
            {
              label: "Tổng số phim",
              value: stats.total_movies,
              icon: "📽️",
              color: "text-purple-400",
            },
            {
              label: "Tổng lịch chiếu",
              value: stats.total_showtimes,
              icon: "📅",
              color: "text-yellow-400",
            },
            {
              label: "Tổng người dùng",
              value: stats.total_users,
              icon: "👥",
              color: "text-cyan-400",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 hover:border-red-500/50 hover:bg-neutral-800/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{stat.icon}</span>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full bg-neutral-800 ${stat.color}`}
                >
                  LIVE
                </span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold group-hover:text-red-400 transition-colors">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-4">Danh sách Booking gần đây</h2>

          {loadingBookings ? (
            <div className="bg-neutral-900 p-6 rounded-xl text-gray-400 text-center">
              Đang tải dữ liệu...
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-neutral-900 p-6 rounded-xl text-gray-400 text-center">
              Chưa có booking nào.
            </div>
          ) : (
            <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-800 text-gray-400">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium">
                        User ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium">
                        Showtime ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium">
                        Ghế
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {bookings.slice(0, 10).map((booking, index) => (
                      <motion.tr
                        key={booking.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-neutral-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium">#{booking.id}</td>
                        <td className="px-6 py-4 text-gray-400">
                          {booking.user_id}
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {booking.showtime_id}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                            {booking.seat_number}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default AdminDashboard;
