import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

export const loginUser = (data) =>
  axios.post(`${API_URL}/api/users/login`, data);

export const registerUser = (data) =>
  axios.post(`${API_URL}/api/users/register`, data);

export const forgotPassword = (data) =>
  axios.post(`${API_URL}/api/users/forgot-password`, data);

export const resetPassword = (data) =>
  axios.post(`${API_URL}/api/users/reset-password`, data);
