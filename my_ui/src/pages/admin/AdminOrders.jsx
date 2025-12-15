import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/getallorder");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/updatestatus/${id}`, { orderstatus: status });
      alert("Order status updated successfully");
      fetchOrders();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <Link to="/admin" className="nav-link">Dashboard</Link>
          <Link to="/admin/products" className="nav-link">Products</Link>
          <Link to="/admin/orders" className="nav-link active">Orders</Link>
          <Link to="/" className="nav-link">View Store</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </nav>
      </aside>

      <main className="admin-content">
        <h1>Orders Management</h1>

        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Items</th>
                <th>Address</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6)}</td>
                  <td>{order.user?.name || order.user?.email || 'N/A'}</td>
                  <td>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {order.items?.map((item, idx) => (
                        <li key={idx}>
                          {item.product?.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>{order.address}</td>
                  <td>₹{order.totalamount}</td>
                  <td>
                    <span className={`badge ${order.paymentstatus}`}>
                      {order.paymentstatus}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${order.orderstatus}`}>
                      {order.orderstatus}
                    </span>
                  </td>
                  <td>
                    <select 
                      value={order.orderstatus} 
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="status-dropdown"
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="out of delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
