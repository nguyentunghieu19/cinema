import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);

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
    }
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Đang tải thông tin phim...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        <img
          src={
            movie.poster_url ||
            "https://via.placeholder.com/400x600?text=No+Poster"
          }
          alt={movie.title}
          className="w-full rounded-xl shadow-lg"
        />

        <div>
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

          <p className="text-gray-300 mb-4">{movie.description}</p>

          <p className="mb-2">⏱ Thời lượng: {movie.duration} phút</p>
          <p className="mb-6">⭐ Rating: {movie.rating || "N/A"}</p>

          <h2 className="text-2xl font-semibold mb-4">Suất chiếu</h2>

          {showtimes.length === 0 ? (
            <p className="text-gray-400">Chưa có suất chiếu</p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {showtimes.map((showtime) => (
                <button
                  key={showtime.id}
                  onClick={() => navigate(`/booking/${showtime.id}`)}
                  className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg font-semibold transition"
                >
                  {new Date(showtime.start_time).toLocaleString("vi-VN")}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MoviePage;
