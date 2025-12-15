import { useState, useEffect, useContext } from "react";
import { getAllProducts, addProduct, deleteProduct } from "../api/api";
import { AuthContext } from "../context/AuthContext";

const AdminDashboard = () => {
  const { token, user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", discription: "", image: "" });

  useEffect(() => {
    getAllProducts().then(res => setProducts(res.data));
  }, []);

  if (user?.role !== "admin") return <h3>Admin only</h3>;

  const handleAdd = async () => {
    await addProduct(form, token);
    alert("Product added");
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Price" onChange={e => setForm({ ...form, price: e.target.value })} />
      <input placeholder="Description" onChange={e => setForm({ ...form, discription: e.target.value })} />
      <input placeholder="Image URL" onChange={e => setForm({ ...form, image: e.target.value })} />
      <button onClick={handleAdd}>Add Product</button>

      {products.map(p => (
        <div key={p._id}>
          <p>{p.name}</p>
          <button onClick={() => deleteProduct(p._id, token)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
