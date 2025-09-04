import axios from "axios";
import store from "@/redux/store/store";
import { logout } from "@/redux/slices/authSlice";

const axiosInstance = axios.create({
  baseURL: "https://final-year-backend-1u0j.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const getToken = JSON.parse(localStorage.getItem("authState") as string);

    if (getToken) {
      const token = getToken.token;

      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }

    if (error?.response) {
      console.log(error);
      const backendError = error.response.data;

      return Promise.reject({
        status: backendError.status,
        message: backendError.message,
        details: backendError.stack,
      });
    } else if (error.request) {
      // console.error('No response received:', error.request);

      return Promise.reject({
        message: "No response from server",
        details: error.request,
      });
    } else {
      // console.error('Error setting up request:', error.message);
      return Promise.reject({
        message: error.message,
        details: error.message,
      });
    }
  }
);

export default axiosInstance;
