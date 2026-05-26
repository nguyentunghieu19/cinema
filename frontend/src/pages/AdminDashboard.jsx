// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

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

      console.log("Stats response:", res.data);

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
      alert(
        error.response?.data?.detail || "Không thể tải thống kê dashboard.",
      );
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/bookings");
      console.log("Bookings response:", res.data);
      setBookings(res.data || []);
    } catch (error) {
      console.error("Lỗi tải danh sách booking:", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  if (loadingStats) {
    return (
      <div className="text-white flex items-center justify-center min-h-[300px]">
        Đang tải dashboard...
      </div>
    );
  }

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/admin/movies")}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded"
          >
            Quản lý phim
          </button>

          <button
            onClick={() => navigate("/admin/showtimes")}
            className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded"
          >
            Quản lý lịch chiếu
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded"
          >
            Quản lý người dùng
          </button>

          <button
            onClick={() => navigate("/admin/reports")}
            className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded"
          >
            Báo cáo
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <div className="bg-gray-900 p-6 rounded-xl shadow">
          <h3 className="text-gray-400 mb-2">Tổng vé bán</h3>
          <p className="text-3xl font-bold">{stats.total_bookings}</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow">
          <h3 className="text-gray-400 mb-2">Doanh thu</h3>
          <p className="text-3xl font-bold text-green-400">
            {Number(stats.total_revenue).toLocaleString("vi-VN")} đ
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow">
          <h3 className="text-gray-400 mb-2">Phim có booking</h3>
          <p className="text-3xl font-bold">{stats.movie_stats.length}</p>
        </div>
      </div>

      {/* Extra Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <div className="bg-gray-900 p-6 rounded-xl shadow">
          <h3 className="text-gray-400 mb-2">Tổng số phim</h3>
          <p className="text-3xl font-bold">{stats.total_movies}</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow">
          <h3 className="text-gray-400 mb-2">Tổng lịch chiếu</h3>
          <p className="text-3xl font-bold">{stats.total_showtimes}</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow">
          <h3 className="text-gray-400 mb-2">Tổng người dùng</h3>
          <p className="text-3xl font-bold">{stats.total_users}</p>
        </div>
      </div>

      {/* Bookings */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Danh sách Booking gần đây</h2>

        {loadingBookings ? (
          <div className="bg-gray-900 p-6 rounded-xl text-gray-400">
            Đang tải dữ liệu...
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-gray-900 p-6 rounded-xl text-gray-400">
            Chưa có booking nào.
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.slice(0, 10).map((booking) => (
              <div
                key={booking.id}
                className="bg-gray-900 p-4 rounded-xl border border-gray-800"
              >
                <p>
                  <strong>Booking ID:</strong> {booking.id}
                </p>
                <p>
                  <strong>User ID:</strong> {booking.user_id}
                </p>
                <p>
                  <strong>Showtime ID:</strong> {booking.showtime_id}
                </p>
                <p>
                  <strong>Ghế:</strong> {booking.seat_number}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
