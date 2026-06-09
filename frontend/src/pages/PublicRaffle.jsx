import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function PublicRaffle() {

  const { slug } = useParams();
  const navigate = useNavigate();

  const [rifa, setRifa] = useState(null);

  const [selectedNumbers, setSelectedNumbers] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    comprador_nome: "",
    comprador_email: "",
    comprador_telefone: "",
    comprador_cpf: "",
    vendedor: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {

  fetchRifa();

}, []);

useEffect(() => {

  if (rifa) {

    fetchComments();

  }

}, [rifa]);
  const [comments, setComments] = useState([]);

  const [commentForm, setCommentForm] = useState({
  nome: "",
  email: "",
  texto: "",
  });

  const [sendingComment, setSendingComment] =
  useState(false);

  // =========================
  // 🌎 FETCH RAFFLE
  // =========================
  const fetchRifa = async () => {

    try {

      const res = await fetch(
        `http://127.0.0.1:8000/api/raffles/${slug}/public/`
      );

      const data = await res.json();
      console.log(data);

      setRifa(data);

    } catch (err) {

      console.error(err);

      alert("Erro ao carregar rifa");

    }

  };
  const fetchComments = async () => {

  try {

    const res = await fetch(
      `http://127.0.0.1:8000/api/comments/rifa/${rifa.id}/comentarios/listar/`
    );

    const data = await res.json();

    setComments(data);

  } catch (err) {

    console.error(err);

  }

};

  // =========================
  // 🎨 NUMBER COLORS
  // =========================
  const getNumberColor = (numero) => {

    if (
      selectedNumbers.includes(numero.id)
    ) {
      return "#3b82f6";
    }

    if (numero.status === "pago") {
      return "#22c55e";
    }

    if (
      numero.status === "reservado" ||
      numero.status === "aguardando_aprovacao"
    ) {
      return "#f97316";
    }

    return "#ffffff";
  };

  // =========================
  // 🎟 SELECT NUMBER
  // =========================
  const toggleNumber = (numero) => {

    if (numero.status !== "disponivel") {
      return;
    }

    if (
      selectedNumbers.includes(numero.id)
    ) {

      setSelectedNumbers(
        selectedNumbers.filter(
          (id) => id !== numero.id
        )
      );

    } else {

      setSelectedNumbers([
        ...selectedNumbers,
        numero.id
      ]);

    }

  };

  // =========================
  // 📊 TOTALS
  // =========================
  const total = useMemo(() => {

    if (!rifa) return 0;

    return (
      selectedNumbers.length *
      Number(rifa.valor_numero)
    );

  }, [selectedNumbers, rifa]);

  // =========================
  // 📊 PROGRESS
  // =========================
  const totalNumeros =
    rifa?.numeros?.length || 0;

  const pagos =
    rifa?.numeros?.filter(
      (n) => n.status === "pago"
    ).length || 0;

  const progresso =
    totalNumeros > 0
      ? (pagos / totalNumeros) * 100
      : 0;

  // =========================
  // ✅ VALIDATION
  // =========================
  const validateField = (
    name,
    value
  ) => {

    let error = "";

    if (!value.trim()) {

      error = "Campo obrigatório";

    } else {

      if (
        name === "comprador_email" &&
        !/\S+@\S+\.\S+/.test(value)
      ) {
        error = "Email inválido";
      }

      if (
        name === "comprador_telefone" &&
        value.replace(/\D/g, "").length < 10
      ) {
        error = "Telefone inválido";
      }

      if (
        name === "comprador_cpf" &&
        value.replace(/\D/g, "").length !== 11
      ) {
        error = "CPF inválido";
      }

    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error === "";

  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);

  };

  // =========================
  // 🛒 RESERVE NUMBERS
  // =========================
  const reservarNumeros = async () => {

    let valid = true;

    Object.entries(form).forEach(
      ([key, value]) => {

        if (key !== "vendedor") {

          const ok = validateField(
            key,
            value
          );

          if (!ok) valid = false;

        }

      }
    );

    if (!valid) {

      alert("Corrija os erros");

      return;

    }

    try {

      setLoading(true);

      const raffleId = rifa.id;

      const response = await fetch(
        `http://127.0.0.1:8000/api/raffles/${raffleId}/reservar/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            numeros: selectedNumbers,
            comprador_nome: form.comprador_nome,
            comprador_email: form.comprador_email,
            comprador_telefone: form.comprador_telefone,
            comprador_cpf: form.comprador_cpf,
            vendedor_id: form.vendedor || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.erro || "Erro ao reservar"
        );

      }
      const transactionId =
  data.transacao_id;

navigate(
  `/checkout/${transactionId}`
);

    } catch (err) {

      console.error(err);

      alert(err.message);

    } finally {

      setLoading(false);

    }

  };
const enviarComentario = async () => {

  try {

    setSendingComment(true);

    const response = await fetch(
      `http://127.0.0.1:8000/api/comments/rifa/${rifa.id}/comentarios/`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          commentForm
        ),
      }
    );

    if (!response.ok) {

      throw new Error(
        "Erro ao enviar comentário"
      );

    }

    alert(
      "Comentário enviado para moderação"
    );

    setCommentForm({
      nome: "",
      email: "",
      texto: "",
    });

  } catch (err) {

    alert(err.message);

  } finally {

    setSendingComment(false);

  }

};
  if (!rifa) {

    return (
      <div style={{ padding: 20 }}>
        <h2>Carregando rifa...</h2>
      </div>
    );

  }

  return (

    <div
      style={{
        display: "flex",
        gap: 30,
        alignItems: "flex-start",
        padding: 20,
        maxWidth: 1600,
        margin: "0 auto",
      }}
    >

      {/* LEFT */}
      <div style={{ flex: 1 }}>

        <div style={{ marginBottom: 30 }}>

          <h1>{rifa.titulo}</h1>

          <p>
            <strong>Valor:</strong>
            {" "}
            R$ {rifa.valor_numero}
          </p>

          <p>
            <strong>Data:</strong>
            {" "}
            {
              new Date(
                rifa.data_sorteio
              ).toLocaleDateString()
            }
          </p>

          <div
            dangerouslySetInnerHTML={{
              __html:
                rifa.descricao_html ||
                rifa.descricao,
            }}
          />

        </div>

        {/* PROGRESS */}
        <div style={{ marginBottom: 30 }}>

          <h3>
            Progresso:
            {" "}
            {pagos}
            {" / "}
            {totalNumeros}
          </h3>

          <div
            style={{
              width: "100%",
              height: 30,
              background: "#ddd",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >

            <div
              style={{
                width: `${progresso}%`,
                height: "100%",
                background: "#22c55e",
              }}
            />

          </div>

        </div>

        {/* NUMBERS */}
        <div>

          <h2>
            🎟️ Escolha seus números
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(10, 1fr)",
              gap: 8,
            }}
          >

            {rifa.numeros?.map((numero) => (

              <button
                key={numero.id}
                onClick={() =>
                  toggleNumber(numero)
                }
                style={{
                  background:
                    getNumberColor(numero),
                  border: "1px solid #ccc",
                  padding: 12,
                  borderRadius: 8,
                  cursor:
                    numero.status ===
                    "disponivel"
                      ? "pointer"
                      : "not-allowed",
                  fontWeight: "bold",
                }}
              >
                {numero.numero}
              </button>

            ))}

          </div>

                </div>

        {/* =========================
            💬 COMENTÁRIOS
        ========================= */}

        <div style={{ marginTop: 50 }}>

          <h2>💬 Comentários</h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 30,
            }}
          >

            <input
              placeholder="Seu nome"
              value={commentForm.nome}
              onChange={(e) =>
                setCommentForm({
                  ...commentForm,
                  nome: e.target.value,
                })
              }
            />

            <input
              placeholder="Seu email"
              value={commentForm.email}
              onChange={(e) =>
                setCommentForm({
                  ...commentForm,
                  email: e.target.value,
                })
              }
            />

            <textarea
              rows={4}
              placeholder="Digite seu comentário"
              value={commentForm.texto}
              onChange={(e) =>
                setCommentForm({
                  ...commentForm,
                  texto: e.target.value,
                })
              }
            />

            <button
              onClick={enviarComentario}
              disabled={sendingComment}
            >
              {
                sendingComment
                  ? "Enviando..."
                  : "Enviar comentário"
              }
            </button>

          </div>

          <h3>
            Comentários aprovados
          </h3>

          {comments.length === 0 && (

            <p>
              Nenhum comentário ainda.
            </p>

          )}

          {comments.map((comment) => (

            <div
              key={comment.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 15,
                marginBottom: 10,
              }}
            >

              <strong>
                {comment.nome}
              </strong>

              <p>
                {comment.texto}
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* CART */}
      <div
        style={{
          width: 350,
          position: "sticky",
          top: 20,
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 20,
          background: "#fff",
          height: "fit-content",
        }}
      >

        <h2>🛒 Carrinho</h2>

        <p>
          Quantidade:
          {" "}
          <strong>
            {selectedNumbers.length}
          </strong>
        </p>

        <p>
          Total:
          {" "}
          <strong>
            R$ {total.toFixed(2)}
          </strong>
        </p>

        {!showForm ? (

          <button
            disabled={
              selectedNumbers.length === 0
            }
            onClick={() =>
              setShowForm(true)
            }
            style={{
              width: "100%",
              padding: 14,
              background:
                selectedNumbers.length === 0
                  ? "#999"
                  : "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Continuar
          </button>

        ) : (

          <div>

            <h3>
              Dados do comprador
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >

              <input
                name="comprador_nome"
                placeholder="Nome"
                value={form.comprador_nome}
                onChange={handleChange}
              />

              <input
                name="comprador_email"
                placeholder="Email"
                value={form.comprador_email}
                onChange={handleChange}
              />

              <input
                name="comprador_telefone"
                placeholder="Telefone"
                value={form.comprador_telefone}
                onChange={handleChange}
              />

              <input
                name="comprador_cpf"
                placeholder="CPF"
                value={form.comprador_cpf}
                onChange={handleChange}
              />

              <button
                onClick={reservarNumeros}
                disabled={loading}
                style={{
                  padding: 14,
                  background: "#22c55e",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                {
                  loading
                    ? "Reservando..."
                    : "Reservar números"
                }
              </button>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}