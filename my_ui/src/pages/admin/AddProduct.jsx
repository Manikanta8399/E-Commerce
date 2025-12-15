import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/api";

export default function AddProduct() {
  const [data, setData] = useState({
    name: '',
    price: '',
    discription: '',
    image: ''
  });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/postproduct", data);
      alert("Product added successfully");
      navigate("/admin/products");
    } catch (err) {
      alert("Failed to add product");
    }
  };

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
          <Link to="/admin/products" className="nav-link active">Products</Link>
          <Link to="/admin/orders" className="nav-link">Orders</Link>
          <Link to="/" className="nav-link">View Store</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </nav>
      </aside>

      <main className="admin-content">
        <h1>Add New Product</h1>
        <form onSubmit={submit} className="product-form">
          <div className="form-group">
            <label>Product Name</label>
            <input 
              type="text"
              placeholder="Product Name" 
              onChange={e => setData({ ...data, name: e.target.value })} 
              required
            />
          </div>
          
          <div className="form-group">
            <label>Price</label>
            <input 
              type="number"
              placeholder="Price" 
              onChange={e => setData({ ...data, price: e.target.value })} 
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea 
              placeholder="Product Description" 
              onChange={e => setData({ ...data, discription: e.target.value })} 
              rows="4"
            />
          </div>
          
          <div className="form-group">
            <label>Image URL</label>
            <input 
              type="text"
              placeholder="Image URL" 
              onChange={e => setData({ ...data, image: e.target.value })} 
            />
          </div>

          {data.image && (
            <div className="form-group">
              <label>Image Preview</label>
              <img src={data.image} alt="Preview" style={{ maxWidth: 200, maxHeight: 200 }} />
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-primary">Add Product</button>
            <Link to="/admin/products">
              <button type="button" className="btn-secondary">Cancel</button>
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
