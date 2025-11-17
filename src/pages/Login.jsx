import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/auth/login`
  : "http://localhost:5000/api/auth/login";

    async function handleLogin(e) {
    e.preventDefault();
    
    Swal.fire({
      title: "Entrando...",
      text: "Aguarde um momento",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      Swal.close();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Erro ao fazer login",
          text: data.error || "Erro ao fazer login"
        });
        return;
      }

      localStorage.setItem("token", data.token);

      Swal.fire({
        icon: "success",
        title: "Login bem-sucedido!"
      });

      navigate("/home");

    } catch (err) {
      console.error(err);

      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Erro de conexão com o servidor"
      });
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

        <h2 style={{ color: "#333", fontWeight: "900" }}>PetshopControl</h2>
        <p style={{ fontSize: "14px", color: "#666" }}>Bem-vindo! Entre para continuar</p>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          
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
            Entrar
          </button>

        </form>

        <button 
          onClick={() => navigate("/register")}
          style={{
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
          Criar Conta
        </button>

      </div>
    </div>
  );
}
