import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/api";

export default function EditProduct() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/getsingleproduct/${id}`);
      setData(res.data);
    } catch (err) {
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/updateproduct/${id}`, data);
      alert("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      alert("Failed to update product");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) return <div className="loading">Loading product...</div>;

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
        <h1>Edit Product</h1>
        <form onSubmit={submit} className="product-form">
          <div className="form-group">
            <label>Product Name</label>
            <input 
              type="text"
              value={data.name || ""} 
              onChange={e => setData({ ...data, name: e.target.value })} 
              placeholder="Product Name"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Price</label>
            <input 
              type="number"
              value={data.price || ""} 
              onChange={e => setData({ ...data, price: e.target.value })} 
              placeholder="Price"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea 
              value={data.discription || ""} 
              onChange={e => setData({ ...data, discription: e.target.value })} 
              placeholder="Product Description"
              rows="4"
            />
          </div>
          
          <div className="form-group">
            <label>Image URL</label>
            <input 
              type="text"
              value={data.image || ""} 
              onChange={e => setData({ ...data, image: e.target.value })} 
              placeholder="Image URL"
            />
          </div>

          {data.image && (
            <div className="form-group">
              <label>Image Preview</label>
              <img src={data.image} alt="Preview" style={{ maxWidth: 200, maxHeight: 200 }} />
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary">Update Product</button>
            <Link to="/admin/products">
              <button type="button" className="btn-secondary">Cancel</button>
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
