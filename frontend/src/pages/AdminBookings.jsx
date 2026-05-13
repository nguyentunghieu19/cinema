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

  if (loading) {
    return (
      <div className="text-white flex items-center justify-center min-h-[300px]">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Quản lý đặt vé</h1>

      {bookings.length === 0 ? (
        <div className="bg-gray-900 p-6 rounded-xl text-gray-400">
          Chưa có booking nào.
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-gray-900 p-6 rounded-xl shadow">
              <h2 className="text-2xl font-semibold mb-4">
                Booking #{booking.id}
              </h2>

              <div className="space-y-2 text-gray-300">
                <p>
                  <span className="font-semibold text-white">User ID:</span>{" "}
                  {booking.user_id}
                </p>

                <p>
                  <span className="font-semibold text-white">Showtime ID:</span>{" "}
                  {booking.showtime_id}
                </p>

                <p>
                  <span className="font-semibold text-white">Ghế:</span>{" "}
                  {booking.seat_number}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default AdminBookings;
