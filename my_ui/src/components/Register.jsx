import React, { useState, useContext } from "react";
import { registerUser } from "../api/api";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await registerUser(form);
    login(res.data, ""); // no token returned on register
    alert("Registered successfully!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" name="name" value={form.name} onChange={handleChange} />
      <input placeholder="Email" name="email" value={form.email} onChange={handleChange} />
      <input placeholder="Password" name="password" type="password" value={form.password} onChange={handleChange} />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
