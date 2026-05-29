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

  return (
    <nav className="sticky top-0 z-50 bg-neutral-900/95 backdrop-blur-md text-white shadow-lg border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl sm:text-2xl font-bold text-red-500 hover:text-red-400 transition-colors flex items-center gap-2"
        >
          <span className="text-2xl">🎬</span>
          <span className="hidden sm:inline">Cinema Booking</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/"
            className="px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Trang chủ
          </Link>

          {user && (
            <>
              <Link
                to="/my-tickets"
                className="px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                🎟️ Vé của tôi
              </Link>

              <Link
                to="/profile"
                className="px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                👤 Hồ sơ
              </Link>
            </>
          )}

          {user && ["admin", "staff"].includes(user.role) && (
            <button
              onClick={goToAdmin}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {user.role === "admin" ? "⚙️ Admin" : "⚙️ Staff"}
            </button>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-medium transition-colors"
              >
                Đăng nhập
              </Link>

              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-medium transition-colors"
              >
                Đăng ký
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 pl-2 border-l border-neutral-700">
                <span className="text-gray-400 text-sm">
                  Xin chào, <strong className="text-white">{user.name}</strong>
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
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
            className="block px-4 py-3 rounded-lg hover:bg-neutral-800"
            onClick={() => setMenuOpen(false)}
          >
            Trang chủ
          </Link>

          {user && (
            <>
              <Link
                to="/my-tickets"
                className="block px-4 py-3 rounded-lg hover:bg-neutral-800"
                onClick={() => setMenuOpen(false)}
              >
                🎟️ Vé của tôi
              </Link>

              <Link
                to="/profile"
                className="block px-4 py-3 rounded-lg hover:bg-neutral-800"
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
              className="block w-full text-left px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700"
            >
              {user.role === "admin" ? "⚙️ Admin Panel" : "⚙️ Staff Panel"}
            </button>
          )}

          {!user ? (
            <>
              <Link
                to="/login"
                className="block px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700"
                onClick={() => setMenuOpen(false)}
              >
                Đăng nhập
              </Link>

              <Link
                to="/register"
                className="block px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700"
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
                className="block w-full text-left px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700"
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
