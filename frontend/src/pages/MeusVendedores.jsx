import { useEffect, useState } from "react";
import api from "../services/api";

export default function MeusVendedores() {
  const [vendedores, setVendedores] = useState([]);
  const [rifas, setRifas] = useState([]);

  const [form, setForm] = useState({
    nome: "",
    username: "",
    email: "",
    telefone: "",
    comissao_fixa: ""
  });

  useEffect(() => {
    fetchVendedores();
    fetchRifas();
  }, []);

  const fetchVendedores = async () => {
    const res = await api.get("sales/vendedores/");
    setVendedores(res.data);
  };

  const fetchRifas = async () => {
    const res = await api.get("raffles/");
    setRifas(res.data);
  };

  // ✅ CREATE
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("sales/vendedores/", form);

      const { username, password } = res.data;

      alert(`✅ Vendedor criado!

Usuário: ${username}
Senha: ${password}`);

      setForm({
        nome: "",
        username: "",
        email: "",
        telefone: "",
        comissao_fixa: ""
      });

      fetchVendedores();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Erro ao criar vendedor");
    }
  };

  // ✅ ASSOCIATE / REMOVE RIFA
  const toggleRifa = async (vendedorId, rifaId, isChecked) => {
    try {
      if (isChecked) {
        await api.post(`sales/vendedores/${vendedorId}/associar_rifa/`, {
          rifa_id: rifaId
        });
      } else {
        await api.delete(`sales/vendedores/${vendedorId}/remover_rifa/`, {
          data: { rifa_id: rifaId }
        });
      }

      fetchVendedores();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ ACTIVATE / DEACTIVATE
  const toggleAtivo = async (v) => {
    await api.patch(`sales/vendedores/${v.id}/`, {
      ativo: !v.ativo
    });

    fetchVendedores();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>👤 Meus Vendedores</h1>

      {/* FORM */}
      <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
        
        <input
          placeholder="Nome"
          value={form.nome}
          onChange={(e) =>
            setForm({ ...form, nome: e.target.value })
          }
        />

        <input
          placeholder="Username (login)"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          placeholder="Telefone"
          value={form.telefone}
          onChange={(e) =>
            setForm({ ...form, telefone: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Comissão"
          value={form.comissao_fixa}
          onChange={(e) =>
            setForm({ ...form, comissao_fixa: e.target.value })
          }
        />

        <button type="submit">Cadastrar</button>
      </form>

      <hr />

      {/* LIST */}
      {vendedores.map((v) => (
        <div
          key={v.id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10
          }}
        >
          {/* ✅ FIXED */}
          <h3>{v.nome}</h3>

          <p>Email: {v.email}</p>
          <p>Telefone: {v.telefone}</p>
          <p>Comissão: R$ {v.comissao_fixa}</p>
          <p>Status: {v.ativo ? "Ativo" : "Inativo"}</p>

          <button onClick={() => toggleAtivo(v)}>
            {v.ativo ? "Desativar" : "Ativar"}
          </button>

          <h4>🎟️ Rifas</h4>

          {rifas.map((r) => (
            <label key={r.id} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={false} // normal for now
                onChange={(e) =>
                  toggleRifa(v.id, r.id, e.target.checked)
                }
              />
              {r.titulo}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}