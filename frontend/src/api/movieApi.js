import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const getMovies = () => {
  return axios.get(`${API_URL}/movies/`);
};

export const createMovie = (data) => {
  return axios.post(`${API_URL}/movies/`, data);
};

export const deleteMovie = (id) => {
  return axios.delete(`${API_URL}/movies/${id}`);
};
