import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const res = await loginUser(form);

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Đăng nhập thành công");

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Sai email hoặc mật khẩu");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Đăng nhập</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-gray-800"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full p-3 mb-6 rounded bg-gray-800"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded font-bold"
        >
          Đăng nhập
        </button>

        <p className="text-center mt-4 text-gray-400">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-red-500">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
