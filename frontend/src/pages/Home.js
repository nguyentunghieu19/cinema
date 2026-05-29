import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import { motion } from "framer-motion";

// --- Component: Skeleton Loader ---
const MovieCardSkeleton = () => (
  <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-700 animate-pulse">
    <div className="w-full h-[380px] bg-gray-700" />
    <div className="p-4 space-y-3">
      <div className="h-6 bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
      <div className="h-4 bg-gray-700 rounded w-1/4"></div>
    </div>
  </div>
);

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/movies/");
      setMovies(res.data || []);
    } catch (error) {
      console.error("Lỗi tải danh sách phim:", error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-red-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* --- HERO SECTION --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative rounded-3xl overflow-hidden mb-14 h-[500px] md:h-[550px] flex items-center shadow-2xl shadow-red-900/20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          <div className="absolute inset-0 bg-red-500/5 mix-blend-overlay"></div>

          <div className="relative z-10 max-w-3xl px-8 md:px-14">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg"
            >
              Đặt vé xem phim <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-500">
                Nhanh chóng
              </span>{" "}
              & Tiện lợi
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-gray-300 text-lg mb-8 leading-relaxed max-w-xl drop-shadow-md"
            >
              Khám phá những bộ phim bom tấn mới nhất, chọn ghế yêu thích và đặt
              vé online chỉ trong vài giây.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
            >
              <a
                href="#movies"
                className="group inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 px-8 py-3.5 rounded-full text-lg font-bold transition-all transform hover:-translate-y-1 shadow-lg shadow-red-600/30"
              >
                Xem phim ngay
                <span className="group-hover:translate-x-1 transition-transform">
                  ▶
                </span>
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* --- MOVIE LIST SECTION --- */}
        <div id="movies">
          <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <span className="text-red-500">●</span> Phim đang chiếu
            </h2>
            <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">
              {loading ? "Loading..." : `${movies.length} Movies`}
            </span>
          </div>

          {/* Grid Layout */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((index) => (
                <MovieCardSkeleton key={index} />
              ))}
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">Chưa có suất chiếu nào.</p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {movies.map((movie) => (
                <motion.div
                  key={movie.id}
                  variants={itemVariants}
                  className="group relative bg-neutral-900 rounded-2xl overflow-hidden shadow-lg border border-gray-800 hover:border-red-500/50 transition-all duration-300 hover:shadow-red-500/10 hover:shadow-2xl"
                >
                  {/* Image Wrapper */}
                  <div className="relative overflow-hidden h-[380px]">
                    <div className="absolute top-3 right-3 z-20 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      HOT
                    </div>

                    <img
                      src={
                        movie.poster_url ||
                        "https://via.placeholder.com/400x600?text=No+Poster"
                      }
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-red-500 transition-colors">
                      {movie.title}
                    </h3>

                    <p className="text-sm text-gray-400 mb-4">
                      {movie.genre || "Thể loại chưa cập nhật"}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <p className="text-yellow-400 font-bold flex items-center gap-1">
                        ⭐ {movie.rating || "N/A"}
                      </p>
                    </div>

                    {/* Link nút bấm giữ nguyên như code gốc */}
                    <Link
                      to={`/movie/${movie.id}`}
                      className="block text-center bg-red-600 hover:bg-red-700 py-2.5 rounded-xl font-bold transition-colors"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
