import axiosInstance from "./axios";

// ===============================
// USERS
// ===============================
export const getAdminUsers = () => axiosInstance.get("/api/admin/users");

export const createAdminUser = (data) =>
  axiosInstance.post("/api/admin/users", data);

export const updateAdminUser = (id, data) =>
  axiosInstance.put(`/api/admin/users/${id}`, data);

export const deleteAdminUser = (id) =>
  axiosInstance.delete(`/api/admin/users/${id}`);

// ===============================
// DASHBOARD
// ===============================
export const getAdminStats = () => axiosInstance.get("/api/admin/stats");

export const getAdminBookings = () => axiosInstance.get("/api/admin/bookings");
