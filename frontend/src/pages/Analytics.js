import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "./Addwaste.css";

const CO2_FACTORS = {
  copper: 4.5, metal: 4.0, steel: 4.0, aluminum: 3.8,
  plastic: 1.5, electronic: 2.5, pcb: 3.0, glass: 0.3,
  paper: 0.9, cardboard: 0.8, rubber: 1.2, textile: 1.8,
  wood: 0.5, chemical: 1.0, other: 1.0
};

const DEFAULT_ITEMS = [
  { type: "Copper Scrap", qty: "2.4 tonnes" },
  { type: "Industrial Plastic", qty: "850 kg" },
  { type: "Electronic PCBS", qty: "120 units" },
  { type: "Aluminum Cans", qty: "1.5 tonnes" },
  { type: "Glass Cullet", qty: "2000 kg" },
  { type: "Cardboard Bales", qty: "3.2 tonnes" },
];

function parseWeight(item) {
  const qtyValue = parseFloat(item.qty || item.quantity || 0);
  const qtyLower = (item.qty || item.quantity || "").toLowerCase();
  if (qtyLower.includes("tonne")) return qtyValue * 1000;
  if (qtyLower.includes("unit")) return qtyValue * 0.5;
  return qtyValue;
}

function getCO2Factor(type = "") {
  const t = type.toLowerCase();
  for (const [key, val] of Object.entries(CO2_FACTORS)) {
    if (t.includes(key)) return val;
  }
  return CO2_FACTORS.other;
}

export default function Analytics() {
  const [stats, setStats] = useState({ waste: 0, co2: 0, revenue: 0 });
  const [breakdown, setBreakdown] = useState([]);
  const [modal, setModal] = useState(null); // "co2" | "waste" | null

  const userEmail = localStorage.getItem("userEmail") || "guest";

  useEffect(() => {
    const userListings = JSON.parse(localStorage.getItem(`${userEmail}_listings`) || "[]");
    const allItems = [...userListings, ...DEFAULT_ITEMS];

    let totalWaste = 0;
    let totalCO2 = 0;
    const details = [];

    allItems.forEach(item => {
      const weight = parseWeight(item);
      const factor = getCO2Factor(item.type || item.wasteType);
      const co2 = weight * factor;
      totalWaste += weight;
      totalCO2 += co2;
      details.push({
        type: item.type || item.wasteType || "Unknown",
        weight: Math.round(weight),
        factor,
        co2: Math.round(co2),
        qty: item.qty || item.quantity || "N/A"
      });
    });

    setStats({
      waste: Math.round(totalWaste),
      co2: Math.round(totalCO2),
      revenue: 4500 + (userListings.length * 200)
    });
    setBreakdown(details);
  }, [userEmail]);

  const trees = Math.round(stats.co2 / 21);  // 1 tree absorbs ~21 kg CO2/year
  const cars = (stats.co2 / 4600).toFixed(1); // avg car emits 4600 kg/year

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="aw-blob aw-blob--1" />
        <div className="aw-blob aw-blob--2" />

        <div className="content-wrapper">
          {/* Header */}
          <div className="stagger-1" style={{ marginBottom: "32px" }}>
            <div className="aw-badge" style={{ marginBottom: "12px" }}>
              <span className="aw-badge__dot" /> Sustainability Metrics
            </div>
            <h2 className="analytics-title">
              Sustainability <span style={{ color: "#22c55e" }}>Analytics</span>
            </h2>
            <p style={{ color: "#94a3b8", marginTop: "8px", fontSize: "14px" }}>
              Click any card for a detailed breakdown
            </p>
          </div>

          {/* Stat Cards */}
          <div className="cards">
            {/* CO2 Card */}
            <div
              className="card stagger-1"
              onClick={() => setModal("co2")}
              style={{ flex: 1, padding: "40px", textAlign: "center", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(34,197,94,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = ""; }}
            >
              <span style={{ fontSize: "48px", display: "block", marginBottom: "12px" }}>🌱</span>
              <h3 style={{ fontSize: "16px", margin: "0 0 12px", color: "#94a3b8", fontWeight: 500 }}>CO₂ Saved</h3>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#22c55e", margin: 0 }}>{stats.co2.toLocaleString()} kg</p>
              <p style={{ fontSize: "12px", color: "#475569", marginTop: "8px" }}>≈ {trees.toLocaleString()} trees planted · {cars} cars off road</p>
              <div style={{ marginTop: "16px", fontSize: "12px", color: "#22c55e", opacity: 0.7 }}>Click for breakdown →</div>
            </div>

            {/* Waste Reused Card */}
            <div
              className="card stagger-2"
              onClick={() => setModal("waste")}
              style={{ flex: 1, padding: "40px", textAlign: "center", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(34,197,94,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = ""; }}
            >
              <span style={{ fontSize: "48px", display: "block", marginBottom: "12px" }}>♻️</span>
              <h3 style={{ fontSize: "16px", margin: "0 0 12px", color: "#94a3b8", fontWeight: 500 }}>Waste Reused</h3>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#22c55e", margin: 0 }}>{stats.waste.toLocaleString()} kg</p>
              <p style={{ fontSize: "12px", color: "#475569", marginTop: "8px" }}>Across {breakdown.length} material type{breakdown.length !== 1 ? "s" : ""}</p>
              <div style={{ marginTop: "16px", fontSize: "12px", color: "#22c55e", opacity: 0.7 }}>Click for breakdown →</div>
            </div>

            {/* Revenue Card */}
            <div className="card stagger-3" style={{ flex: 1, padding: "40px", textAlign: "center" }}>
              <span style={{ fontSize: "48px", display: "block", marginBottom: "12px" }}>💰</span>
              <h3 style={{ fontSize: "16px", margin: "0 0 12px", color: "#94a3b8", fontWeight: 500 }}>Est. Revenue</h3>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#22c55e", margin: 0 }}>${stats.revenue.toLocaleString()}</p>
              <p style={{ fontSize: "12px", color: "#475569", marginTop: "8px" }}>Based on platform activity</p>
            </div>
          </div>

          {/* Impact Report */}
          <div className="stagger-4" style={{ background: "rgba(255,255,255,0.04)", padding: "28px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h4 style={{ marginBottom: "12px", color: "#e2e8f0", fontWeight: 600 }}>🌍 Environmental Impact Report</h4>
            <p style={{ color: "#94a3b8", lineHeight: "1.7", fontSize: "14px", margin: 0 }}>
              Your activities on Symbiox have directly contributed to the reduction of industrial waste landfilling.
              By facilitating the reuse of <strong style={{ color: "#fff" }}>{stats.waste.toLocaleString()} kg</strong> of materials, you have effectively prevented
              the emission of <strong style={{ color: "#22c55e" }}>{stats.co2.toLocaleString()} kg</strong> of CO₂ — equivalent to planting <strong style={{ color: "#fff" }}>{trees.toLocaleString()} trees</strong> or
              removing <strong style={{ color: "#fff" }}>{cars} cars</strong> from the road for a full year.
            </p>
          </div>
        </div>

        {/* Detail Modal */}
        {modal && (
          <div className="sales-modal-overlay" onClick={() => setModal(null)}>
            <div className="sales-modal" style={{ maxWidth: "560px" }} onClick={e => e.stopPropagation()}>
              <button className="sales-modal-close" onClick={() => setModal(null)}>×</button>

              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ margin: 0, fontSize: "20px", color: "#fff" }}>
                  {modal === "co2" ? "🌱 CO₂ Saved — Breakdown" : "♻️ Waste Reused — Breakdown"}
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "6px" }}>
                  Per-material analysis based on your listings
                </p>
              </div>

              {/* Summary row */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                <div style={{ flex: 1, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: "22px", fontWeight: 700, color: "#22c55e" }}>
                    {modal === "co2" ? `${stats.co2.toLocaleString()} kg` : `${stats.waste.toLocaleString()} kg`}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>Total {modal === "co2" ? "CO₂ Saved" : "Waste Reused"}</div>
                </div>
                {modal === "co2" && (
                  <>
                    <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                      <div style={{ fontSize: "22px", fontWeight: 700, color: "#fff" }}>{trees.toLocaleString()}</div>
                      <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>🌳 Trees Equivalent</div>
                    </div>
                    <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
                      <div style={{ fontSize: "22px", fontWeight: 700, color: "#fff" }}>{cars}</div>
                      <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>🚗 Cars off Road/yr</div>
                    </div>
                  </>
                )}
              </div>

              {/* Per-material table */}
              <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                      <th style={{ textAlign: "left", padding: "8px 4px", color: "#64748b", fontWeight: 600, fontSize: "11px", textTransform: "uppercase" }}>Material</th>
                      <th style={{ textAlign: "right", padding: "8px 4px", color: "#64748b", fontWeight: 600, fontSize: "11px", textTransform: "uppercase" }}>Weight (kg)</th>
                      {modal === "co2" && (
                        <>
                          <th style={{ textAlign: "right", padding: "8px 4px", color: "#64748b", fontWeight: 600, fontSize: "11px", textTransform: "uppercase" }}>Factor</th>
                          <th style={{ textAlign: "right", padding: "8px 4px", color: "#64748b", fontWeight: 600, fontSize: "11px", textTransform: "uppercase" }}>CO₂ Saved</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {breakdown.map((item, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "10px 4px", color: "#e2e8f0" }}>{item.type}</td>
                        <td style={{ padding: "10px 4px", color: "#94a3b8", textAlign: "right" }}>{item.weight.toLocaleString()}</td>
                        {modal === "co2" && (
                          <>
                            <td style={{ padding: "10px 4px", color: "#64748b", textAlign: "right" }}>×{item.factor}</td>
                            <td style={{ padding: "10px 4px", color: "#22c55e", fontWeight: 600, textAlign: "right" }}>{item.co2.toLocaleString()} kg</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}