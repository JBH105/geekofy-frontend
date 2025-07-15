import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}`,
});

api.interceptors.request.use(
  async (config) => {
    const backendToken = Cookies.get("backend-token");
    if (backendToken) {
      config.headers["Authorization"] = `Bearer ${backendToken}`;
    }
    return config;  
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;