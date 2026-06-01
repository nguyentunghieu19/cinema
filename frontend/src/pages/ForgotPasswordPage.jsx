import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../api/authApi";
import { motion } from "framer-motion";

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      alert("Vui lòng nhập email");
      return;
    }

    try {
      setLoading(true);

      await forgotPassword({
        email,
      });

      alert("Mã OTP đã được gửi tới email của bạn");

      setStep(2);
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.detail || "Không thể gửi OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!code || !newPassword) {
      alert("Vui lòng nhập OTP và mật khẩu mới");
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        email,
        code,
        new_password: newPassword,
      });

      alert("Đổi mật khẩu thành công");

      navigate("/login");
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.detail || "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="w-full max-w-md"
      >
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              🔐
            </div>

            <h1 className="text-2xl font-bold text-white">Quên mật khẩu</h1>

            <p className="text-gray-400 mt-2">
              {step === 1
                ? "Nhập email để nhận mã OTP"
                : "Nhập OTP và mật khẩu mới"}
            </p>
          </div>

          {step === 1 ? (
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl focus:border-red-500 focus:outline-none text-white"
                />
              </div>

              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-neutral-700 py-3 rounded-xl font-bold transition-colors"
              >
                {loading ? "Đang gửi..." : "Gửi OTP"}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Mã OTP
                </label>

                <input
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl focus:border-red-500 focus:outline-none text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Mật khẩu mới
                </label>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl focus:border-red-500 focus:outline-none text-white"
                />
              </div>

              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-neutral-700 py-3 rounded-xl font-bold transition-colors"
              >
                {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default ForgotPasswordPage;
