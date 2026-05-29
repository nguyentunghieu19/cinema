import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const API_URL = "http://127.0.0.1:8000/api";

function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovie();
    fetchShowtimes();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const res = await axios.get(`${API_URL}/movies/${id}`);
      setMovie(res.data);
    } catch (err) {
      console.error("Lỗi lấy phim:", err);
    }
  };

  const fetchShowtimes = async () => {
    try {
      const res = await axios.get(`${API_URL}/showtimes/movie/${id}`);
      setShowtimes(res.data);
    } catch (err) {
      console.error("Lỗi lấy suất chiếu:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <p className="text-gray-400">Không tìm thấy phim.</p>
      </div>
    );
  }

  // Sort showtimes by date
  const sortedShowtimes = [...showtimes].sort(
    (a, b) => new Date(a.start_time) - new Date(b.start_time),
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-8 lg:gap-12"
        >
          {/* Poster */}
          <div className="relative">
            <img
              src={
                movie.poster_url ||
                "https://via.placeholder.com/400x600?text=No+Poster"
              }
              alt={movie.title}
              className="w-full rounded-2xl shadow-2xl shadow-black"
            />
            {/* Rating Badge */}
            <div className="absolute top-4 right-4 bg-yellow-500 text-black font-bold px-4 py-2 rounded-full flex items-center gap-1">
              <span>⭐</span>
              <span>{movie.rating || "N/A"}</span>
            </div>
          </div>

          {/* Info */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                {movie.title}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre && (
                  <span className="bg-neutral-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                    {movie.genre}
                  </span>
                )}
                <span className="bg-neutral-800 text-gray-300 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <span>⏱</span>
                  <span>{movie.duration} phút</span>
                </span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2 text-gray-400">
                  Nội dung
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {movie.description || "Chưa có mô tả."}
                </p>
              </div>

              {/* Trailer */}
              {movie.trailer_url && (
                <div className="mb-8">
                  <a
                    href={movie.trailer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <span>▶</span>
                    <span>Xem Trailer</span>
                  </a>
                </div>
              )}

              {/* Showtimes */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span>📅</span>
                  <span>Suất chiếu</span>
                </h2>

                {sortedShowtimes.length === 0 ? (
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center">
                    <p className="text-gray-400">Chưa có suất chiếu</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {sortedShowtimes.map((showtime) => (
                      <button
                        key={showtime.id}
                        onClick={() => navigate(`/booking/${showtime.id}`)}
                        className="bg-neutral-900 border border-neutral-800 hover:border-red-500 hover:bg-red-600 p-4 rounded-xl transition-all group"
                      >
                        <div className="text-sm text-gray-400 group-hover:text-white mb-1">
                          {new Date(showtime.start_time).toLocaleDateString(
                            "vi-VN",
                          )}
                        </div>
                        <div className="font-semibold">
                          {new Date(showtime.start_time).toLocaleTimeString(
                            "vi-VN",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </div>
                        <div className="text-xs text-green-400 mt-1">
                          {showtime.price.toLocaleString()} VNĐ
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default MoviePage;
