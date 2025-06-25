import { useNavigate } from "react-router-dom";

export default function Landing() {
  const nav = useNavigate();
  return (
    <main style={{ textAlign: "center", paddingTop: "25vh" }}>
      <h1 style={{ color: "var(--color-primary)" }}>ENTRENAPP</h1>
      <p>Entrená como querés, donde querés.</p>
      <button
        onClick={() => nav("/home")}
        style={{
          padding: "1rem 2rem",
          borderRadius: 8,
          background: "var(--color-primary)",
          color: "#fff",
        }}
      >
        COMENZAR
      </button>
    </main>
  );
}
