import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../api";

export default function PetsCRUD() {
  const [pets, setPets] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [form, setForm] = useState({ name: "", species: "", breed: "", age: "", tutor_id: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadPets();
    loadTutors();
  }, []);

  async function loadPets() {
    const res = await apiGet("pets");
    setPets(res.data || []);
    setMessage(res.message);
  }

  async function loadTutors() {
    const res = await apiGet("tutors");
    setTutors(res.data || []);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) return setMessage("⚠️ O campo Nome é obrigatório.");
    if (!form.tutor_id) return setMessage("⚠️ Selecione um tutor.");

    let res;
    if (editingId) res = await apiPut("pets", editingId, form);
    else res = await apiPost("pets", form);

    setMessage(res.message);
    if (res.success) {
      setForm({ name: "", species: "", breed: "", age: "", tutor_id: "" });
      setEditingId(null);
      loadPets();
    }
  }

  async function handleDelete(id) {
    const res = await apiDelete("pets", id);
    setMessage(res.message);
    if (res.success) loadPets();
  }

  function handleEdit(pet) {
    setForm(pet);
    setEditingId(pet.id);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pets</h2>

      {message && (
        <div
          style={{
            marginBottom: "10px",
            padding: "10px",
            background: message.includes("✅") ? "#cbfccbff" : "#ff9292ff",
            borderRadius: "8px",
            fontWeight: "600",
            color: "#1a1a1aff",
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
        <input name="species" placeholder="Espécie" value={form.species} onChange={handleChange} />
        <input name="breed" placeholder="Raça" value={form.breed} onChange={handleChange} />
        <input name="age" placeholder="Idade" value={form.age} onChange={handleChange} />

        {/* SELECT de tutores */}
        <select name="tutor_id" value={form.tutor_id} onChange={handleChange}>
          <option value="">Selecione o tutor</option>
          {tutors.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} (ID: {t.id})
            </option>
          ))}
        </select>

        <button type="submit">{editingId ? "Salvar" : "Adicionar"}</button>
      </form>

      {pets.length > 0 ? (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Espécie</th>
              <th>Raça</th>
              <th>Idade</th>
              <th>Tutor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.species}</td>
                <td>{p.breed}</td>
                <td>{p.age}</td>
                <td>
                  {
                    tutors.find((t) => t.id === p.tutor_id)?.name ||
                    `ID: ${p.tutor_id}`
                  }
                </td>
                <td style={{ display: 'flex', gap: '5px'}}>
                  <button onClick={() => handleEdit(p)}>Editar</button>
                  <button onClick={() => handleDelete(p.id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ marginTop: "10px", fontStyle: "italic", color: "#666666ff" }}>
          🐾 Nenhum pet cadastrado ainda.
        </p>
      )}
    </div>
  );
}