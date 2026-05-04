import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor";

export default function CreateRaffle() {
  const navigate = useNavigate();

  const [raffle, setRaffle] = useState({
    titulo: "",
    descricao_html: "",
    valor_numero: "",
    total_numeros: "",
    data_sorteio: "",
    chave_pix: "",
    tempo_reserva: "",
    link_transmissao: ""
  });

  const [mainImage, setMainImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [prizes, setPrizes] = useState([]);

  // 🧾 Basic fields
  const handleChange = (e) => {
    setRaffle({ ...raffle, [e.target.name]: e.target.value });
  };

  // 🖼 Main image
  const handleMainImage = (e) => {
    setMainImage(e.target.files[0]);
  };

  // 🖼 Gallery (max 5)
  const handleGallery = (e) => {
    const files = Array.from(e.target.files);

    if (gallery.length + files.length > 5) {
      alert("Máximo 5 imagens");
      return;
    }

    setGallery([...gallery, ...files]);
  };

  // 🎁 Add prize
  const addPrize = () => {
    if (prizes.length >= 5) return;

    setPrizes([
      ...prizes,
      {
        titulo: "",
        descricao: "",
        posicao: prizes.length + 1,
        imagem: null
      }
    ]);
  };

  // 🎁 Update prize
  const updatePrize = (index, field, value) => {
    const updated = [...prizes];
    updated[index][field] = value;
    setPrizes(updated);
  };

  // 🎁 Remove prize
  const removePrize = (index) => {
    setPrizes(prizes.filter((_, i) => i !== index));
  };

  // 🚀 Submit
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      // basic fields
      Object.keys(raffle).forEach((key) => {
        formData.append(key, raffle[key]);
      });

      // main image
      if (mainImage) {
        formData.append("imagem_principal", mainImage);
      }

      // gallery
      gallery.forEach((img) => {
        formData.append("galeria", img);
      });

      console.log("SENDING FORM DATA...");

      const res = await api.post("raffles/", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const raffleId = res.data.id;

      // 🎁 create prizes
      for (let prize of prizes) {
        const prizeData = new FormData();
        prizeData.append("titulo", prize.titulo);
        prizeData.append("descricao", prize.descricao);
        prizeData.append("posicao", prize.posicao);

        if (prize.imagem) {
          prizeData.append("imagem", prize.imagem);
        }

        await api.post(`raffles/${raffleId}/premios/`, prizeData);
      }

      alert("Rifa criada!");
      navigate("/my-raffles");

    } catch (err) {
      console.error("ERRO:", err.response?.data);
      alert("Erro ao criar rifa");
    }
  };

  return (
    <div>
      <h2>Criar Rifa</h2>

      {/* 🧾 Basic */}
      <input name="titulo" placeholder="Título" onChange={handleChange} />
      <input name="valor_numero" placeholder="Valor" onChange={handleChange} />
      <input name="total_numeros" placeholder="Total números" onChange={handleChange} />
      <input name="data_sorteio" type="datetime-local" onChange={handleChange} />
      <input name="chave_pix" placeholder="PIX" onChange={handleChange} />
      <input name="tempo_reserva" placeholder="Tempo reserva" onChange={handleChange} />
      <input name="link_transmissao" placeholder="Link transmissão" onChange={handleChange} />

      {/* ✍️ TipTap */}
      <h3>Descrição</h3>
      <RichTextEditor
        value={raffle.descricao_html}
        onChange={(value) =>
          setRaffle({ ...raffle, descricao_html: value })
        }
      />

      {/* 🖼 Images */}
      <h3>Imagem principal</h3>
      <input type="file" onChange={handleMainImage} />

      <h3>Galeria</h3>
      <input type="file" multiple onChange={handleGallery} />

      {/* 🎁 Prizes */}
      <h3>Prêmios</h3>
      <button onClick={addPrize}>Adicionar prêmio</button>

      {prizes.map((p, index) => (
        <div key={index} style={{ border: "1px solid gray", margin: 10 }}>
          <input
            placeholder="Título"
            onChange={(e) => updatePrize(index, "titulo", e.target.value)}
          />
          <input
            placeholder="Descrição"
            onChange={(e) => updatePrize(index, "descricao", e.target.value)}
          />

          <select
            onChange={(e) => updatePrize(index, "posicao", e.target.value)}
          >
            {[1,2,3,4,5].map(n => <option key={n}>{n}</option>)}
          </select>

          <input
            type="file"
            onChange={(e) =>
              updatePrize(index, "imagem", e.target.files[0])
            }
          />

          {p.imagem && (
            <img src={URL.createObjectURL(p.imagem)} width={100} />
          )}

          <button onClick={() => removePrize(index)}>Remover</button>
        </div>
      ))}

      <button onClick={handleSubmit}>Salvar</button>
    </div>
  );
}