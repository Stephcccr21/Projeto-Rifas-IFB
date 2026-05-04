import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function RaffleDetail() {
  const { id } = useParams();
  const [raffle, setRaffle] = useState(null);

  useEffect(() => {
    const fetchRaffle = async () => {
      console.log("TOKEN:", localStorage.getItem("token"));
      console.log("ID:", id);
      console.log("Request URL:", `raffles/${id}/`);

      try {
        const res = await api.get(`raffles/${id}/`);
        console.log("SUCCESS:", res.data);
        setRaffle(res.data);
      } catch (err) {
        console.log("ERRO:", err.response?.data);
      }
    };

    fetchRaffle();
  }, [id]);

  if (!raffle) return <p>Carregando...</p>;

  return (
    <div>
      <h2>{raffle.titulo}</h2>
      <p>{raffle.descricao}</p>

      <p>💰 R$ {raffle.valor_numero}</p>
      <p>🎟 {raffle.total_numeros}</p>
      <p>📅 {raffle.data_sorteio}</p>

      <p>Status: {raffle.is_deleted ? "Inativa" : raffle.status}</p>
    </div>
  );
  if (isNaN(id)) {
  return <p>ID inválido</p>;
}
}