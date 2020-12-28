import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true
});

// api.interceptors.request.use(async config => {
//   config.headers.Authorization = `Bearer aaaa`;
//   return config;
// });

export default api;