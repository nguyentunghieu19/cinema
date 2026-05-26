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

  useEffect(() => {
    fetchMovies();
    fetchShowtimes();
  }, []);

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

  const fetchShowtimes = fetchShowtimesData;

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
      fetchShowtimes();
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
      fetchShowtimes();
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
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Form */}
        <div className="bg-gray-900 p-6 rounded-2xl mb-10">
          <h1 className="text-3xl font-bold mb-6">
            {editingId ? "✏️ Chỉnh sửa lịch chiếu" : "🎬 Thêm lịch chiếu"}
          </h1>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            {/* Movie */}
            <select
              name="movie_id"
              value={form.movie_id}
              onChange={handleChange}
              className="bg-gray-800 p-3 rounded"
              required
            >
              <option value="">-- Chọn phim --</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>

            {/* Start time */}
            <input
              type="datetime-local"
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
              className="bg-gray-800 p-3 rounded"
              required
            />

            {/* Price */}
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="bg-gray-800 p-3 rounded"
              required
            />

            {/* Theater room */}
            <input
              name="theater_room"
              value={form.theater_room}
              onChange={handleChange}
              className="bg-gray-800 p-3 rounded"
              placeholder="Phòng chiếu"
            />

            {/* Available seats */}
            <input
              type="number"
              name="available_seats"
              value={form.available_seats}
              onChange={handleChange}
              className="bg-gray-800 p-3 rounded"
              required
            />

            {/* Buttons */}
            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-semibold"
              >
                {editingId ? "Cập nhật lịch chiếu" : "Thêm lịch chiếu"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Danh sách lịch chiếu */}
        <h2 className="text-3xl font-bold mb-6">📅 Danh sách lịch chiếu</h2>

        {showtimes.length === 0 ? (
          <p className="text-gray-400">Chưa có lịch chiếu nào.</p>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {showtimes.map((showtime) => (
              <div
                key={showtime.id}
                className="bg-gray-900 p-6 rounded-2xl shadow-lg"
              >
                <h3 className="text-2xl font-bold mb-2">
                  {getMovieTitle(showtime.movie_id)}
                </h3>

                <p className="text-gray-300 mb-1">
                  🕒 {new Date(showtime.start_time).toLocaleString("vi-VN")}
                </p>

                <p className="text-gray-300 mb-1">🏢 {showtime.theater_room}</p>

                <p className="text-yellow-400 mb-1">
                  💰 {showtime.price.toLocaleString()} VNĐ
                </p>

                <p className="text-green-400 mb-4">
                  💺 {showtime.available_seats} ghế
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(showtime)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded"
                  >
                    Sửa
                  </button>

                  <button
                    onClick={() => handleDelete(showtime.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded"
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
