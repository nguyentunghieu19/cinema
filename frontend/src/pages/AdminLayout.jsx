import { Link, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-8">ADMIN</h2>

        <nav className="space-y-4">
          <Link to="/admin" className="block hover:text-red-500">
            Dashboard
          </Link>

          <Link to="/admin/movies" className="block hover:text-red-500">
            Quản lý phim
          </Link>

          <Link to="/admin/showtimes" className="block hover:text-red-500">
            Quản lý lịch chiếu
          </Link>

          <Link to="/admin/users" className="block hover:text-red-500">
            Quản lý người dùng
          </Link>

          <Link to="/admin/bookings" className="block hover:text-red-500">
            Quản lý đặt vé
          </Link>

          <Link to="/admin/reports" className="block hover:text-red-500">
            Báo cáo doanh thu
          </Link>

          <Link to="/" className="block hover:text-red-500 mt-8">
            ← Về trang chủ
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
