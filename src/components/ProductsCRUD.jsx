import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "../api";

export default function ProductsCRUD() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const res = await apiGet("products");
    setProducts(res.data || []);
    setMessage(res.message);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) return setMessage("⚠️ O campo Nome é obrigatório.");
    if (!form.price || isNaN(form.price)) return setMessage("⚠️ O preço deve ser um número válido.");
    if (form.stock && isNaN(form.stock)) return setMessage("⚠️ O estoque deve ser um número inteiro.");

    let res;
    if (editingId) res = await apiPut("products", editingId, form);
    else res = await apiPost("products", form);

    setMessage(res.message);
    if (res.success) {
      setForm({ name: "", description: "", price: "", stock: "" });
      setEditingId(null);
      loadProducts();
    }
  }

  async function handleDelete(id) {
    const res = await apiDelete("products", id);
    setMessage(res.message);
    if (res.success) loadProducts();
  }

  function handleEdit(product) {
    setForm(product);
    setEditingId(product.id);
  }

  return (
    <div style={{ padding: "30px", fontFamily: "Roboto, Arial, sans-serif", background: '#f8f9fa' }}>
      <h2>🛒 Gestão de Produtos</h2>

      {/* 1. Mensagem de Status Aprimorada */}
      {message && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            // Estilo baseado no conteúdo da mensagem
            background: message.includes("✅") ? "#d4edda" : "#f8d7da",
            border: `1px solid ${message.includes("✅") ? "#c3e6cb" : "#f5c6cb"}`,
            borderRadius: "8px",
            fontWeight: "600",
            color: message.includes("✅") ? "#155724" : "#721c24",
          }}
        >
          {message}
        </div>
      )}

      {/* 2. Formulário com Layout Grid e Labels */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", // Responsivo
          gap: "15px",
          padding: "20px",
          marginBottom: "25px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          backgroundColor: "#fff"
        }}
      >
        <label style={labelStyle}>
          Nome:
          <input
            name="name"
            placeholder="Ex: Notebook"
            value={form.name}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>
        
        {/* A descrição deve usar um textarea se o espaço permitir, mas mantendo input para não alterar a lógica */}
        <label style={labelStyle}>
          Descrição:
          <input
            name="description"
            placeholder="Breve descrição do item"
            value={form.description}
            onChange={handleChange}
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Preço (R$):
          <input
            name="price"
            placeholder="0.00"
            value={form.price}
            onChange={handleChange}
            type="number"
            min="0.01"
            step="0.01"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          Estoque:
          <input
            name="stock"
            placeholder="Quantidade em estoque"
            value={form.stock}
            onChange={handleChange}
            type="number"
            min="0"
            style={inputStyle}
          />
        </label>

        {/* Botão de Submit Aprimorado */}
        <button 
          type="submit"
          style={{
            backgroundColor: editingId ? "#ffc107" : "#007bff",
            color: "#fff",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
            alignSelf: 'end', 
            height: '40px'
          }}
        >
          {editingId ? "✏️ Salvar Alterações" : "➕ Adicionar Produto"}
        </button>
      </form>

      {/* 3. Tabela de Produtos Estilizada */}
      {products.length > 0 ? (
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: '#343a40', color: '#fff' }}>
              <th style={thStyle}>Nome</th>
              <th style={thStyle}>Descrição</th>
              <th style={thStyle}>Preço</th>
              <th style={thStyle}>Estoque</th>
              <th style={thStyle}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr 
                key={p.id} 
                style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f1f1f1" }} // Linhas alternadas
              >
                <td style={tdStyle}>{p.name}</td>
                <td style={tdStyle}>{p.description}</td>
                <td style={tdStyle}>R$ **{Number(p.price).toFixed(2).replace('.', ',')}**</td> 
                <td style={tdStyle}>{p.stock}</td>
                <td style={{ ...tdStyle, display: 'flex', gap: '8px', justifyContent: 'center'}}>
                  <button 
                    onClick={() => handleEdit(p)}
                    style={actionButtonStyle("#17a2b8")} // Cor para Editar
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    style={actionButtonStyle("#dc3545")} // Cor para Deletar
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ marginTop: "15px", fontStyle: "italic", color: "#666", padding: "15px", borderLeft: "3px solid #007bff" }}>
          📦 Nenhum produto cadastrado ainda. Use o formulário acima para adicionar o primeiro item!
        </p>
      )}
    </div>
  );
}
