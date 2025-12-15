import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4500/api/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.userdata.role);

      res.data.userdata.role === "admin"
        ? navigate("/admin")
        : navigate("/");
    } catch (err) {
      alert("Login failed: " + (err.response?.data || err.message));
    }
  };

  return (
    <div>
      <div className="home-header">
        <h1>E-Commerce Store</h1>
        <div className="header-links">
          <button onClick={() => navigate(-1)} className="back-btn">← Back</button>
          <Link to="/">Home</Link>
          <Link to="/register">Register</Link>
        </div>
      </div>
      
      <form onSubmit={submit}>
        <h2>Login</h2>
        <input 
          placeholder="Email" 
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)} 
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={e => setPassword(e.target.value)} 
          required
        />
        <button type="submit">Login</button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}
