import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const loginUser = (data) => {
  return axios.post(`${API_URL}/users/login`, data);
};

export const registerUser = (data) => {
  return axios.post(`${API_URL}/users/register`, data);
};
