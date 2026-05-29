import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
      setLoading(false);
    }, 500);
  }, []);

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6 pt-24">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-28 h-28 rounded-full bg-neutral-800 mb-4"></div>
          <div className="h-8 w-48 bg-neutral-800 rounded mb-2"></div>
          <div className="h-4 w-32 bg-neutral-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center px-6 pt-24"
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-neutral-800 flex items-center justify-center text-4xl">
            🔒
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Vui lòng đăng nhập</h2>
            <p className="text-gray-400 mb-6">
              Bạn cần đăng nhập để xem hồ sơ cá nhân.
            </p>
            <Link
              to="/login"
              className="inline-block bg-red-600 hover:bg-red-500 px-8 py-3 rounded-xl font-bold transition-all"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-red-600";
      case "user":
        return "bg-purple-600";
      default:
        return "bg-blue-600";
    }
  };

  const userInfo = [
    { label: "ID người dùng", value: user.id, delay: 0.5 },
    { label: "Họ tên", value: user.name, delay: 0.6 },
    { label: "Email", value: user.email, delay: 0.7 },
    { label: "Vai trò", value: user.role, delay: 0.8 },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="min-h-screen bg-neutral-950 text-white px-4 sm:px-6 pt-24 pb-10"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden">
          <div
            className="h-32 w-full bg-cover bg-center relative"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1536440136628-849c629eaf7b?auto=format&fit=crop&w=800&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent"></div>
          </div>

          <div className="relative px-8 pb-8">
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
              <div
                className={`w-28 h-28 rounded-full border-4 border-neutral-900 flex items-center justify-center text-4xl font-bold shadow-lg ${getRoleColor(user.role)}`}
              >
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>

            <div className="text-center mt-16 mb-8">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold"
              >
                {user.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-400 mt-1"
              >
                {user.email}
              </motion.p>

              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className={`inline-block mt-3 px-4 py-1 rounded-full ${getRoleColor(user.role)} text-sm font-semibold`}
              >
                {user.role}
              </motion.span>
            </div>

            <div className="grid gap-4">
              {userInfo.map((item, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  // Sửa lại class: hover sẽ đổi màu nền và thêm viền đỏ
                  className="bg-neutral-800 p-4 rounded-xl border border-neutral-700 hover:bg-neutral-700 hover:border-red-500/50 transition-all duration-300 cursor-default group"
                >
                  <p className="text-gray-400 text-sm mb-1 group-hover:text-red-400 transition-colors">
                    {item.label}
                  </p>
                  <p className="text-lg font-semibold group-hover:text-white transition-colors">
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProfilePage;
