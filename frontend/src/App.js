import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// User pages
import Home from "./pages/Home";
import MoviePage from "./pages/MoviePage";
import BookingPage from "./pages/BookingPage";
import MyTicketsPage from "./pages/MyTicketsPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminShowtimes from "./pages/AdminShowtimes";
import PaymentResultPage from "./pages/PaymentResultPage";
// Admin pages
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMovies from "./pages/AdminMovies";
import AdminUsers from "./pages/AdminUsers";
import AdminBookings from "./pages/AdminBookings";
import AdminReports from "./pages/AdminReports";

// Components
import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <Router>
      {/* Navbar hiển thị trên toàn bộ website */}
      <Navbar />

      <Routes>
        {/* User routes */}
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/booking/:showtimeId" element={<BookingPage />} />
        <Route path="/my-tickets" element={<MyTicketsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/payment-result" element={<PaymentResultPage />} />
        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="movies" element={<AdminMovies />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="showtimes" element={<AdminShowtimes />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
