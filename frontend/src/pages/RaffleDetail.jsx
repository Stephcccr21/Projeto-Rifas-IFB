import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RaffleDetail() {

  const { slug } = useParams();

  const [raffle, setRaffle] = useState(null);

  useEffect(() => {

    const fetchRaffle = async () => {

      console.log("SLUG:", slug);

      console.log(
        "Request URL:",
        `http://127.0.0.1:8000/api/raffles/${slug}/public/`
      );

      try {

        const res = await axios.get(
          `http://127.0.0.1:8000/api/raffles/${slug}/public/`
        );

        console.log("SUCCESS:", res.data);

        setRaffle(res.data);

      } catch (err) {

        console.log(
          "ERRO:",
          err.response?.data
        );

      }

    };

    fetchRaffle();

  }, [slug]);

  if (!raffle) {

    return <p>Carregando...</p>;

  }

  return (

    <div>

      <h2>{raffle.titulo}</h2>

      <p>{raffle.descricao}</p>

      <p>💰 R$ {raffle.valor_numero}</p>

      <p>🎟 {raffle.total_numeros}</p>

      <p>📅 {raffle.data_sorteio}</p>

      <p>
        Status: {
          raffle.is_deleted
            ? "Inativa"
            : raffle.status
        }
      </p>

    </div>

  );

}