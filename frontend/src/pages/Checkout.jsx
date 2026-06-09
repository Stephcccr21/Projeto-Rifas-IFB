import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Checkout() {

  const { transactionId } = useParams();

  const navigate = useNavigate();

  const [transaction, setTransaction] =
    useState(null);

  const [timeLeft, setTimeLeft] =
    useState(0);

  const [file, setFile] =
    useState(null);

  const [preview, setPreview] =
    useState(null);

  const [uploaded, setUploaded] =
    useState(false);

  // =========================
  // LOAD TRANSACTION
  // =========================

  useEffect(() => {

    fetchTransaction();

  }, []);

  const fetchTransaction = async () => {

    try {

      const res = await fetch(
        `http://127.0.0.1:8000/api/sales/transacao/${transactionId}/`
      );

      const data = await res.json();

      setTransaction(data);

    } catch (err) {

      console.error(err);

      alert(
        "Erro ao carregar transação"
      );

    }

  };

  // =========================
  // COUNTDOWN
  // =========================

  useEffect(() => {

    if (!transaction) return;

    const interval = setInterval(() => {

      const diff =
        new Date(
          transaction.data_expiracao
        ) - new Date();

      if (diff <= 0) {

        clearInterval(interval);

        alert(
          "Reserva expirada"
        );

        navigate("/");

        return;

      }

      setTimeLeft(diff);

    }, 1000);

    return () =>
      clearInterval(interval);

  }, [transaction]);

  const minutes =
    Math.floor(timeLeft / 60000);

  const seconds =
    Math.floor(
      (timeLeft % 60000) / 1000
    );

  // =========================
  // FILE SELECT
  // =========================

  const handleFile = (e) => {

    const selected =
      e.target.files[0];

    if (!selected) return;

    setFile(selected);

    if (
      selected.type.startsWith(
        "image/"
      )
    ) {

      setPreview(
        URL.createObjectURL(
          selected
        )
      );

    }

  };

  // =========================
  // UPLOAD
  // =========================

  const enviarComprovante =
    async () => {

      if (!file) {

        alert(
          "Selecione um arquivo"
        );

        return;

      }

      try {

        const formData =
          new FormData();

        formData.append(
          "comprovante",
          file
        );

        const response =
          await fetch(
            `http://127.0.0.1:8000/api/sales/transacao/${transactionId}/comprovante/`,
            {
              method: "POST",
              body: formData,
            }
          );

        const data =
          await response.json();

        if (!response.ok) {

          throw new Error(
            data.erro ||
            "Erro ao enviar"
          );

        }

        setUploaded(true);

      } catch (err) {

        console.error(err);

        alert(err.message);

      }

    };

  // =========================
  // LOADING
  // =========================

  if (!transaction) {

    return (
      <div style={{ padding: 30 }}>
        <h2>
          Carregando...
        </h2>
      </div>
    );

  }

  // =========================
  // UI
  // =========================

  return (

    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: 30,
      }}
    >

      <h1>
        Finalizar Compra
      </h1>

      {/* TIMER */}

      <div
        style={{
          background: "#fef3c7",
          padding: 20,
          borderRadius: 12,
          marginBottom: 20,
        }}
      >

        <h2>
          ⏰
          {" "}
          {minutes}
          :
          {String(seconds)
            .padStart(2, "0")}
        </h2>

        <p>
          Tempo restante para
          pagamento
        </p>

      </div>

      {/* PIX */}

      <div
        style={{
          border: "2px solid #22c55e",
          padding: 20,
          borderRadius: 12,
          marginBottom: 20,
        }}
      >

        <h2>
          Chave PIX
        </h2>

        <h1>
          {transaction.pix_key}
        </h1>

      </div>

      {/* NUMBERS */}

      <div
        style={{
          marginBottom: 20,
        }}
      >

        <h2>
          Números reservados
        </h2>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >

          {transaction.numeros.map(
            (numero) => (

              <span
                key={numero}
                style={{
                  padding:
                    "8px 12px",
                  border:
                    "1px solid #ddd",
                  borderRadius: 8,
                }}
              >
                {numero}
              </span>

            )
          )}

        </div>

      </div>

      {/* TOTAL */}

      <h2>
        Total:
        {" "}
        R$
        {" "}
        {transaction.valor_total}
      </h2>

      {/* UPLOAD */}

      {!uploaded && (

        <div
          style={{
            marginTop: 30,
          }}
        >

          <h2>
            Enviar comprovante
          </h2>

          <input
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleFile}
          />

          {preview && (

            <div
              style={{
                marginTop: 20,
              }}
            >

              <img
                src={preview}
                alt="preview"
                style={{
                  width: 300,
                  borderRadius: 12,
                }}
              />

            </div>

          )}

          <button
            onClick={
              enviarComprovante
            }
            style={{
              marginTop: 20,
              padding:
                "12px 20px",
              background:
                "#22c55e",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Enviar comprovante
          </button>

        </div>

      )}

      {/* SUCCESS */}

      {uploaded && (

        <div
          style={{
            marginTop: 30,
            background:
              "#dcfce7",
            padding: 20,
            borderRadius: 12,
          }}
        >

          <h2>
            ✅ Comprovante enviado!
          </h2>

          <p>
            Aguardando aprovação.
          </p>

        </div>

      )}

    </div>

  );

}