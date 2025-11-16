import { useEffect, useState } from "react";

export default function TutorsCRUD() {
  const [tutors, setTutors] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/tutors`
  : "http://localhost:5000/api/tutors";

  // carregar todos os tutores
  async function loadTutors() {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) setTutors(data.data);
      setMessage(data.message);
    } catch {
      setMessage("❌ Erro ao conectar ao servidor.");
    }
  }

  useEffect(() => {
    loadTutors();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setMessage("⚠️ O campo Nome é obrigatório.");

    try {
      let res;
      if (editingId) {
        res = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      const data = await res.json();
      setMessage(data.message);

      if (data.success) {
        loadTutors();
        setForm({ name: "", phone: "", address: "" });
        setEditingId(null);
      }
    } catch {
      setMessage("❌ Falha ao enviar dados para o servidor.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja deletar este tutor?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await res.json();
      setMessage(data.message);
      if (data.success) loadTutors();
    } catch {
      setMessage("❌ Erro ao tentar deletar o tutor.");
    }
  }

  function handleEdit(tutor) {
    setForm({ name: tutor.name, phone: tutor.phone, address: tutor.address });
    setEditingId(tutor.id);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tutores</h2>

      {message && (
        <div
          style={{
            marginBottom: "10px",
            padding: "10px",
            background: message.includes("✅") ? "#d1f7d1" : "#ffd1d1",
            borderRadius: "8px",
            fontWeight: "600",
            color: "#000",
          }}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "10px", marginBottom: "15px", flexWrap: "wrap" }}
      >
        <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} />
        <input name="phone" placeholder="Contato" value={form.phone} onChange={handleChange} />
        <input name="address" placeholder="Endereço" value={form.address} onChange={handleChange} />
        <button type="submit">{editingId ? "Salvar" : "Adicionar"}</button>
      </form>

      {tutors.length > 0 ? (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Contato</th>
              <th>Endereço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tutors.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.phone}</td>
                <td>{t.address}</td>
                <td style={{ display: 'flex', gap: '5px'}}>
                  <button onClick={() => handleEdit(t)}>Editar</button>
                  <button onClick={() => handleDelete(t.id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ marginTop: "10px", fontStyle: "italic", color: "#666" }}>
          👤 Nenhum tutor cadastrado ainda.
        </p>
      )}

    </div>
  );
}
