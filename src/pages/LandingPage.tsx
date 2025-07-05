import { Link } from "react-router-dom";
import "../landing.css";

export default function LandingPage() {
 return (
 <div className="landing">
 <h1>ENTRENAPP</h1>
 <p>Entrená como querés, donde querés.</p>
 <Link to="/ejercicios" className="btn">COMENZAR</Link>
 </div>
 );
}
