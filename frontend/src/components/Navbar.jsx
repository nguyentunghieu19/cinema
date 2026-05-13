import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md text-white shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-red-500 hover:text-red-400"
        >
          🎬 Cinema Booking
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-red-400">
            Trang chủ
          </Link>

          {user && (
            <>
              <Link to="/my-tickets" className="hover:text-red-400">
                Vé của tôi
              </Link>

              <Link to="/profile" className="hover:text-red-400">
                Hồ sơ
              </Link>
            </>
          )}

          {/* Admin / Staff */}
          {user && ["admin", "staff"].includes(user.role) && (
            <button
              onClick={goToAdmin}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
            >
              {user.role === "admin" ? "Admin Panel" : "Staff Panel"}
            </button>
          )}

          {/* Auth buttons */}
          {!user ? (
            <>
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
              >
                Đăng nhập
              </Link>

              <Link
                to="/register"
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
              >
                Đăng ký
              </Link>
            </>
          ) : (
            <>
              <span className="text-gray-300">
                Xin chào, <strong>{user.name}</strong>
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
