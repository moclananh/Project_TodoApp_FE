import axios from "axios";
import { loginApi } from "../apis/LoginApi";

// Create an axios instance
const httpClient = axios.create({
  baseURL: "http://localhost:5081/api",
});

// Request interceptor to add bearer token
httpClient.interceptors.request.use(
  (config) => {
    // Retrieve the token from local storage
    const token = loginApi.getUser().token;

    // If token exists, add it to the Authorization header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response interceptor for handling token-related errors
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized or token expired errors
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      // Clear the token from local storage
      localStorage.removeItem("user");

      // Optional: Redirect to login page
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

// Helper functions for token management
export const setAuthToken = (token) => {
  if (token) {
    // Save token to local storage
    localStorage.setItem("authToken", token);
  } else {
    // Remove token from local storage
    localStorage.removeItem("authToken");
  }
};

export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};

// Export the configured axios instance
export default httpClient;
