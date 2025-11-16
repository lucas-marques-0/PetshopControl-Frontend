import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/auth/register`
  : "http://localhost:5000/api/auth/register";

  async function handleRegister(e) {
    e.preventDefault();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) throw new Error("Erro no registro");

      const data = await res.json();
      alert(`Usuário ${data.user.username} registrado com sucesso!`);
      navigate("/"); // volta para o login
    } catch (err) {
      alert("Erro ao registrar usuário!");
      console.error(err);
    }
  }

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      justifyContent: "center",
      alignItems: "center",
      background: "#f2f5f9"
    }}>
      <div style={{
        background: "#fff",
        padding: "30px",
        borderRadius: "14px",
        width: "320px",
        boxShadow: "0px 6px 22px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        textAlign: "center"
      }}>

        <h2 style={{ marginBottom: "5px", color: "#333", fontWeight: "600" }}>Criar Conta 🐾</h2>
        <p style={{ fontSize: "14px", color: "#666" }}>Preencha os dados abaixo</p>

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          
          <input
            type="text"
            placeholder="Nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "14px"
            }}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "14px"
            }}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "14px"
            }}
          />

          <button 
            type="submit"
            style={{
              background: "#23c383",
              color: "#fff",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
              transition: "0.2s"
            }}
            onMouseOver={(e)=>e.target.style.background="#1ca56e"}
            onMouseOut={(e)=>e.target.style.background="#23c383"}
          >
            Registrar
          </button>

        </form>

        <button 
          onClick={() => navigate("/")}
          style={{
            marginTop: "10px",
            background: "#fff",
            border: "1px solid #23c383",
            color: "#23c383",
            padding: "10px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "0.2s"
          }}
          onMouseOver={(e)=>{e.target.style.background="#23c383"; e.target.style.color="#fff"}}
          onMouseOut={(e)=>{e.target.style.background="#fff"; e.target.style.color="#23c383"}}
        >
          Voltar para Login
        </button>

      </div>
    </div>
  );
}
