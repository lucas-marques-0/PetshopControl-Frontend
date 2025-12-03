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
      background: "#b8b8b8ff"
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

        <h2 style={{ fontSize: "30px", marginBottom: "5px", color: "#333", fontWeight: "900" }}>Criar Conta</h2>
        <p style={{ fontSize: "20px", color: "#292929ff" }}>Preencha os dados abaixo</p>

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

          <input
            className="input-customizado"
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
            className="input-customizado"
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
            className="input-customizado"
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
              background: "#dc367eff",
              color: "#fff",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
              transition: "0.2s"
            }}
            onMouseOver={(e) => e.target.style.background = "#830153ff"}
            onMouseOut={(e) => e.target.style.background = "#dc367eff"}
          >
            Registrar
          </button>

        </form>

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "10px",
            background: "#fff",
            border: "1px solid #dc367eff",
            color: "#dc367eff",
            padding: "10px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "0.2s"
          }}
          onMouseOver={(e) => { e.target.style.background = "#830153ff"; e.target.style.color = "#fff" }}
          onMouseOut={(e) => { e.target.style.background = "#fff"; e.target.style.color = "#dc367eff" }}
        >
          Voltar para Login
        </button>

      </div>
    </div>
  );
}
