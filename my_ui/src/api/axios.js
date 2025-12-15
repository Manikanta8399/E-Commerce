import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4500/api"
});

api.interceptors.response.use(
  res => res,
  err => {
    alert(err.response?.data?.message || "Something went wrong");
    return Promise.reject(err);
  }
);

export default api;
