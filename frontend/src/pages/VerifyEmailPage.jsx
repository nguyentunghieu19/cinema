import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const API_URL = "http://127.0.0.1:8000/api";

function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!email || !code) {
      alert("Vui lòng nhập email và mã xác thực");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_URL}/users/verify-email`, {
        email,
        code,
      });

      alert("Xác thực thành công");

      navigate("/login");
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.detail || "Xác thực thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">📧</div>

            <h1 className="text-2xl font-bold text-white">Xác thực Email</h1>

            <p className="text-gray-400 mt-2">
              Nhập mã xác thực được gửi đến email
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-gray-400 mb-2">Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-3 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Mã xác thực</label>

              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-3 text-white"
              />
            </div>

            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-bold text-white"
            >
              {loading ? "Đang xác thực..." : "Xác thực"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default VerifyEmailPage;
