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
    <div style={{ padding: "20px" }}>
      <h2>Produtos</h2>

      {message && (
        <div
          style={{
            marginBottom: "10px",
            padding: "10px",
            background: message.includes("✅") ? "#cbf7cbff" : "#fac7c7ff",
            borderRadius: "8px",
            fontWeight: "600",
            color: "#0c0c0cff",
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
        <input
          name="stock"
          placeholder="Estoque"
          value={form.stock}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? "Salvar" : "Adicionar"}</button>
      </form>

      {products.length > 0 ? (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.description}</td>
                <td>R$ {Number(p.price).toFixed(2)}</td>
                <td>{p.stock}</td>
                <td style={{ display: 'flex', gap: '5px'}}>
                  <button onClick={() => handleEdit(p)}>Editar</button>
                  <button onClick={() => handleDelete(p.id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ marginTop: "10px", fontStyle: "italic", color: "#5e5e5eff" }}>
          📦 Nenhum produto cadastrado ainda.
        </p>
      )}
    </div>
  );
}