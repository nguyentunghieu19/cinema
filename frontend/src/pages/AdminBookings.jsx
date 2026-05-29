import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get("/api/bookings/");
      setBookings(res.data);
    } catch (error) {
      console.error("Lỗi khi tải booking:", error);
      alert("Không thể tải danh sách booking.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-600";
      case "pending":
        return "bg-yellow-600";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-gray-600";
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">🎟️ Quản lý đặt vé</h1>
          <span className="text-gray-400 text-sm">{bookings.length} đơn</span>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">🎟️</div>
            <p className="text-gray-400 text-lg">Chưa có booking nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-red-500/50 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold group-hover:text-red-400 transition-colors">
                      Booking #{booking.id}
                    </h2>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(booking.created_at).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                      booking.status,
                    )} text-white`}
                  >
                    {booking.status || "pending"}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                    <span className="text-gray-400 w-20">User ID</span>
                    <span className="font-medium">#{booking.user_id}</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                    <span className="text-gray-400 w-20">Showtime</span>
                    <span className="font-medium">#{booking.showtime_id}</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-lg">
                    <span className="text-gray-400 w-20">Ghế</span>
                    <span className="font-bold text-green-400 text-lg">
                      {booking.seat_number}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBookings;
