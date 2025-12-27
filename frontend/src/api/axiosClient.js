import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const voterToken = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken"); // ⭐ ADMIN TOKEN

  const isPublicEndpoint =
    config.url.includes("voter/login") ||
    config.url.includes("voter/register") ||
    config.url.includes("admin/login") ||
    config.url.includes("admin/register") ||
    config.url.includes("request-otp") ||
    config.url.includes("verify-otp");

  if (!isPublicEndpoint) {
    // ⭐ If request is to /admin/... use adminToken
    if (config.url.startsWith("/admin") && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    // ⭐ Otherwise use voter token
    else if (voterToken) {
      config.headers.Authorization = `Bearer ${voterToken}`;
    }
  }

  return config;
});

// Response error handler
axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response) {
      console.log(
        "%c[DEBUG] Auth error from URL:",
        "color:red;font-weight:bold",
        error.config?.url,
        "Status:",
        error.response.status
      );
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
