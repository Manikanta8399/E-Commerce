import React, { useState, useContext } from "react";
import { loginUser } from "../api/api";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(form);
    login(res.data.userdata, res.data.token);
    alert("Logged in successfully!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Email" name="email" value={form.email} onChange={handleChange} />
      <input placeholder="Password" name="password" type="password" value={form.password} onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
