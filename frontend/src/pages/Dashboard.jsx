import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [raffles, setRaffles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🔒 protect route
    if (!token) {
      navigate("/");
      return;
    }

    // 📡 fetch raffles
    api.get("raffles/")
      .then((res) => {
        setRaffles(res.data);
      })
      .catch((err) => {
        console.error(err);
        alert("Error loading raffles");
      });

  }, []);

  return (
    <div>
      <h2>My Raffles</h2>

      {raffles.length === 0 ? (
        <p>No raffles yet</p>
      ) : (
        raffles.map((r) => (
          <div key={r.id} style={{ border: "1px solid #ccc", margin: "10px" }}>
            <h3>{r.titulo}</h3>
            <p>{r.descricao}</p>
            <p>R$ {r.valor_numero}</p>
          </div>
        ))
      )}
    </div>
  );
}