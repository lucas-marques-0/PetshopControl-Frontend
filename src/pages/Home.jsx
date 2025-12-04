import { useState } from "react";
import PetsCRUD from "../components/PetsCRUD";
import TutorsCRUD from "../components/TutorsCRUD";
import ServicesCRUD from "../components/ServicesCRUD";
import ProductsCRUD from "../components/ProductsCRUD";
import AppointmentsCRUD from "../components/AppointmentsCRUD";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [activeTab, setActiveTab] = useState("pets");
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    alert("Você saiu da sua conta com sucesso!!");
    navigate("/");
  }


  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Menu lateral */}
      <div style={{
        width: "210px",
        background: "#23c383",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        padding: "25px",
        gap: "20px"
      }}>
        <h2>Petshop</h2>
        <button onClick={() => setActiveTab("pets")} style={btnStyle}>Pets</button>
        <button onClick={() => setActiveTab("tutors")} style={btnStyle}>Tutores</button>
        <button onClick={() => setActiveTab("services")} style={btnStyle}>Serviços</button>
        <button onClick={() => setActiveTab("products")} style={btnStyle}>Produtos</button>
        <button onClick={() => setActiveTab("appointments")} style={btnStyle}>Agendamentos</button>
        <button onClick={handleLogout} style={{ ...btnStyle, marginTop: "auto", color: "#ffffffff", backgroundColor: '#000', padding: '10px', textAlign: 'center' }}>
          Sair
        </button>
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        {activeTab === "pets" && <PetsCRUD />}
        {activeTab === "tutors" && <TutorsCRUD />}
        {activeTab === "services" && <ServicesCRUD />}
        {activeTab === "products" && <ProductsCRUD />}
        {activeTab === "appointments" && <AppointmentsCRUD />}
      </div>
    </div>
  );
}

// Botão do menu lateral
const btnStyle = {
  background: "transparent",
  color: "#ffffffff",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  padding: "8px 0",
  fontSize: "20px"
};
