import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      window.alert("Sesi berakhir, silakan login kembali");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.warn("Unauthorized - redirecting to login");
      window.location.href = "/login";
    } else if (status === 403) {
      window.alert("Anda tidak memiliki akses ke resource ini");
      console.warn("Forbidden - akses ditolak");
    }
    return Promise.reject(error);
  }
);

export default api;


