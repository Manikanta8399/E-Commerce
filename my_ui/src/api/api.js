import axios from "axios";

const API_URL = "http://localhost:4500/api";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Named exports for specific functions
export const registerUser = (data) => axios.post(`${API_URL}/register`, data);
export const loginUser = (data) => axios.post(`${API_URL}/login`, data);
export const getAllProducts = () => axios.get(`${API_URL}/getallproduct`);
export const getProduct = (id) => axios.get(`${API_URL}/getsingleproduct/${id}`);
export const addProduct = (data, token) => axios.post(`${API_URL}/postproduct`, data, { headers: { Authorization: `Bearer ${token}` }});
export const updateProduct = (id, data, token) => axios.put(`${API_URL}/updateproduct/${id}`, data, { headers: { Authorization: `Bearer ${token}` }});
export const deleteProduct = (id, token) => axios.delete(`${API_URL}/deleteproduct/${id}`, { headers: { Authorization: `Bearer ${token}` }});
export const addCart = (productid, token) => axios.post(`${API_URL}/addcart`, { productid }, { headers: { Authorization: `Bearer ${token}` }});
export const getCart = (token) => axios.get(`${API_URL}/getcart`, { headers: { Authorization: `Bearer ${token}` }});
export const updateCart = (productid, quantity, token) => axios.put(`${API_URL}/updatecart`, { productid, quantity }, { headers: { Authorization: `Bearer ${token}` }});
export const removeCartItem = (productid, token) => axios.delete(`${API_URL}/delcart`, { data: { productid }, headers: { Authorization: `Bearer ${token}` }});
export const placeOrder = (address, token) => axios.post(`${API_URL}/placeorder`, { address }, { headers: { Authorization: `Bearer ${token}` }});
export const getOrders = (token) => axios.get(`${API_URL}/getorder`, { headers: { Authorization: `Bearer ${token}` }});
export const updateStatus = (id, orderstatus, token) => axios.put(`${API_URL}/updatestatus/${id}`, { orderstatus }, { headers: { Authorization: `Bearer ${token}` }});
export const cancelOrder = (id, token) => axios.put(`${API_URL}/cancelorder/${id}`, {}, { headers: { Authorization: `Bearer ${token}` }});
export const payment = (orderid, paymentmethod, token) => axios.put(`${API_URL}/payment`, { orderid, paymentmethod }, { headers: { Authorization: `Bearer ${token}` }});

