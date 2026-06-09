import { useState, useEffect} from "react";
import api from "../api/axios";
import RichTextEditor from "../components/RichTextEditor";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateRaffle() {

  const navigate = useNavigate();
  const { id } = useParams();

  const isEditing = !!id;

  const [raffle, setRaffle] = useState({
    titulo: "",
    descricao: "",
    descricao_html: "",
    valor_numero: "",
    total_numeros: "",
    data_sorteio: "",
    chave_pix: "",
    tempo_reserva: "",
    link_transmissao: "",
    status: "draft"
  });

  const [mainImage, setMainImage] = useState(null);

  const [gallery, setGallery] = useState([]);

  const [prizes, setPrizes] = useState([]);
  useEffect(() => {

  if (!id) return;

  const fetchRaffle = async () => {

    try {

      const res = await api.get(
        `raffles/${id}/`
      );

      const data = res.data;

      setRaffle({
        titulo: data.titulo || "",

    
        descricao: data.descricao || "",
        descricao_html: data.descricao_html || "",
        valor_numero: data.valor_numero || "",
        total_numeros: data.total_numeros || "",
        data_sorteio: data.data_sorteio
          ? data.data_sorteio.slice(0, 16)
          : "",
        chave_pix: data.chave_pix || "",
        tempo_reserva: data.tempo_reserva || "",
        link_transmissao: data.link_transmissao || "",
        status: data.status || "draft",
      });
      if (data.premios) {
  setPrizes(data.premios);
}

    } catch (err) {

      console.error(err);

      alert(
        "Erro ao carregar rifa"
      );

    }

  };

  fetchRaffle();

}, [id]);

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
      let res;

if (isEditing) {

  res = await api.patch(
    `raffles/${id}/`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data"
      }
    }
  );

} else {

  res = await api.post(
    "raffles/",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data"
      }
    }
  );

}
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

      if (prize.id) {

  await api.patch(
    `raffles/premios/${prize.id}/`,
    prizeData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data"
      }
    }
  );

} else {

  await api.post(
    "raffles/premios/",
    prizeData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data"
      }
    }
  );

}
      }

      alert(
  isEditing
    ? "Rifa atualizada!"
    : "Rifa criada!"
);

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
  const handlePublish = async () => {

  try {

    const res = await api.post(
      `raffles/${id}/publicar/`
    );

    alert(res.data.mensagem);

  } catch (err) {

    console.log(err);

    alert(
      err.response?.data?.erro ||
      "Erro ao publicar rifa"
    );

  }

};
  const handleDraw = async () => {

  const confirmed = window.confirm(
    "Deseja realmente realizar o sorteio?"
  );

  if (!confirmed) return;

  try {

    const res = await api.post(
      `raffles/${id}/sortear/`
    );

    alert(res.data.mensagem);

  } catch (err) {

    console.log(err);

    alert(
      err.response?.data?.erro ||
      "Erro ao realizar sorteio"
    );

  }

};

  return (

    <div>

      <h2>
  {
    isEditing
      ? "Editar Rifa"
      : "Criar Rifa"
  }
</h2>

      {/* 🧾 BASIC */}

      <input
  name="titulo"
  placeholder="Título"
  value={raffle.titulo}
  onChange={handleChange}
/>

      <input
        name="valor_numero"
        placeholder="Valor"
        value={raffle.valor_numero}
        onChange={handleChange}
      />

      <input
        name="total_numeros"
        placeholder="Total números"
        value={raffle.total_numeros}
        onChange={handleChange}
      />

      <input
        name="data_sorteio"
        type="datetime-local"
        value={raffle.data_sorteio}
        onChange={handleChange}
      />

      <input
        name="chave_pix"
        placeholder="PIX"
        value={raffle.chave_pix}
        onChange={handleChange}
      />

      <input
        name="tempo_reserva"
        placeholder="Tempo reserva"
        value={raffle.tempo_reserva}
        onChange={handleChange}
      />

      <input
        name="link_transmissao"
        placeholder="Link transmissão"
        value={raffle.link_transmissao}
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
  placeholder="Descrição"
  value={p.descricao || ""}
  onChange={(e) =>
    updatePrize(
      index,
      "descricao",
      e.target.value
    )
  }
/>

          <select
  value={p.posicao}
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
    src={
      typeof p.imagem === "string"
        ? p.imagem
        : URL.createObjectURL(p.imagem)
    }
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
  {
    isEditing
      ? "Atualizar Rifa"
      : "Salvar"
  }
</button>
{isEditing && raffle.status === "draft" && (
  <button
    onClick={handlePublish}
    style={{
      marginLeft: "10px",
      backgroundColor: "#007bff",
      color: "white"
    }}
  >
    🚀 Publicar Rifa
  </button>
)}

  <button
    onClick={handleDraw}
    style={{
      marginLeft: "10px",
      backgroundColor: "#28a745",
      color: "white"
    }}
  >
    🎲 Realizar Sorteio
  </button>


    </div>

  );

}