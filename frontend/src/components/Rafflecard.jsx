import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function RaffleCard({
  raffle,
  onDelete
}) {

  const navigate = useNavigate();

  const realizarSorteio = async () => {

    const confirmar = window.confirm(
      "Deseja realizar o sorteio desta rifa?"
    );

    if (!confirmar) return;

    try {

      await api.post(
        `raffles/${raffle.id}/sortear/`
      );

      alert(
        "Sorteio realizado com sucesso!"
      );

      window.location.reload();

    } catch (err) {

      console.error(err);

      alert(
        err?.response?.data?.erro ||
        "Erro ao realizar sorteio"
      );

    }

  };

  return (

    <div
      style={{
        border: "1px solid #ccc",
        padding: 10,
        margin: 10,
        borderRadius: 8,
        background:
          raffle.is_deleted
            ? "#eee"
            : "#fff",
      }}
    >

      <h3>{raffle.titulo}</h3>

      <p>{raffle.descricao}</p>

      <p>
        💰 R$ {raffle.valor_numero}
      </p>

      <p>
        🎟 {raffle.total_numeros}
        {" "}
        números
      </p>

      <p>
        Status:
        {" "}
        <strong>
          {
            raffle.is_deleted
              ? "Inativa"
              : raffle.status
          }
        </strong>
      </p>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginTop: 15,
        }}
      >

        <button
          onClick={() =>
            navigate(
              `/raffles/${raffle.slug}`
            )
          }
        >
          Ver detalhes
        </button>

        <button
          onClick={() =>
            navigate(
              `/raffles/edit/${raffle.id}`
            )
          }
        >
          Editar
        </button>

        <button
          onClick={() =>
            onDelete(raffle.id)
          }
        >
          🗑 Excluir
        </button>

        {raffle.status === "active" && (

          <button
            onClick={realizarSorteio}
          >
            🎲 Realizar Sorteio
          </button>

        )}

        <button
          onClick={() =>
            navigate(
              `/dashboard/resultados/${raffle.id}`
            )
          }
        >
          Ver Resultado
        </button>

      </div>

    </div>

  );

}