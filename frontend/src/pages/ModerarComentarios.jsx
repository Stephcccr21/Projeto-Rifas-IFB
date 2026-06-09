import { useEffect, useState } from "react";

export default function ModerarComentarios() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("access");

      const response = await fetch(
        "http://127.0.0.1:8000/api/comments/organizador/comentarios/pendentes/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const aprovar = async (id) => {
    try {
      const token = localStorage.getItem("access");

      const response = await fetch(
        `http://127.0.0.1:8000/api/comments/comentarios/${id}/aprovar/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao aprovar comentário");
      }

      setComments((prev) =>
        prev.filter((c) => c.id !== id)
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const rejeitar = async (id) => {
    try {
      const token = localStorage.getItem("access");

      const response = await fetch(
        `http://127.0.0.1:8000/api/comments/comentarios/${id}/rejeitar/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao rejeitar comentário");
      }

      setComments((prev) =>
        prev.filter((c) => c.id !== id)
      );
    } catch (err) {
      alert(err.message);
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
        maxWidth: 1000,
        margin: "0 auto",
        padding: 30,
      }}
    >
      <h1>Moderar Comentários</h1>

      {comments.length === 0 && (
        <p>Nenhum comentário pendente.</p>
      )}

      {comments.map((comment) => (
        <div
          key={comment.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            background: "#fff",
          }}
        >
          <h3>{comment.nome}</h3>

          <p>{comment.texto}</p>

          <p>
            <strong>Email:</strong> {comment.email}
          </p>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 15,
            }}
          >
            <button
              onClick={() => aprovar(comment.id)}
              style={{
                background: "#22c55e",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Aprovar
            </button>

            <button
              onClick={() => rejeitar(comment.id)}
              style={{
                background: "#ef4444",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Rejeitar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}