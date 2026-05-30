import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "../api/adminApi";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      navigate("/admin");
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAdminUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Lỗi tải danh sách người dùng:", error);
      alert("Không thể tải danh sách người dùng");
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "staff",
    });
    setEditingUserId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUserId) {
        await updateAdminUser(editingUserId, {
          name: form.name,
          email: form.email,
          role: form.role,
        });
        alert("Cập nhật người dùng thành công");
      } else {
        await createAdminUser(form);
        alert("Tạo tài khoản thành công");
      }

      resetForm();
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Có lỗi xảy ra");
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (user) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn xóa tài khoản "${user.email}"?`,
    );

    if (!confirmDelete) return;

    try {
      await deleteAdminUser(user.id);
      alert("Xóa người dùng thành công");
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.detail || "Xóa thất bại");
    }
  };

  // Helper for role badge color
  const getRoleBadge = (role) => {
    const colors = {
      admin: "bg-red-600 text-white",
      staff: "bg-blue-600 text-white",
      user: "bg-gray-600 text-white",
    };
    return colors[role] || colors.user;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">👥 Quản lý người dùng</h1>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-10"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            {editingUserId ? (
              <>
                <span>✏️</span>
                <span>Cập nhật người dùng</span>
              </>
            ) : (
              <>
                <span>➕</span>
                <span>Thêm tài khoản mới</span>
              </>
            )}
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Họ tên *
              </label>
              <input
                type="text"
                placeholder="Nhập họ tên"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Email *
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Password - only show when creating */}
            {!editingUserId && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Mật khẩu *
                </label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            )}

            {/* Empty div for spacing when password is hidden */}
            {!editingUserId && <div></div>}

            {/* Role */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Vai trò
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 p-3 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
              >
                <option value="user">User</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex gap-4 mt-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                {editingUserId ? "💾 Cập nhật" : "➕ Tạo tài khoản"}
              </button>

              {editingUserId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-neutral-700 hover:bg-neutral-600 px-6 py-3 rounded-xl transition-colors"
                >
                  Hủy
                </button>
              )}
            </div>
          </div>
        </form>

        {/* User Table */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-800 text-gray-400 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">ID</th>
                  <th className="px-6 py-4 text-left font-medium">Tên</th>
                  <th className="px-6 py-4 text-left font-medium">Email</th>
                  <th className="px-6 py-4 text-left font-medium">Vai trò</th>
                  <th className="px-6 py-4 text-left font-medium">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left font-medium">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-800">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-400">#{user.id}</td>
                    <td className="px-6 py-4 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-gray-300">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(
                          user.role,
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm ${
                          user.is_active ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {user.is_active ? "● Hoạt động" : "● Bị khóa"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Sửa
                        </button>

                        <button
                          onClick={() => handleDelete(user)}
                          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              Không có người dùng nào.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
