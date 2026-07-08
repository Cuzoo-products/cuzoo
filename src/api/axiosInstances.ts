import axios from "axios";
import { getAuth } from "firebase/auth";
import { clearSessionOnAuthFailure } from "@/lib/logout";

const axiosInstance = axios.create({
  baseURL: "https://api-zzu2vjwwwa-uc.a.run.app/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  // Default for normal requests; KYC overrides with a longer timeout.
  timeout: 60_000,
});

/** Longer wait for KYC / large document uploads. */
export const KYC_REQUEST_TIMEOUT_MS = 180_000;

// 🔹 Add a request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // Always get a fresh token (Firebase automatically refreshes when needed)

      const token = await user.getIdToken();
      // console.log(token);
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSessionOnAuthFailure();
    }

    if (error.response) {
      const backendError = error.response.data;
      return Promise.reject({
        status: backendError.status,
        message: backendError.message,
        details: backendError.stack,
      });
    } else if (error.request) {
      const isTimeout =
        error.code === "ECONNABORTED" ||
        String(error.message ?? "")
          .toLowerCase()
          .includes("timeout");
      return Promise.reject({
        code: error.code,
        message: isTimeout
          ? "Request timed out waiting for the server"
          : "No response from server",
        details: error.request,
      });
    } else {
      return Promise.reject({
        message: error.message,
        details: error.message,
      });
    }
  }
);

export default axiosInstance;
