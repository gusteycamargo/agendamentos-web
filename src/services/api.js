import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

api.interceptors.request.use(async config => {
  const token = getToken();

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;