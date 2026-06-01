import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const loginUser = (data) => axios.post(`${API_URL}/users/login`, data);

export const registerUser = (data) =>
  axios.post(`${API_URL}/users/register`, data);

export const forgotPassword = (data) =>
  axios.post(`${API_URL}/users/forgot-password`, data);

export const resetPassword = (data) =>
  axios.post(`${API_URL}/users/reset-password`, data);
