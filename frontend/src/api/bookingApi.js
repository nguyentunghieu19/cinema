import axiosInstance from "./axios";

export const createBooking = async (data) => {
  return await axiosInstance.post("/api/bookings/", data);
};

export const getBookings = async () => {
  return await axiosInstance.get("/api/bookings/");
};

export const deleteBooking = async (id) => {
  return await axiosInstance.delete(`/api/bookings/${id}`);
};
