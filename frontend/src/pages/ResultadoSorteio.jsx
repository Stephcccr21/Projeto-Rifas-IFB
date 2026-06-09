import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ResultadoSorteio() {

  const { id } = useParams();

  const [resultados, setResultados] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchResultados();

  }, []);

  const fetchResultados = async () => {

    try {

      const token =
        localStorage.getItem("access");

      const response = await fetch(
        `http://127.0.0.1:8000/api/raffles/${id}/resultados/`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      setResultados(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (
      <div style={{ padding: 30 }}>
        <h2>Carregando...</h2>
      </div>
    );

  }

  return (

    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 30,
      }}
    >

      <h1>
        Resultado do Sorteio
      </h1>

      {resultados.length === 0 && (

        <p>
          Nenhum resultado encontrado.
        </p>

      )}

      {resultados.map((r) => (

        <div
          key={r.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 10,
            padding: 20,
            marginBottom: 20,
          }}
        >

          <h3>
            🎁 {r.premio_nome}
          </h3>

          <p>
            <strong>Número:</strong>
            {" "}
            {r.numero}
          </p>

          <p>
            <strong>Ganhador:</strong>
            {" "}
            {r.comprador_nome}
          </p>

        </div>

      ))}

    </div>

  );

}