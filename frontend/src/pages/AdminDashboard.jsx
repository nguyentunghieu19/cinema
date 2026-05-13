import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_bookings: 0,
    total_revenue: 0,
    movie_stats: [],
  });

  const [bookings, setBookings] = useState([]);

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
        total_bookings: res.data.total_bookings || 0,
        total_revenue: res.data.total_revenue || 0,
        movie_stats: res.data.movie_stats || [],
      });
    } catch (error) {
      console.error("Lỗi tải thống kê:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/bookings");
      setBookings(res.data || []);
    } catch (error) {
      console.error("Lỗi tải danh sách booking:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
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
              onClick={() => navigate("/admin/users")}
              className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded"
            >
              Quản lý nhân viên
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
            <p className="text-3xl font-bold">{stats.total_bookings || 0}</p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl shadow">
            <h3 className="text-gray-400 mb-2">Doanh thu</h3>
            <p className="text-3xl font-bold text-green-400">
              {(stats.total_revenue || 0).toLocaleString("vi-VN")} đ
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl shadow">
            <h3 className="text-gray-400 mb-2">Phim có booking</h3>
            <p className="text-3xl font-bold">
              {stats.movie_stats?.length || 0}
            </p>
          </div>
        </div>

        {/* Bookings */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Danh sách Booking</h2>

          {bookings.length === 0 ? (
            <div className="bg-gray-900 p-6 rounded-xl text-gray-400">
              Chưa có booking nào.
            </div>
          ) : (
            <div className="grid gap-4">
              {bookings.map((booking) => (
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
    </div>
  );
}

export default AdminDashboard;
