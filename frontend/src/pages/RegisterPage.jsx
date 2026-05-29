import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { motion } from "framer-motion";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      await registerUser(form);

      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              🎬
            </div>
            <h1 className="text-2xl font-bold">Tạo tài khoản</h1>
            <p className="text-gray-400 mt-1">Đăng ký để đặt vé xem phim</p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Họ tên</label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-neutral-700 disabled:cursor-not-allowed py-3 rounded-xl font-bold transition-colors mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang xử lý...
                </span>
              ) : (
                "Đăng ký"
              )}
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center mt-6 text-gray-400">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-red-500 hover:text-red-400 font-medium"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default RegisterPage;
