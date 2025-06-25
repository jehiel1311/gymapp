import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <main className="landing">
      <h1>ENTRENAPP</h1>
      <p>Entrená como querés, donde querés.</p>
      <button onClick={() => navigate("/")} className="primary">
        Comenzar
      </button>
    </main>
  );
}
