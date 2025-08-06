import axios from "axios";

const apiRequest = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export default apiRequest;