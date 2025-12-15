import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/getallproduct");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await api.delete(`/deleteproduct/${id}`);
      alert("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <Link to="/admin" className="nav-link">Dashboard</Link>
          <Link to="/admin/products" className="nav-link active">Products</Link>
          <Link to="/admin/orders" className="nav-link">Orders</Link>
          <Link to="/" className="nav-link">View Store</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </nav>
      </aside>

      <main className="admin-content">
        <div className="admin-header">
          <h1>Products Management</h1>
          <Link to="/admin/add-product">
            <button className="btn-primary">+ Add Product</button>
          </Link>
        </div>

        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td>
                    {p.image && <img src={p.image} alt={p.name} style={{ width: 60, height: 60, objectFit: 'cover' }} />}
                  </td>
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.discription}</td>
                  <td>
                    <Link to={`/admin/edit-product/${p._id}`}>
                      <button className="btn-edit">Edit</button>
                    </Link>
                    <button onClick={() => deleteProduct(p._id)} className="btn-delete">Delete</button>
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
