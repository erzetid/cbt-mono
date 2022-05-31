import axios from 'axios';

const api = axios.create({
  withCredentials: true,
  baseURL: process.env.BASE_URL || 'http://localhost:3002/api'
});
export default api;
