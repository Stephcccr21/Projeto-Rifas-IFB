import { useEffect, useState } from "react";

export default function PendingPayments() {

  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedReceipt, setSelectedReceipt] =
    useState(null);

  const [selectedReject, setSelectedReject] =
    useState(null);

  const [motivo, setMotivo] =
    useState("");

  const [hasNew, setHasNew] =
    useState(false);

  const [lastCount, setLastCount] =
    useState(0);

  // =========================
  // FETCH
  // =========================

  const fetchTransactions = async () => {

    try {

      const token =
        localStorage.getItem("access");

      const response =
        await fetch(
          "http://127.0.0.1:8000/api/sales/organizador/transacoes/pendentes/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (
        lastCount > 0 &&
        data.length > lastCount
      ) {

        setHasNew(true);

      }

      setLastCount(data.length);

      setTransactions(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchTransactions();

  }, []);

  // =========================
  // AUTO REFRESH
  // =========================

  useEffect(() => {

    const interval =
      setInterval(() => {

        fetchTransactions();

      }, 30000);

    return () =>
      clearInterval(interval);

  }, [lastCount]);

  // =========================
  // APPROVE
  // =========================

  const aprovar = async (id) => {

    const confirmacao =
      window.confirm(
        "Confirmar aprovação?"
      );

    if (!confirmacao) return;

    try {

      const token =
        localStorage.getItem("access");

      const response =
        await fetch(
          `http://127.0.0.1:8000/api/sales/transacao/${id}/aprovar/`,
          {
            method: "POST",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      if (!response.ok) {

        throw new Error(
          "Erro ao aprovar"
        );

      }

      fetchTransactions();

      alert(
        "Pagamento aprovado"
      );

    } catch (err) {

      console.error(err);

      alert(err.message);

    }

  };

  // =========================
  // REJECT
  // =========================

  const rejeitar = async () => {

    try {

      const token =
        localStorage.getItem("access");

      const response =
        await fetch(
          `http://127.0.0.1:8000/api/sales/transacao/${selectedReject.id}/rejeitar/`,
          {
            method: "POST",

            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              motivo,
            }),
          }
        );

      if (!response.ok) {

        throw new Error(
          "Erro ao rejeitar"
        );

      }

      setSelectedReject(null);

      setMotivo("");

      fetchTransactions();

      alert(
        "Transação rejeitada"
      );

    } catch (err) {

      console.error(err);

      alert(err.message);

    }

  };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div style={{ padding: 30 }}>

        <h2>
          Carregando...
        </h2>

      </div>

    );

  }

  return (

    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: 30,
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >

        <h1>
          Pagamentos Pendentes
        </h1>

        <div
          style={{
            fontSize: 28,
          }}
        >
          🔔

          {hasNew && (

            <span
              style={{
                color: "red",
                marginLeft: 10,
                fontSize: 16,
              }}
            >
              Novo comprovante
            </span>

          )}

        </div>

      </div>

      {transactions.length === 0 && (

        <div>

          <h3>
            Nenhum pagamento pendente
          </h3>

        </div>

      )}

      <div
        style={{
          display: "grid",
          gap: 20,
        }}
      >

        {transactions.map((t) => (

          <div
            key={t.id}
            style={{
              border:
                "1px solid #ddd",
              borderRadius: 12,
              padding: 20,
              background: "#fff",
            }}
          >

            <h2>
              {t.comprador_nome}
            </h2>

            <p>
              <strong>Email:</strong>
              {" "}
              {t.comprador_email}
            </p>

            <p>
              <strong>Telefone:</strong>
              {" "}
              {t.comprador_telefone}
            </p>

            <p>
              <strong>Valor:</strong>
              {" "}
              R$ {t.valor_total}
            </p>

            <p>
              <strong>Números:</strong>
              {" "}
              {t.numeros.join(", ")}
            </p>

            <p>
              <strong>Vendedor:</strong>
              {" "}
              {t.vendedor || "Sem vendedor"}
            </p>

            {t.comprovante && (

              <div
                style={{
                  marginTop: 20,
                }}
              >

                <img
                  src={`http://127.0.0.1:8000${t.comprovante}`}
                  alt=""
                  style={{
                    width: 150,
                    borderRadius: 10,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setSelectedReceipt(t)
                  }
                />

              </div>

            )}

            <div
              style={{
                marginTop: 20,
                display: "flex",
                gap: 10,
              }}
            >

              <button
                onClick={() =>
                  aprovar(t.id)
                }
                style={{
                  background:
                    "#22c55e",
                  color: "#fff",
                  border: "none",
                  padding:
                    "10px 20px",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Aprovar
              </button>

              <button
                onClick={() =>
                  setSelectedReject(t)
                }
                style={{
                  background:
                    "#ef4444",
                  color: "#fff",
                  border: "none",
                  padding:
                    "10px 20px",
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

      {selectedReceipt && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,.7)",
            display: "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
          }}
        >

          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 12,
              maxWidth: 900,
            }}
          >

            <button
              onClick={() =>
                setSelectedReceipt(null)
              }
            >
              Fechar
            </button>

            <img
              src={`http://127.0.0.1:8000${selectedReceipt.comprovante}`}
              alt=""
              style={{
                width: "100%",
                marginTop: 20,
              }}
            />

          </div>

        </div>

      )}

      {selectedReject && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,.7)",
            display: "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
          }}
        >

          <div
            style={{
              background: "#fff",
              padding: 30,
              borderRadius: 12,
              width: 500,
            }}
          >

            <h2>
              Motivo da rejeição
            </h2>

            <textarea
              value={motivo}
              onChange={(e) =>
                setMotivo(
                  e.target.value
                )
              }
              rows={5}
              style={{
                width: "100%",
                marginTop: 20,
              }}
            />

            <div
              style={{
                marginTop: 20,
                display: "flex",
                gap: 10,
              }}
            >

              <button
                onClick={rejeitar}
              >
                Confirmar
              </button>

              <button
                onClick={() =>
                  setSelectedReject(null)
                }
              >
                Cancelar
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}