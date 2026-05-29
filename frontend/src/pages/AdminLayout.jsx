import { NavLink, Outlet } from "react-router-dom";
function AdminLayout() {
  const menuSections = [
    {
      title: "Tổng quan",
      items: [{ to: "/admin", label: "Dashboard", icon: "📊", end: true }],
    },
    {
      title: "Quản lý",
      items: [
        { to: "/admin/movies", label: "Quản lý phim", icon: "🎬" },
        { to: "/admin/showtimes", label: "Quản lý Lịch chiếu", icon: "📅" },
        { to: "/admin/users", label: "Quản lý người dùng", icon: "👥" },
        { to: "/admin/bookings", label: " Quản lý đặt vé", icon: "🎟️" },
      ],
    },
    {
      title: "Thống kê",
      items: [{ to: "/admin/reports", label: "Doanh thu", icon: "📈" }],
    },
  ];
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      {" "}
      {/* Sidebar */}{" "}
      <aside className="w-64 bg-black border-r border-neutral-800 fixed left-0 top-0 h-screen flex flex-col shadow-2xl">
        {" "}
        {/* Logo */}{" "}
        <div className="h-20 flex items-center px-6 border-b border-neutral-800">
          {" "}
          <h1 className="text-2xl font-extrabold tracking-wide text-red-500">
            {" "}
            🎬 CINEADMIN{" "}
          </h1>{" "}
        </div>{" "}
        {/* Navigation */}{" "}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {" "}
          {menuSections.map((section, index) => (
            <div key={index} className="mb-7">
              {" "}
              {/* Section Title */}{" "}
              <h2 className="px-4 mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
                {" "}
                {section.title}{" "}
              </h2>{" "}
              {/* Menu Items */}{" "}
              <div className="space-y-2">
                {" "}
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? "bg-red-600 text-white shadow-lg shadow-red-600/20" : "text-gray-400 hover:bg-neutral-900 hover:text-white"}`
                    }
                  >
                    {" "}
                    <span className="text-lg">{item.icon}</span>{" "}
                    <span className="font-medium"> {item.label} </span>{" "}
                  </NavLink>
                ))}{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </nav>{" "}
        {/* Footer */}{" "}
        <div className="p-4 border-t border-neutral-800">
          {" "}
          <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-neutral-900 hover:text-white transition-all duration-300"
          >
            {" "}
            <span>🏠</span> <span>Về trang chủ</span>{" "}
          </NavLink>{" "}
        </div>{" "}
      </aside>{" "}
      {/* Main Content */}{" "}
      <main className="flex-1 ml-64 min-h-screen bg-neutral-950">
        {" "}
        {/* Topbar */}{" "}
        <header className="h-20 border-b border-neutral-800 bg-black/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
          {" "}
          <div>
            {" "}
            <h2 className="text-2xl font-bold"> Admin Dashboard </h2>{" "}
            <p className="text-sm text-gray-400">
              {" "}
              Quản lý hệ thống đặt vé xem phim{" "}
            </p>{" "}
          </div>{" "}
          {/* Admin Info */}{" "}
          <div className="flex items-center gap-4">
            {" "}
            <div className="text-right">
              {" "}
              <p className="font-semibold">Admin</p>{" "}
              <p className="text-sm text-gray-400"> Quản trị hệ thống </p>{" "}
            </div>{" "}
            <div className="w-11 h-11 rounded-full bg-red-600 flex items-center justify-center font-bold text-lg">
              {" "}
              A{" "}
            </div>{" "}
          </div>{" "}
        </header>{" "}
        {/* Content */}{" "}
        <div className="p-8">
          {" "}
          <Outlet />{" "}
        </div>{" "}
      </main>{" "}
    </div>
  );
}
export default AdminLayout;
