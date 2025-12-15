import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4500/api/register", data);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <div className="home-header">
        <h1>E-Commerce Store</h1>
        <div className="header-links">
          <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>

      <form onSubmit={submit}>
        <h2>Register</h2>
        <input 
          placeholder="Name" 
          onChange={e => setData({ ...data, name: e.target.value })} 
          required
        />
        <input 
          placeholder="Email" 
          type="email"
          onChange={e => setData({ ...data, email: e.target.value })} 
          required
        />
        <input 
          placeholder="Password" 
          type="password"
          onChange={e => setData({ ...data, password: e.target.value })} 
          required
        />
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
            Register as:
          </label>
          <select 
            onChange={e => setData({ ...data, role: e.target.value })}
            defaultValue="user"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e0e0e0' }}
          >
            <option value="user">User (Customer)</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <button type="submit">Register</button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}
