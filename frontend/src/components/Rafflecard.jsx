import { useNavigate } from "react-router-dom";

export default function RaffleCard({ raffle }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 10,
        margin: 10,
        borderRadius: 8,
        background: raffle.is_deleted ? "#eee" : "#fff",
      }}
    >
      <h3>{raffle.titulo}</h3>
      <p>{raffle.descricao}</p>

      <p>💰 R$ {raffle.valor_numero}</p>
      <p>🎟 {raffle.total_numeros} números</p>

      <p>
        Status:{" "}
        <strong>
          {raffle.is_deleted ? "Inativa" : raffle.status}
        </strong>
      </p>

      <button onClick={() => navigate(`/raffles/${raffle.slug}`)}>
        Ver detalhes
      </button>
    </div>
  );
}