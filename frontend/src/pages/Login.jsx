import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // 👈
  const { login } = useContext(AuthContext);

const handleLogin = async () => {
  try {
    const res = await api.post("users/login/", {
      username,
      password,
    });

    // 🔥 FIX HERE
    localStorage.setItem("token", res.data.access);

    // you NEED user data (fake for now if backend doesn't return it)
   const userData = {
      username: username,
      role: "organizador",
};

   login(userData, res.data.access); // ✅ use context

   navigate("/dashboard");

    localStorage.setItem("user", JSON.stringify(userData));

    navigate("/dashboard");

  } catch (err) {
     console.log("FULL ERROR:", err.response);
     console.log("DATA:", err.response?.data);
     alert("Login failed");
  }
};

  return (
    <div>
      <h2>Login</h2>

      <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}