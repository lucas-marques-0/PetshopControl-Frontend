import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../api";

export default function ServicesCRUD() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    const res = await apiGet("services");
    setServices(res.data || []);
    setMessage(res.message);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) return setMessage("⚠️ O campo Nome é obrigatório.");
    if (!form.price || isNaN(form.price))
      return setMessage("⚠️ O preço deve ser um número válido.");

    let res;
    if (editingId) res = await apiPut("services", editingId, form);
    else res = await apiPost("services", form);

    setMessage(res.message);
    if (res.success) {
      setForm({ name: "", description: "", price: "" });
      setEditingId(null);
      loadServices();
    }
  }

  async function handleDelete(id) {
    const res = await apiDelete("services", id);
    setMessage(res.message);
    if (res.success) loadServices();
  }

  function handleEdit(service) {
    setForm(service);
    setEditingId(service.id);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Serviços</h2>

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
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "15px",
          flexWrap: "wrap",
        }}
      >
        <input
          name="name"
          placeholder="Nome"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="description"
          placeholder="Descrição"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="price"
          placeholder="Preço"
          value={form.price}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? "Salvar" : "Adicionar"}</button>
      </form>

      {services.length > 0 ? (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Preço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.description}</td>
                <td>R$ {Number(s.price).toFixed(2)}</td>
                <td style={{ display: "flex", gap: "5px" }}>
                  <button onClick={() => handleEdit(s)}>Editar</button>
                  <button onClick={() => handleDelete(s.id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ marginTop: "10px", fontStyle: "italic", color: "#666" }}>
          💼 Nenhum serviço cadastrado ainda.
        </p>
      )}
    </div>
  );
}
