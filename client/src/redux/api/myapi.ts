import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: process.env.APIURL,
  timeout: 50000,
  withCredentials: false
});

AxiosInstance.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

export default AxiosInstance;