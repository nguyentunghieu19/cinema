import axiosInstance from "./axios";

// =========================
// Dashboard
// =========================
export const getAdminStats = async () => {
  return await axiosInstance.get("/api/admin/stats");
};

export const getAdminBookings = async () => {
  return await axiosInstance.get("/api/admin/bookings");
};

// =========================
// User Management
// =========================
export const getAdminUsers = async () => {
  return await axiosInstance.get("/api/admin/users");
};

export const createAdminUser = async (data) => {
  return await axiosInstance.post("/api/admin/users", data);
};

export const updateAdminUser = async (userId, data) => {
  return await axiosInstance.put(`/api/admin/users/${userId}`, data);
};

export const deleteAdminUser = async (userId) => {
  return await axiosInstance.delete(`/api/admin/users/${userId}`);
};
