import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <Link to="/admin" className="nav-link">Dashboard</Link>
          <Link to="/admin/products" className="nav-link">Products</Link>
          <Link to="/admin/orders" className="nav-link">Orders</Link>
          <Link to="/" className="nav-link">View Store</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </nav>
      </aside>
      
      <main className="admin-content">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Products</h3>
            <Link to="/admin/products">Manage Products</Link>
          </div>
          <div className="stat-card">
            <h3>Orders</h3>
            <Link to="/admin/orders">Manage Orders</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
