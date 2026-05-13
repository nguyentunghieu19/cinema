import { useEffect, useState } from "react";

function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6 pt-24">
        <p>Vui lòng đăng nhập để xem hồ sơ.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 pt-24 pb-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-800">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-28 h-28 rounded-full bg-red-600 flex items-center justify-center text-4xl font-bold">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <h1 className="text-3xl font-bold mt-4">{user.name}</h1>
            <p className="text-gray-400">{user.email}</p>

            <span className="mt-3 px-4 py-1 rounded-full bg-purple-600 text-sm font-semibold">
              {user.role}
            </span>
          </div>

          {/* Thông tin */}
          <div className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">ID người dùng</p>
              <p className="text-lg font-semibold">{user.id}</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Họ tên</p>
              <p className="text-lg font-semibold">{user.name}</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-lg font-semibold">{user.email}</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Vai trò</p>
              <p className="text-lg font-semibold">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
