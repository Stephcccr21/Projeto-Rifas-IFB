import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor";

export default function CreateRaffle() {

  const navigate = useNavigate();

  const [raffle, setRaffle] = useState({
    titulo: "",
    descricao: "",
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

  // =========================
  // 🧾 BASIC FIELDS
  // =========================
  const handleChange = (e) => {

    setRaffle({
      ...raffle,
      [e.target.name]: e.target.value
    });

  };

  // =========================
  // 🖼 MAIN IMAGE
  // =========================
  const handleMainImage = (e) => {

    setMainImage(
      e.target.files[0]
    );

  };

  // =========================
  // 🖼 GALLERY
  // =========================
  const handleGallery = (e) => {

    const files = Array.from(
      e.target.files
    );

    if (gallery.length + files.length > 5) {

      alert("Máximo 5 imagens");

      return;

    }

    setGallery([
      ...gallery,
      ...files
    ]);

  };

  // =========================
  // 🎁 ADD PRIZE
  // =========================
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

  // =========================
  // 🎁 UPDATE PRIZE
  // =========================
  const updatePrize = (
    index,
    field,
    value
  ) => {

    const updated = [...prizes];

    updated[index][field] = value;

    setPrizes(updated);

  };

  // =========================
  // 🎁 REMOVE PRIZE
  // =========================
  const removePrize = (index) => {

    setPrizes(
      prizes.filter((_, i) => i !== index)
    );

  };

  // =========================
  // 🚀 SUBMIT
  // =========================
  const handleSubmit = async () => {

    try {

      const formData = new FormData();

      // =========================
      // BASIC FIELDS
      // =========================
      formData.append(
        "titulo",
        raffle.titulo
      );

      formData.append(
        "descricao",
        raffle.descricao_html.replace(/<[^>]*>/g, "")
      );

      formData.append(
        "descricao_html",
        raffle.descricao_html
      );

      formData.append(
        "valor_numero",
        raffle.valor_numero
      );

      formData.append(
        "total_numeros",
        raffle.total_numeros
      );

      formData.append(
        "data_sorteio",
        raffle.data_sorteio
      );

      formData.append(
        "chave_pix",
        raffle.chave_pix
      );

      formData.append(
        "tempo_reserva",
        raffle.tempo_reserva
      );

      formData.append(
        "link_transmissao",
        raffle.link_transmissao
      );

      // =========================
      // MAIN IMAGE
      // =========================
      if (mainImage) {

        formData.append(
          "imagem_principal",
          mainImage
        );

      }

      // =========================
      // GALLERY
      // =========================
      gallery.forEach((img) => {

        formData.append(
          "galeria",
          img
        );

      });

      console.log(
        "SENDING FORM DATA..."
      );

      // =========================
      // CREATE RAFFLE
      // =========================
      const res = await api.post(
        "raffles/",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      console.log(
        "RAFFLE CREATED:",
        res.data
      );

      const raffleId = res.data.id;

      // =========================
      // CREATE PRIZES
      // =========================
      for (let prize of prizes) {

        const prizeData = new FormData();

        prizeData.append(
          "rifa",
          raffleId
        );

        prizeData.append(
          "titulo",
          prize.titulo
        );

        prizeData.append(
          "descricao",
          prize.descricao
        );

        prizeData.append(
          "posicao",
          prize.posicao
        );

        if (prize.imagem) {

          prizeData.append(
            "imagem",
            prize.imagem
          );

        }

       await api.post(
  "premios/",
  prizeData,
  {
    headers: {
      "Content-Type":
        "multipart/form-data"
    }
  }
);
      }

      alert("Rifa criada!");

      navigate("/my-raffles");

    } catch (err) {

      console.log(
        "FULL ERROR:",
        err
      );

      console.log(
        "ERROR DATA:",
        JSON.stringify(
          err.response?.data,
          null,
          2
        )
      );

    }

  };

  return (

    <div>

      <h2>Criar Rifa</h2>

      {/* 🧾 BASIC */}

      <input
        name="titulo"
        placeholder="Título"
        onChange={handleChange}
      />

      <input
        name="valor_numero"
        placeholder="Valor"
        onChange={handleChange}
      />

      <input
        name="total_numeros"
        placeholder="Total números"
        onChange={handleChange}
      />

      <input
        name="data_sorteio"
        type="datetime-local"
        onChange={handleChange}
      />

      <input
        name="chave_pix"
        placeholder="PIX"
        onChange={handleChange}
      />

      <input
        name="tempo_reserva"
        placeholder="Tempo reserva"
        onChange={handleChange}
      />

      <input
        name="link_transmissao"
        placeholder="Link transmissão"
        onChange={handleChange}
      />

      {/* ✍️ EDITOR */}

      <h3>Descrição</h3>

      <RichTextEditor
        value={raffle.descricao_html}
        onChange={(value) =>
          setRaffle({
            ...raffle,
            descricao_html: value
          })
        }
      />

      {/* 🖼 MAIN IMAGE */}

      <h3>Imagem principal</h3>

      <input
        type="file"
        onChange={handleMainImage}
      />

      {/* 🖼 GALLERY */}

      <h3>Galeria</h3>

      <input
        type="file"
        multiple
        onChange={handleGallery}
      />

      {/* 🎁 PRIZES */}

      <h3>Prêmios</h3>

      <button onClick={addPrize}>
        Adicionar prêmio
      </button>

      {prizes.map((p, index) => (

        <div
          key={index}
          style={{
            border: "1px solid gray",
            margin: 10,
            padding: 10
          }}
        >

          <input
            placeholder="Título"
            onChange={(e) =>
              updatePrize(
                index,
                "titulo",
                e.target.value
              )
            }
          />

          <input
            placeholder="Descrição"
            onChange={(e) =>
              updatePrize(
                index,
                "descricao",
                e.target.value
              )
            }
          />

          <select
            onChange={(e) =>
              updatePrize(
                index,
                "posicao",
                e.target.value
              )
            }
          >

            {[1,2,3,4,5].map((n) => (

              <option
                key={n}
                value={n}
              >
                {n}
              </option>

            ))}

          </select>

          <input
            type="file"
            onChange={(e) =>
              updatePrize(
                index,
                "imagem",
                e.target.files[0]
              )
            }
          />

          {p.imagem && (

            <img
              src={URL.createObjectURL(p.imagem)}
              width={100}
              alt=""
            />

          )}

          <button
            onClick={() =>
              removePrize(index)
            }
          >
            Remover
          </button>

        </div>

      ))}

      <button onClick={handleSubmit}>
        Salvar
      </button>

    </div>

  );

}