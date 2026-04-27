import Navbar from "../components/Navbar";
import "../styles/global.css";

export default function Analytics(){
  return(
    <div className="container">
      <h2>Analytics</h2>

      <div className="card">
        <h3>🌱 CO₂ Saved</h3>
        <p>250 kg</p>
      </div>

      <div className="card">
        <h3>♻ Waste Reused</h3>
        <p>500 kg</p>
      </div>

      <Navbar/>
    </div>
  );
}