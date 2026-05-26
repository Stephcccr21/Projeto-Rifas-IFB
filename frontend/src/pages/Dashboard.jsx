import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();

  const [raffles, setRaffles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access");

    // 🔒 protect route
    if (!token) {
      navigate("/");
      return;
    }

    fetchRaffles();
  }, [navigate]);

  const fetchRaffles = async () => {
    try {
      const res = await api.get("raffles/");

      console.log("RAFFLES RESPONSE:", res.data);

      // ✅ ALWAYS FORCE ARRAY
      if (Array.isArray(res.data)) {
        setRaffles(res.data);

      } else if (Array.isArray(res.data.results)) {
        setRaffles(res.data.results);

      } else {
        setRaffles([]);
      }

    } catch (err) {
      console.error(err);
      setRaffles([]);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🎟️ My Raffles</h2>

      {!Array.isArray(raffles) || raffles.length === 0 ? (
        <p>No raffles yet</p>
      ) : (
        raffles.map((r) => (
          <div
            key={r.id}
            style={{
              border: "1px solid #ccc",
              marginBottom: 10,
              padding: 15,
              borderRadius: 8
            }}
          >
            <h3>{r.titulo}</h3>

            <p>{r.descricao}</p>

            <p>
              <strong>Preço:</strong> R$ {r.valor_numero}
            </p>
          </div>
        ))
      )}
    </div>
  );
}