import { useState } from "react";
import api from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    await api.post("users/auth/password-reset/", { email });
    alert("Email sent!");
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
}