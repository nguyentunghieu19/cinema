import { useEffect, useState } from "react";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "../api/adminApi";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Quản lý người dùng</h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 p-6 rounded-2xl mb-10 space-y-4"
        >
          <h2 className="text-2xl font-bold">
            {editingUserId ? "Cập nhật người dùng" : "Thêm tài khoản mới"}
          </h2>

          <input
            type="text"
            placeholder="Họ tên"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 rounded bg-gray-800"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 rounded bg-gray-800"
            required
          />

          {!editingUserId && (
            <input
              type="password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 rounded bg-gray-800"
              required
            />
          )}

          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full p-3 rounded bg-gray-800"
          >
            <option value="user">user</option>
            <option value="staff">staff</option>
            <option value="admin">admin</option>
          </select>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded"
            >
              {editingUserId ? "Cập nhật" : "Tạo tài khoản"}
            </button>

            {editingUserId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded"
              >
                Hủy
              </button>
            )}
          </div>
        </form>

        {/* Table */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800 text-left">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Tên</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-gray-800">
                  <td className="p-4">{user.id}</td>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <span className="bg-blue-600 px-2 py-1 rounded text-sm">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.is_active ? "Hoạt động" : "Bị khóa"}
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded"
                    >
                      Sửa
                    </button>

                    <button
                      onClick={() => handleDelete(user)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="p-6 text-center text-gray-400">
              Không có người dùng nào.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
