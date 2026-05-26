import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const res = await api.post("users/login/", {
        username,
        password,
      });

      // 🔐 SAVE TOKENS
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // 👤 USER DATA FROM BACKEND
      const userData = res.data.user;

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      // ✅ auth context
      if (login) {
        login(userData);
      }

      console.log("USER:", userData);

      // 🚀 REDIRECT BY ROLE
      if (userData.role === "vendedor") {
        navigate("/vendedor");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error(err);
      alert("Login inválido");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}