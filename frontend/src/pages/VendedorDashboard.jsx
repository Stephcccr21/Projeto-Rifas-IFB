import { useEffect, useState } from "react";
import api from "../services/api";

export default function VendedorDashboard() {
  const [resumo, setResumo] = useState(null);
  const [vendas, setVendas] = useState([]);
  const [rifas, setRifas] = useState([]);
  const [tab, setTab] = useState("todas");
  const [rifaSelecionada, setRifaSelecionada] = useState("");

  useEffect(() => {
    fetchResumo();
    fetchVendas();
    fetchRifas();
  }, []);

  // =====================
  // 📊 RESUMO
  // =====================
  const fetchResumo = async () => {
    try {
      const res = await api.get("sales/vendedor/resumo/");
      setResumo(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // =====================
  // 💰 VENDAS
  // =====================
  const fetchVendas = async () => {
    try {
      const res = await api.get("sales/vendedor/vendas/");

      setVendas(
        Array.isArray(res.data)
          ? res.data
          : res.data.results || []
      );

    } catch (err) {
      console.error(err);
      setVendas([]);
    }
  };

  // =====================
  // 🎟️ RIFAS
  // =====================
  const fetchRifas = async () => {
    try {
      const res = await api.get("sales/vendedor/rifas/");

      setRifas(
        Array.isArray(res.data)
          ? res.data
          : res.data.results || []
      );

    } catch (err) {
      console.error(err);
      setRifas([]);
    }
  };

  // =====================
  // 🎯 FILTER
  // =====================
  const vendasFiltradas =
    tab === "todas"
      ? vendas
      : vendas.filter(
          (v) => String(v.rifa) === String(rifaSelecionada)
        );

  // =====================
  // 🎨 STATUS COLORS
  // =====================
  const getStatusColor = (status) => {
    if (status === "aprovado") return "green";
    if (status === "rejeitado") return "red";
    return "orange";
  };

  // =====================
  // ⏳ LOADING
  // =====================
  if (!resumo) {
    return (
      <div style={{ padding: 20 }}>
        <h2>⏳ Carregando dashboard...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>📊 Dashboard do Vendedor</h1>

      {/* ===================== */}
      {/* 📊 RESUMO */}
      {/* ===================== */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <div style={cardStyle}>
          <h3>🎟️ Total Vendido</h3>
          <p>{resumo.total_vendas || 0}</p>
        </div>

        <div style={cardStyle}>
          <h3>💰 Comissão</h3>
          <p>
            R$ {Number(resumo.comissao_total || 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* ===================== */}
      {/* 🔘 TABS */}
      {/* ===================== */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setTab("todas")}>
          Todas as vendas
        </button>

        <button onClick={() => setTab("rifa")}>
          Por rifa
        </button>
      </div>

      {/* ===================== */}
      {/* 🎟️ SELECT RIFA */}
      {/* ===================== */}
      {tab === "rifa" && (
        <select
          value={rifaSelecionada}
          onChange={(e) => setRifaSelecionada(e.target.value)}
        >
          <option value="">Selecione uma rifa</option>

          {(Array.isArray(rifas) ? rifas : []).map((r) => (
            <option key={r.id} value={r.id}>
              {r.titulo}
            </option>
          ))}
        </select>
      )}

      {/* ===================== */}
      {/* 📋 TABELA */}
      {/* ===================== */}
      <table
        border="1"
        cellPadding="10"
        style={{
          marginTop: 20,
          width: "100%",
          borderCollapse: "collapse"
        }}
      >
        <thead>
          <tr>
            <th>Data</th>
            <th>Rifa</th>
            <th>Número</th>
            <th>Comprador</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {vendasFiltradas.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Nenhuma venda encontrada
              </td>
            </tr>
          ) : (
            vendasFiltradas.map((v) => (
              <tr key={v.id}>
                <td>
                  {v.data
                    ? new Date(v.data).toLocaleDateString()
                    : "-"}
                </td>

                <td>{v.rifa || "-"}</td>

                <td>{v.numero || "-"}</td>

                <td>{v.comprador || "-"}</td>

                <td
                  style={{
                    color: getStatusColor(v.status)
                  }}
                >
                  {v.status || "pendente"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// 🎨 styles
const cardStyle = {
  border: "1px solid #ccc",
  padding: 20,
  borderRadius: 8,
  minWidth: 180,
  textAlign: "center"
};