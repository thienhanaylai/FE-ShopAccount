import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.shopaccgiare.tech",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

export default axiosInstance;
