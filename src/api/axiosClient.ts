import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const axiosClient = axios.create({
  baseURL: API_URL, // your backend
  withCredentials: true, // allow cookies to be sent
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
