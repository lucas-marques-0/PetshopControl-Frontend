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
  <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
    <h2>🐶 Cadastro de Pets</h2>

    {/* 1. Mensagem de Status Aprimorada */}
    {message && (
      <div
        style={{
          marginBottom: "15px",
          padding: "12px",
          
          background: message.includes("✅") ? "#e6ffed" : "#ffebeb",
          border: `1px solid ${message.includes("✅") ? "#a8e0a8" : "#e0a8a8"}`,
          borderRadius: "8px",
          fontWeight: "600",
          color: message.includes("✅") ? "#155724" : "#721c24",
        }}
      >
        {message}
      </div>
    )}

    {/* 2. Formulário com Estilização e Labels Opcionais */}
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", 
        gap: "15px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        marginBottom: "20px",
        backgroundColor: "#f9f9f9"
      }}
    >
      {/* Container de Input/Label para melhor semântica/organização */}
      <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', fontWeight: 'bold' }}>
        Nome:
        <input 
          name="name" 
          placeholder="Nome" 
          value={form.name} 
          onChange={handleChange} 
          style={inputStyle}
        />
      </label>
      
      <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', fontWeight: 'bold' }}>
        Espécie:
        <input 
          name="species" 
          placeholder="Espécie" 
          value={form.species} 
          onChange={handleChange} 
          style={inputStyle}
        />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', fontWeight: 'bold' }}>
        Raça:
        <input 
          name="breed" 
          placeholder="Raça" 
          value={form.breed} 
          onChange={handleChange} 
          style={inputStyle}
        />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', fontWeight: 'bold' }}>
        Idade:
        <input 
          name="age" 
          placeholder="Idade" 
          value={form.age} 
          onChange={handleChange} 
          type="number" 
          style={inputStyle}
        />
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', fontSize: '12px', fontWeight: 'bold' }}>
        Tutor:
        {/* SELECT de tutores */}
        <select 
          name="tutor_id" 
          value={form.tutor_id} 
          onChange={handleChange} 
          style={{ ...inputStyle, height: '38px', backgroundColor: '#fff' }}
        >
          <option value="">Selecione o tutor</option>
          {tutors.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} (ID: {t.id})
            </option>
          ))}
        </select>
      </label>

      {/* Botão de Submit - Estilo aprimorado */}
      <button 
        type="submit" 
        style={{
          backgroundColor: editingId ? "#ffc107" : "#28a745", // Cor diferente para Edição
          color: "#fff",
          border: "none",
          padding: "10px 15px",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          alignSelf: 'flex-end' 
        }}
      >
        {editingId ? "✏️ Salvar Edição" : "➕ Adicionar Pet"}
      </button>
    </form>
    
    {/* Definindo um estilo base para inputs */}
    <style jsx>{`
      input, select {
        padding: 8px 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
      }
    `}</style>
    
    {/* 3. Tabela de Dados Estilizada */}
    {pets.length > 0 ? (
      <table 
        style={{ 
          width: "100%", 
          borderCollapse: "collapse", 
          marginTop: "20px" 
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
            <th style={tableHeaderStyle}>Nome</th>
            <th style={tableHeaderStyle}>Espécie</th>
            <th style={tableHeaderStyle}>Raça</th>
            <th style={tableHeaderStyle}>Idade</th>
            <th style={tableHeaderStyle}>Tutor</th>
            <th style={tableHeaderStyle}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((p, index) => (
            <tr 
              key={p.id} 
              style={{ 
                backgroundColor: index % 2 === 0 ? "#fff" : "#f0f8ff" 
              }} // Linhas alternadas
            >
              <td style={tableCellStyle}>{p.name}</td>
              <td style={tableCellStyle}>{p.species}</td>
              <td style={tableCellStyle}>{p.breed}</td>
              <td style={tableCellStyle}>{p.age}</td>
              <td style={tableCellStyle}>
                {
                  
                  tutors.find((t) => t.id === p.tutor_id)?.name ||
                  `Tutor não encontrado (ID: ${p.tutor_id})`
                }
              </td>
              <td style={{ ...tableCellStyle, display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button 
                  onClick={() => handleEdit(p)} 
                  style={actionButtonStyle("#007bff")} 
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(p.id)} 
                  style={actionButtonStyle("#dc3545")} 
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> 
    ) : (
      <p style={{ marginTop: "15px", fontStyle: "italic", color: "#666", padding: "10px", borderLeft: "3px solid #ccc" }}>
        🐾 Nenhum pet cadastrado ainda. Use o formulário acima para adicionar um novo registro!
      </p>
    )}
  </div>
);


}
