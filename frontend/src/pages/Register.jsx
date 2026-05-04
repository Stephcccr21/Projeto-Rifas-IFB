import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "vendedor", // default
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      const res = await api.post("users/register/", form);

      console.log("SUCCESS:", res.data);
      alert("User registered successfully!");

      // 👉 after register, go to login
      navigate("/");
    } catch (err) {
      console.error("ERROR:", err.response?.data);

      // 👉 show real backend error
      alert(JSON.stringify(err.response?.data));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>

      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />

      <br /><br />

      {/* 👇 Role selection */}
      <select name="role" onChange={handleChange}>
        <option value="vendedor">Vendedor</option>
        <option value="organizador">Organizador</option>
      </select>

      <br /><br />

      <button onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}