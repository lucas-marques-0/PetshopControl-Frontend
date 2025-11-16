import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../api";

export default function AppointmentsCRUD() {
  const [appointments, setAppointments] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ tutor_id: "", pet_id: "", service_id: "", datetime: "", status: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const [aRes, tRes, pRes, sRes] = await Promise.all([
      apiGet("appointments"),
      apiGet("tutors"),
      apiGet("pets"),
      apiGet("services")
    ]);

    setAppointments(aRes.data || []);
    setTutors(tRes.data || []);
    setPets(pRes.data || []);
    setServices(sRes.data || []);
    setMessage(aRes.message);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.tutor_id || !form.pet_id || !form.service_id || !form.datetime)
      return setMessage("⚠️ Preencha todos os campos obrigatórios antes de salvar.");

    let res;
    if (editingId) res = await apiPut("appointments", editingId, form);
    else res = await apiPost("appointments", form);

    setMessage(res.message);
    if (res.success) {
      setForm({ tutor_id: "", pet_id: "", service_id: "", datetime: "", status: "" });
      setEditingId(null);
      loadAll();
    }
  }

  async function handleDelete(id) {
    const res = await apiDelete("appointments", id);
    setMessage(res.message);
    if (res.success) loadAll();
  }

  function handleEdit(a) {
    setForm(a);
    setEditingId(a.id);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Agendamentos</h2>

      {message && (
        <div
          style={{
            marginBottom: "10px",
            padding: "10px",
            background: message.includes("✅") ? "#d1f7d1" : "#ffd1d1",
            borderRadius: "8px",
            fontWeight: "600",
            color: "#000"
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
          flexWrap: "wrap"
        }}
      >
        <select name="tutor_id" value={form.tutor_id} onChange={handleChange}>
          <option value="">Selecione um Tutor</option>
          {tutors.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <select name="pet_id" value={form.pet_id} onChange={handleChange}>
          <option value="">Selecione um Pet</option>
          {pets.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select name="service_id" value={form.service_id} onChange={handleChange}>
          <option value="">Selecione um Serviço</option>
          {services.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <input
          name="datetime"
          type="datetime-local"
          value={form.datetime}
          onChange={handleChange}
        />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="">Selecione o Status</option>
          <option value="agendado">Agendado</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </select>

        <button type="submit">{editingId ? "Salvar" : "Adicionar"}</button>
      </form>

      {appointments.length > 0 ? (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Tutor</th>
              <th>Pet</th>
              <th>Serviço</th>
              <th>Data/Hora</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a.id}>
                <td>{a.tutor_name || a.tutor_id}</td>
                <td>{a.pet_name || a.pet_id}</td>
                <td>{a.service_name || a.service_id}</td>
                <td>{new Date(a.datetime).toLocaleString("pt-BR")}</td>
                <td>{a.status}</td>
                <td style={{ display: "flex", gap: "5px" }}>
                  <button onClick={() => handleEdit(a)}>Editar</button>
                  <button onClick={() => handleDelete(a.id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ marginTop: "10px", fontStyle: "italic", color: "#666" }}>
          📅 Nenhum agendamento cadastrado ainda.
        </p>
      )}
    </div>
  );
}
