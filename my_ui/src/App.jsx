import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import Checkout from "./pages/Checkout";
import ProductDetails from "./pages/ProductDetails";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import AdminOrders from "./pages/admin/AdminOrders";

import ProtectedRoute from "./utils/ProtectedRoute";
import AdminRoute from "./utils/AdminRoute";
import Payment from "./pages/Payment";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        
        <Route path="/orders" element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        } />
        
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </ProtectedRoute>
        } />

        <Route path="/admin/products" element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          </ProtectedRoute>
        } />

        <Route path="/admin/add-product" element={
          <ProtectedRoute>
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          </ProtectedRoute>
        } />

        <Route path="/admin/edit-product/:id" element={
          <ProtectedRoute>
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          </ProtectedRoute>
        } />

        <Route path="/admin/orders" element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          </ProtectedRoute>
        } />

        <Route path="/payment/:orderId" element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
