export default function PersonaCard({ persona, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "1rem",
        margin: "1rem",
        cursor: "pointer",
        width: "150px",
        textAlign: "center",
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <img
        src={persona.avatar}
        alt={persona.name}
        style={{ width: "80px", height: "80px", borderRadius: "50%" }}
      />
      <h3>{persona.name}</h3>
      <p style={{ fontSize: "0.8rem", color: "#555" }}>{persona.vibe}</p>
    </div>
  );
}
