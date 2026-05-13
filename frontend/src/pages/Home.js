import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";

function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await axiosInstance.get("/api/movies/");
      setMovies(res.data || []);
    } catch (error) {
      console.error("Lỗi tải danh sách phim:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Hero Banner */}
        <div
          className="relative rounded-3xl overflow-hidden mb-12 h-[450px] flex items-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/70"></div>

          {/* Content */}
          <div className="relative z-10 max-w-3xl px-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Đặt vé xem phim
              <span className="text-red-500"> nhanh chóng</span>
              <br />
              và tiện lợi
            </h1>

            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Khám phá những bộ phim bom tấn mới nhất, chọn ghế yêu thích và đặt
              vé online chỉ trong vài giây.
            </p>

            <a
              href="#movies"
              className="inline-block bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl text-lg font-semibold transition"
            >
              🎬 Xem phim ngay
            </a>
          </div>
        </div>

        {/* Section Title */}
        <div id="movies" className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">🎥 Phim đang chiếu</h2>
          <span className="text-gray-400">{movies.length} bộ phim</span>
        </div>

        {/* Movie Grid */}
        {movies.length === 0 ? (
          <p className="text-gray-400">Chưa có phim nào.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-800 hover:scale-105 transition duration-300"
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
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">
                    {movie.title}
                  </h3>

                  <p className="text-sm text-gray-400 mb-2">
                    {movie.genre || "Chưa cập nhật"}
                  </p>

                  <p className="text-yellow-400 mb-4">
                    ⭐ {movie.rating || "N/A"}
                  </p>

                  <Link
                    to={`/movie/${movie.id}`}
                    className="block text-center bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
