// src/services/api.service.js
import axios from "axios";

// Tạo một instance của Axios
const api = axios.create({
  baseURL: "http://localhost:3000", // đổi theo backend của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

// Gắn token vào headers nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý lỗi response (nếu muốn)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Ví dụ: Token hết hạn => chuyển về trang đăng nhập
      localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
