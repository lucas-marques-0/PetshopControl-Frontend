import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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

    Swal.fire({
      title: "Registrando...",
      text: "Aguarde um momento",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      Swal.close();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Erro ao registrar usuário!",
          text: data.error || "Verifique os dados e tente novamente."
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: `Usuário ${data.user.username} registrado com sucesso!`,
      });

      navigate("/");

    } catch (err) {
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Erro ao registrar usuário!",
        text: "Falha de conexão com o servidor."
      });

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
  background: "linear-gradient(135deg, #e8f9f2, #d6f0ff)"
}}>
  <div style={{
    background: "#fff",
    padding: "40px",
    borderRadius: "18px",
    width: "350px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    textAlign: "center",
    transition: "0.3s"
  }}>

    <h2 style={{ 
      marginBottom: "0px",
      color: "#1c3d32",
      fontWeight: "900",
      fontSize: "26px"
    }}>
      Criar Conta 🐾
    </h2>

    <p style={{ 
      fontSize: "15px",
      color: "#3a4f46"
    }}>
      Preencha os dados abaixo
    </p>

    <form 
      onSubmit={handleRegister} 
      style={{ display: "flex", flexDirection: "column", gap: "14px" }}
    >

      <input
        type="text"
        placeholder="Nome de usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #cfd8dc",
          outline: "none",
          fontSize: "14px",
          transition: "0.2s"
        }}
        onFocus={(e) => { e.target.style.border = "1px solid #23c383"; }}
        onBlur={(e) => { e.target.style.border = "1px solid #cfd8dc"; }}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #cfd8dc",
          outline: "none",
          fontSize: "14px",
          transition: "0.2s"
        }}
        onFocus={(e) => { e.target.style.border = "1px solid #23c383"; }}
        onBlur={(e) => { e.target.style.border = "1px solid #cfd8dc"; }}
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #cfd8dc",
          outline: "none",
          fontSize: "14px",
          transition: "0.2s"
        }}
        onFocus={(e) => { e.target.style.border = "1px solid #23c383"; }}
        onBlur={(e) => { e.target.style.border = "1px solid #cfd8dc"; }}
      />

      <button 
        type="submit"
        style={{
          background: "#23c383",
          color: "#fff",
          padding: "13px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "700",
          transition: "0.25s",
          boxShadow: "0 4px 12px rgba(35,195,131,0.25)"
        }}
        onMouseOver={(e) => {
          e.target.style.background = "#1ba974";
          e.target.style.transform = "scale(1.03)";
        }}
        onMouseOut={(e) => {
          e.target.style.background = "#23c383";
          e.target.style.transform = "scale(1)";
        }}
      >
        Registrar
      </button>

    </form>

    <button 
      onClick={() => navigate("/")}
      style={{
        marginTop: "5px",
        background: "#fff",
        border: "2px solid #23c383",
        color: "#23c383",
        padding: "11px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "700",
        transition: "0.25s"
      }}
      onMouseOver={(e) => {
        e.target.style.background = "#23c383"; 
        e.target.style.color = "#fff";
        e.target.style.transform = "scale(1.03)";
      }}
      onMouseOut={(e) => {
        e.target.style.background = "#fff"; 
        e.target.style.color = "#23c383";
        e.target.style.transform = "scale(1)";
      }}
    >
      Voltar para Login
    </button>

  </div>
</div>
  );
}