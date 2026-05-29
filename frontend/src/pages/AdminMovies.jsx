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

  const fetchMovies = async () => {
    try {
      const res = await axiosInstance.get("/api/movies/");
      setMovies(res.data || []);
    } catch (error) {
      console.error("Lỗi tải phim:", error);
    }
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "duration" || name === "rating" ? Number(value) : value,
    }));
  };

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
    <div className="min-h-screen bg-neutral-950 text-white px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Form Section */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-10">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            {editingId ? (
              <>
                <span>✏️</span>
                <span>Chỉnh sửa phim</span>
              </>
            ) : (
              <>
                <span>➕</span>
                <span>Thêm phim mới</span>
              </>
            )}
          </h1>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
            {/* Row 1 */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Tên phim *
              </label>
              <input
                name="title"
                placeholder="Nhập tên phim"
                value={form.title}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Thể loại
              </label>
              <input
                name="genre"
                placeholder="Hành động, Hài,..."
                value={form.genre}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Row 2 */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Thời lượng (phút)
              </label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Đánh giá (0-10)
              </label>
              <input
                type="number"
                step="0.1"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Full width */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">
                Trailer URL
              </label>
              <input
                name="trailer_url"
                placeholder="https://youtube.com/..."
                value={form.trailer_url}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">
                Mô tả phim
              </label>
              <textarea
                name="description"
                placeholder="Nội dung phim..."
                value={form.description}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                rows="4"
              />
            </div>

            {/* Upload Poster */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Poster</label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 px-4 py-3 rounded-xl transition-colors">
                  <span className="text-sm">📁 Chọn ảnh</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadPoster}
                    className="hidden"
                  />
                </label>

                {uploading && (
                  <span className="text-yellow-400 text-sm">
                    Đang upload...
                  </span>
                )}
              </div>
            </div>

            {/* Poster URL Input */}
            <div className="md:col-span-2">
              <input
                name="poster_url"
                placeholder="Hoặc nhập poster URL trực tiếp"
                value={form.poster_url}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Preview */}
            {form.poster_url && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-400 mb-2">Preview:</p>
                <img
                  src={form.poster_url}
                  alt="Poster Preview"
                  className="w-32 h-48 object-cover rounded-lg border border-neutral-700"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                {editingId ? "💾 Cập nhật" : "➕ Thêm phim"}
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

        {/* Movie List */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">🎬 Danh sách phim</h2>
          <span className="text-gray-400 text-sm">{movies.length} phim</span>
        </div>

        {movies.length === 0 ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center">
            <p className="text-gray-400">Chưa có phim nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all group"
              >
                <div className="relative">
                  <img
                    src={
                      movie.poster_url ||
                      "https://via.placeholder.com/400x600?text=No+Poster"
                    }
                    alt={movie.title}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    ID: {movie.id}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1 truncate">
                    {movie.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-1">
                    {movie.genre || "Chưa cập nhật"}
                  </p>
                  <p className="text-yellow-400 text-sm font-medium mb-4">
                    ⭐ {movie.rating || "N/A"}/10
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(movie)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-medium transition-colors"
                    >
                      Sửa
                    </button>

                    <button
                      onClick={() => handleDelete(movie.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-medium transition-colors"
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
