import { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../api/axios";

const API_URL = "http://127.0.0.1:8000";

function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    genre: "",
    duration: 120,
    rating: 0,
    poster_url: "",
    trailer_url: "",
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  // =========================
  // Lấy danh sách phim
  // =========================
  const fetchMovies = async () => {
    try {
      const res = await axiosInstance.get("/api/movies/");
      setMovies(res.data || []);
    } catch (error) {
      console.error("Lỗi tải phim:", error);
    }
  };

  // =========================
  // Upload poster
  // =========================
  const handleUploadPoster = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);

      const res = await axios.post(`${API_URL}/api/upload/poster`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setForm((prev) => ({
        ...prev,
        poster_url: res.data.url,
      }));
    } catch (error) {
      console.error("Upload ảnh thất bại:", error);
      alert("Upload ảnh thất bại!");
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // Thay đổi form
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "duration" || name === "rating" ? Number(value) : value,
    }));
  };

  // =========================
  // Submit thêm/sửa
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axiosInstance.put(`/api/movies/${editingId}`, form);
        alert("Cập nhật phim thành công!");
      } else {
        await axiosInstance.post("/api/movies/", form);
        alert("Thêm phim thành công!");
      }

      resetForm();
      fetchMovies();
    } catch (error) {
      console.error("Lỗi lưu phim:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  // =========================
  // Sửa phim
  // =========================
  const handleEdit = (movie) => {
    setEditingId(movie.id);
    setForm({
      title: movie.title || "",
      description: movie.description || "",
      genre: movie.genre || "",
      duration: movie.duration || 120,
      rating: movie.rating || 0,
      poster_url: movie.poster_url || "",
      trailer_url: movie.trailer_url || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // Xóa phim
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa phim này?")) {
      return;
    }

    try {
      await axiosInstance.delete(`/api/movies/${id}`);
      alert("Xóa phim thành công!");
      fetchMovies();
    } catch (error) {
      console.error("Lỗi xóa phim:", error);
      alert("Không thể xóa phim!");
    }
  };

  // =========================
  // Reset form
  // =========================
  const resetForm = () => {
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      genre: "",
      duration: 120,
      rating: 0,
      poster_url: "",
      trailer_url: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Form */}
        <div className="bg-gray-900 p-6 rounded-2xl mb-10">
          <h1 className="text-3xl font-bold mb-6">
            {editingId ? "✏️ Chỉnh sửa phim" : "➕ Thêm phim mới"}
          </h1>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <input
              name="title"
              placeholder="Tên phim"
              value={form.title}
              onChange={handleChange}
              className="bg-gray-800 p-3 rounded"
              required
            />

            <input
              name="genre"
              placeholder="Thể loại"
              value={form.genre}
              onChange={handleChange}
              className="bg-gray-800 p-3 rounded"
            />

            <input
              type="number"
              name="duration"
              placeholder="Thời lượng (phút)"
              value={form.duration}
              onChange={handleChange}
              className="bg-gray-800 p-3 rounded"
            />

            <input
              type="number"
              step="0.1"
              name="rating"
              placeholder="Đánh giá"
              value={form.rating}
              onChange={handleChange}
              className="bg-gray-800 p-3 rounded"
            />

            <input
              name="trailer_url"
              placeholder="Trailer URL"
              value={form.trailer_url}
              onChange={handleChange}
              className="bg-gray-800 p-3 rounded md:col-span-2"
            />

            <textarea
              name="description"
              placeholder="Mô tả phim"
              value={form.description}
              onChange={handleChange}
              className="bg-gray-800 p-3 rounded md:col-span-2"
              rows="4"
            />

            {/* Upload Poster */}
            <div className="md:col-span-2">
              <label className="block mb-2 font-semibold">Upload Poster</label>

              <input
                type="file"
                accept="image/*"
                onChange={handleUploadPoster}
                className="w-full bg-gray-800 p-3 rounded"
              />

              {uploading && (
                <p className="text-yellow-400 mt-2">Đang upload ảnh...</p>
              )}
            </div>

            {/* Poster URL */}
            <input
              name="poster_url"
              placeholder="Poster URL"
              value={form.poster_url}
              onChange={handleChange}
              className="bg-gray-800 p-3 rounded md:col-span-2"
            />

            {/* Preview */}
            {form.poster_url && (
              <div className="md:col-span-2">
                <img
                  src={form.poster_url}
                  alt="Poster Preview"
                  className="w-48 rounded-lg shadow-lg mt-2"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-semibold"
              >
                {editingId ? "Cập nhật phim" : "Thêm phim"}
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

        {/* Danh sách phim */}
        <h2 className="text-3xl font-bold mb-6">🎬 Danh sách phim</h2>

        {movies.length === 0 ? (
          <p className="text-gray-400">Chưa có phim nào.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg"
              >
                <img
                  src={
                    movie.poster_url ||
                    "https://via.placeholder.com/400x600?text=No+Poster"
                  }
                  alt={movie.title}
                  className="w-full h-96 object-cover"
                />

                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{movie.title}</h3>

                  <p className="text-gray-400 mb-2">{movie.genre}</p>

                  <p className="text-yellow-400 mb-4">
                    ⭐ {movie.rating || "N/A"}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(movie)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded"
                    >
                      Sửa
                    </button>

                    <button
                      onClick={() => handleDelete(movie.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded"
                    >
                      Xóa
                    </button>
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

export default AdminMovies;
