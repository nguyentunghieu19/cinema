import { useEffect, useState } from "react";
import {
  getShowtimes,
  createShowtime,
  updateShowtime,
  deleteShowtime,
} from "../api/showtimeApi";
import axiosInstance from "../api/axios";

function AdminShowtimes() {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    movie_id: "",
    start_time: "",
    price: 90000,
    theater_room: "Phòng 1",
    available_seats: 100,
  });

  // ĐÃ SỬA: Đưa logic fetch trực tiếp vào trong để mảng [] trống không bị báo lỗi ESLint
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axiosInstance.get("/api/movies/");
        setMovies(res.data || []);
      } catch (error) {
        console.error("Lỗi tải danh sách phim:", error);
      }
    };

    const fetchShowtimesData = async () => {
      try {
        const data = await getShowtimes();
        setShowtimes(data || []);
      } catch (error) {
        console.error("Lỗi tải lịch chiếu:", error);
      }
    };

    fetchMovies();
    fetchShowtimesData();
  }, []);

  // Hàm reload danh sách sau khi Thêm/Sửa/Xóa độc lập với useEffect
  const refreshShowtimes = async () => {
    try {
      const data = await getShowtimes();
      setShowtimes(data || []);
    } catch (error) {
      console.error("Lỗi tải lịch chiếu:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: ["movie_id", "available_seats"].includes(name)
        ? Number(value)
        : name === "price"
          ? parseFloat(value)
          : value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      movie_id: "",
      start_time: "",
      price: 90000,
      theater_room: "Phòng 1",
      available_seats: 100,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        start_time: new Date(form.start_time).toISOString(),
      };

      if (editingId) {
        await updateShowtime(editingId, payload);
        alert("Cập nhật lịch chiếu thành công!");
      } else {
        await createShowtime(payload);
        alert("Thêm lịch chiếu thành công!");
      }

      resetForm();
      refreshShowtimes();
    } catch (error) {
      console.error("Lỗi lưu lịch chiếu:", error);
      alert(error.response?.data?.detail || "Có lỗi xảy ra!");
    }
  };

  const handleEdit = (showtime) => {
    setEditingId(showtime.id);

    setForm({
      movie_id: showtime.movie_id,
      start_time: new Date(showtime.start_time).toISOString().slice(0, 16),
      price: showtime.price,
      theater_room: showtime.theater_room || "Phòng 1",
      available_seats: showtime.available_seats,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa lịch chiếu này?")) {
      return;
    }

    try {
      await deleteShowtime(id);
      alert("Xóa lịch chiếu thành công!");
      refreshShowtimes();
    } catch (error) {
      console.error("Lỗi xóa lịch chiếu:", error);
      alert(error.response?.data?.detail || "Không thể xóa lịch chiếu!");
    }
  };

  const getMovieTitle = (movieId) => {
    const movie = movies.find((m) => m.id === movieId);
    return movie ? movie.title : `Phim #${movieId}`;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Form Section */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-10">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            {editingId ? (
              <>
                <span>✏️</span>
                <span>Chỉnh sửa lịch chiếu</span>
              </>
            ) : (
              <>
                <span>🎬</span>
                <span>Thêm lịch chiếu mới</span>
              </>
            )}
          </h1>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
            {/* Movie */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Chọn phim *
              </label>
              <select
                name="movie_id"
                value={form.movie_id}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                required
              >
                <option value="">-- Chọn phim --</option>
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Start time */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Thời gian chiếu *
              </label>
              <input
                type="datetime-local"
                name="start_time"
                value={form.start_time}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Giá vé (VNĐ)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Theater room */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Phòng chiếu
              </label>
              <input
                name="theater_room"
                value={form.theater_room}
                onChange={handleChange}
                placeholder="Phòng 1, Phòng 2..."
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Available seats */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Số ghế trống
              </label>
              <input
                type="number"
                name="available_seats"
                value={form.available_seats}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Empty space for alignment */}
            <div></div>

            {/* Buttons */}
            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                {editingId ? "💾 Cập nhật" : "➕ Thêm lịch chiếu"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-neutral-700 hover:bg-neutral-600 px-6 py-3 rounded-xl transition-colors"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Showtime List */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">📅 Danh sách lịch chiếu</h2>
          <span className="text-gray-400 text-sm">
            {showtimes.length} suất chiếu
          </span>
        </div>

        {showtimes.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center">
            <p className="text-gray-400">Chưa có lịch chiếu nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {showtimes.map((showtime) => (
              <div
                key={showtime.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-red-500/50 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-red-400 transition-colors">
                      {getMovieTitle(showtime.movie_id)}
                    </h3>
                    <span className="text-xs bg-neutral-700 text-gray-300 px-2 py-1 rounded">
                      ID: {showtime.id}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-300 flex items-center gap-2">
                    <span>🕒</span>
                    <span>
                      {new Date(showtime.start_time).toLocaleString("vi-VN")}
                    </span>
                  </p>

                  <p className="text-gray-300 flex items-center gap-2">
                    <span>🏢</span>
                    <span>{showtime.theater_room}</span>
                  </p>

                  <p className="text-yellow-400 flex items-center gap-2">
                    <span>💰</span>
                    <span>{showtime.price.toLocaleString()} VNĐ</span>
                  </p>

                  <p className="text-green-400 flex items-center gap-2">
                    <span>💺</span>
                    <span>{showtime.available_seats} ghế trống</span>
                  </p>
                </div>

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => handleEdit(showtime)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-2.5 rounded-xl font-medium transition-colors"
                  >
                    Sửa
                  </button>

                  <button
                    onClick={() => handleDelete(showtime.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 py-2.5 rounded-xl font-medium transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminShowtimes;
