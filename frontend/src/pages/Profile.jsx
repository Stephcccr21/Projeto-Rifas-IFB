import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

export default function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h2>Profile</h2>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
}