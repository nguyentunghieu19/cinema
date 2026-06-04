import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import { motion } from "framer-motion";

// --- Star Rain Canvas ---
const StarRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const STAR_COUNT = 120;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight - window.innerHeight,
      size: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 1.2 + 0.3,
      opacity: Math.random() * 0.7 + 0.3,
      drift: (Math.random() - 0.5) * 0.4,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      trail: [],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        star.twinkle += star.twinkleSpeed;
        const flicker = Math.sin(star.twinkle) * 0.3 + 0.7;

        // Trail
        star.trail.push({ x: star.x, y: star.y });
        if (star.trail.length > 8) star.trail.shift();

        star.trail.forEach((pt, i) => {
          const alpha = (i / star.trail.length) * star.opacity * flicker * 0.4;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, star.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 220, 180, ${alpha})`;
          ctx.fill();
        });

        // Star glow
        const grad = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          star.size * 3,
        );
        grad.addColorStop(0, `rgba(255, 240, 200, ${star.opacity * flicker})`);
        grad.addColorStop(
          0.4,
          `rgba(255, 180, 100, ${star.opacity * flicker * 0.5})`,
        );
        grad.addColorStop(1, `rgba(255, 100, 50, 0)`);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 240, ${star.opacity * flicker})`;
        ctx.fill();

        // 4-point sparkle
        ctx.save();
        ctx.translate(star.x, star.y);
        ctx.rotate(star.twinkle * 0.5);
        ctx.globalAlpha = star.opacity * flicker * 0.6;
        ctx.fillStyle = "rgba(255,240,200,1)";
        const s = star.size * 2.5;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.2, -s * 0.2);
        ctx.lineTo(s, 0);
        ctx.lineTo(s * 0.2, s * 0.2);
        ctx.lineTo(0, s);
        ctx.lineTo(-s * 0.2, s * 0.2);
        ctx.lineTo(-s, 0);
        ctx.lineTo(-s * 0.2, -s * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Move
        star.y += star.speed;
        star.x += star.drift;

        if (star.y > canvas.height + 20) {
          star.y = -20;
          star.x = Math.random() * canvas.width;
          star.trail = [];
        }
        if (star.x < -20) star.x = canvas.width + 20;
        if (star.x > canvas.width + 20) star.x = -20;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.75,
      }}
    />
  );
};

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
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div
      className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-red-500 selection:text-white"
      style={{ position: "relative" }}
    >
      {/* Star Rain */}
      <StarRain />

      <div style={{ position: "relative", zIndex: 1 }}>
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

            {/* Glowing border effect */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                boxShadow: "inset 0 0 60px rgba(220, 38, 38, 0.15)",
              }}
            />

            <div className="relative z-10 max-w-3xl px-8 md:px-14">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center gap-2 mb-4"
              >
                <span className="text-red-400 text-sm font-semibold tracking-widest uppercase">
                  ✦ Đang chiếu
                </span>
              </motion.div>

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
                Khám phá những bộ phim bom tấn mới nhất, chọn ghế yêu thích và
                đặt vé online chỉ trong vài giây.
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

                      {/* Star shimmer on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background:
                            "radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.15) 0%, transparent 70%)",
                        }}
                      />
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
    </div>
  );
}

export default Home;
