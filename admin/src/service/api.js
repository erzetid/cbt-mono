import axios from "axios";
const api = axios.create({
  withCredentials: true,
  baseURL: process.env.BASE_URL || "/api",
});
export default api;
