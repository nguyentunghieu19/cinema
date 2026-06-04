import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  const goToAdmin = () => {
    if (!user) return;
    if (user.role === "admin") {
      navigate("/admin");
    } else if (user.role === "staff") {
      navigate("/admin/movies");
    }
  };

  const navLinkClass =
    "relative px-4 py-2 rounded-lg font-medium transition-all duration-200 " +
    "hover:bg-white/10 hover:text-white hover:shadow-[0_0_12px_rgba(255,255,255,0.15)] " +
    "active:scale-95";

  const btnClass = (color) =>
    `px-5 py-2 rounded-lg font-semibold transition-all duration-200 active:scale-95 ` +
    (color === "blue"
      ? "bg-blue-600 hover:bg-blue-400 hover:shadow-[0_0_16px_rgba(96,165,250,0.6)] hover:scale-105"
      : color === "green"
        ? "bg-green-600 hover:bg-green-400 hover:shadow-[0_0_16px_rgba(74,222,128,0.6)] hover:scale-105"
        : color === "red"
          ? "bg-red-600 hover:bg-red-400 hover:shadow-[0_0_16px_rgba(248,113,113,0.6)] hover:scale-105"
          : color === "purple"
            ? "bg-purple-600 hover:bg-purple-400 hover:shadow-[0_0_16px_rgba(192,132,252,0.6)] hover:scale-105"
            : "");

  return (
    <nav className="sticky top-0 z-50 bg-neutral-900/95 backdrop-blur-md text-white shadow-lg border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl sm:text-2xl font-bold text-red-500 hover:text-red-400 transition-all duration-200 flex items-center gap-2 hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] hover:scale-105"
        >
          <span className="text-2xl">🎬</span>
          <span className="hidden sm:inline">Cinema Booking</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          <Link to="/" className={navLinkClass}>
            Trang chủ
          </Link>

          {user && (
            <>
              <Link to="/my-tickets" className={navLinkClass}>
                🎟️ Vé của tôi
              </Link>
              <Link to="/profile" className={navLinkClass}>
                👤 Hồ sơ
              </Link>
            </>
          )}

          {user && ["admin", "staff"].includes(user.role) && (
            <button onClick={goToAdmin} className={btnClass("purple")}>
              {user.role === "admin" ? "⚙️ Admin" : "⚙️ Staff"}
            </button>
          )}

          {!user ? (
            <>
              <Link to="/login" className={btnClass("blue")}>
                Đăng nhập
              </Link>
              <Link to="/register" className={btnClass("green")}>
                Đăng ký
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3 pl-2 border-l border-neutral-700">
              <span className="text-gray-400 text-sm">
                Xin chào, <strong className="text-white">{user.name}</strong>
              </span>
              <button onClick={handleLogout} className={btnClass("red")}>
                Đăng xuất
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.15)] transition-all duration-200"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-neutral-800 px-4 py-4 space-y-2 bg-neutral-900">
          <Link
            to="/"
            className="block px-4 py-3 rounded-lg hover:bg-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.15)] transition-all duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Trang chủ
          </Link>

          {user && (
            <>
              <Link
                to="/my-tickets"
                className="block px-4 py-3 rounded-lg hover:bg-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.15)] transition-all duration-200"
                onClick={() => setMenuOpen(false)}
              >
                🎟️ Vé của tôi
              </Link>
              <Link
                to="/profile"
                className="block px-4 py-3 rounded-lg hover:bg-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.15)] transition-all duration-200"
                onClick={() => setMenuOpen(false)}
              >
                👤 Hồ sơ
              </Link>
            </>
          )}

          {user && ["admin", "staff"].includes(user.role) && (
            <button
              onClick={() => {
                goToAdmin();
                setMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 rounded-lg ${btnClass("purple")}`}
            >
              {user.role === "admin" ? "⚙️ Admin Panel" : "⚙️ Staff Panel"}
            </button>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className={`block px-4 py-3 rounded-lg text-center ${btnClass("blue")}`}
                onClick={() => setMenuOpen(false)}
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className={`block px-4 py-3 rounded-lg text-center ${btnClass("green")}`}
                onClick={() => setMenuOpen(false)}
              >
                Đăng ký
              </Link>
            </>
          ) : (
            <>
              <div className="px-4 py-3 text-gray-400 border-t border-neutral-800 pt-4 mt-2">
                Xin chào, <strong className="text-white">{user.name}</strong>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg ${btnClass("red")}`}
              >
                Đăng xuất
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
