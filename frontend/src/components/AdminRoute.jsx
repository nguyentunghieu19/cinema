import { Navigate, useLocation } from "react-router-dom";

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  // Chưa đăng nhập
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Không có quyền quản trị
  if (!["admin", "staff"].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Staff không được xem Dashboard
  // Nếu staff truy cập /admin thì chuyển sang /admin/movies
  if (
    user.role === "staff" &&
    (location.pathname === "/admin" || location.pathname === "/admin/")
  ) {
    return <Navigate to="/admin/movies" replace />;
  }

  return children;
}

export default AdminRoute;
