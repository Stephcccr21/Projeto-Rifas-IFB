import { useEffect, useState } from "react";
import api from "../api/axios";
import RaffleCard from "../components/RaffleCard";

export default function MyRaffles() {
  const [raffles, setRaffles] = useState([]);

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const res = await api.get("raffles/");
        setRaffles(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRaffles();
  }, []);

  return (
    <div>
      <h2>Minhas Rifas</h2>

      {raffles.length === 0 && <p>Nenhuma rifa encontrada</p>}

      {raffles.map((raffle) => (
        <RaffleCard key={raffle.id} raffle={raffle} />
      ))}
    </div>
  );
}