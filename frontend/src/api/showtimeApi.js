import axiosInstance from "./axios";

// Lấy toàn bộ lịch chiếu
export const getShowtimes = async () => {
  const res = await axiosInstance.get("/api/showtimes/");
  return res.data;
};

// Lấy lịch chiếu theo phim
export const getShowtimesByMovie = async (movieId) => {
  const res = await axiosInstance.get(`/api/showtimes/movie/${movieId}`);
  return res.data;
};

// Tạo lịch chiếu
export const createShowtime = async (data) => {
  const res = await axiosInstance.post("/api/showtimes/", data);
  return res.data;
};

// Cập nhật lịch chiếu
export const updateShowtime = async (id, data) => {
  const res = await axiosInstance.put(`/api/showtimes/${id}`, data);
  return res.data;
};

// Xóa lịch chiếu
export const deleteShowtime = async (id) => {
  const res = await axiosInstance.delete(`/api/showtimes/${id}`);
  return res.data;
};
