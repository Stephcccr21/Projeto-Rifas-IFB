import { useEffect, useState } from "react";
import api from "../api/axios";
import RaffleCard from "../components/RaffleCard";

export default function MyRaffles() {

  const [raffles, setRaffles] = useState([]);

  const fetchRaffles = async () => {

    try {

      const res = await api.get(
        "raffles/"
      );

      setRaffles(
        res.data.results || res.data
      );

    } catch (err) {

      console.error(err);

    }

  };

  useEffect(() => {

    fetchRaffles();

  }, []);

  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      "Deseja realmente excluir esta rifa?"
    );

    if (!confirmed) return;

    try {

      const res = await api.delete(
        `raffles/${id}/`
      );

      alert(
        res.data?.mensagem ||
        "Rifa excluída"
      );

      setRaffles(
        raffles.filter(
          (raffle) => raffle.id !== id
        )
      );

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.erro ||
        "Erro ao excluir rifa"
      );

    }

  };

  return (

    <div>

      <h2>Minhas Rifas</h2>

      {raffles.length === 0 && (

        <p>Nenhuma rifa encontrada</p>

      )}

      {raffles.map((raffle) => (

        <RaffleCard
          key={raffle.id}
          raffle={raffle}
          onDelete={handleDelete}
        />

      ))}

    </div>

  );

}