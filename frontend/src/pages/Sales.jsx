import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "./Addwaste.css";

export default function Sales() {
  const email = localStorage.getItem("userEmail") || "guest";
  const storageKey = `${email}_listings`;

  const [sales, setSales] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (saved.length > 0) return saved;
    
    // Default fallback if no user listings yet
    return [
      { id: 101, type: "Metal Scrap", qty: "2.5 tonnes", price: "₹45,000", loc: "Delhi", status: "Active", nearest: "EcoSteel Corp (2.4km)" },
      { id: 102, type: "Plastic Waste", qty: "800 kg", price: "₹6,400", loc: "Chennai", status: "Active", nearest: "PolyNext (4.8km)" },
    ];
  });

  const [toast, setToast] = useState({ show: false, message: "" });

  const handleSell = (id, buyer) => {
    const updated = sales.map(s => s.id === id ? { ...s, status: "Sold" } : s);
    setSales(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    showToast(`✅ Successfully sold to ${buyer}!`);
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 3500);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="aw-page" style={{ flex: 1, marginLeft: '250px', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: '80px' }}>
        {/* Ambient blobs */}
        <div className="aw-blob aw-blob--1" />
        <div className="aw-blob aw-blob--2" />

        <div className="aw-history-section" style={{ marginTop: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <div className="aw-badge">
                <span className="aw-badge__dot" />
                Sales Inventory
              </div>
              <h2 className="aw-title" style={{ marginBottom: 0 }}>
                Your <span className="aw-title--accent">Waste Listings</span>
              </h2>
            </div>
            
            <button 
              className="aw-submit-btn" 
              style={{ width: 'auto', padding: '12px 24px', fontSize: '14px' }}
              onClick={() => window.location.href = "/add"}
            >
              <span>+</span> Add New Listing
            </button>
          </div>

          <div className="aw-table-container">
            <table className="aw-table">
              <thead>
                <tr>
                  <th>Waste Type</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Nearest Requester</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((item) => (
                  <tr key={item.id}>
                    <td>{item.type}</td>
                    <td>{item.qty}</td>
                    <td>{item.price}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '500', color: '#fff' }}>{item.nearest.split('(')[0]}</span>
                        <span style={{ fontSize: '11px', color: '#22c55e' }}>{item.nearest.match(/\(([^)]+)\)/)?.[1] || ''} away</span>
                      </div>
                    </td>
                    <td>
                      <span className={`aw-status-pill aw-status--${item.status.toLowerCase().replace(' ', '')}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.status === "Active" ? (
                        <button 
                          className="aw-sell-btn" 
                          onClick={() => handleSell(item.id, item.nearest.split('(')[0])}
                        >
                          Sell Now
                        </button>
                      ) : item.status === "Sold" ? (
                        <span className="aw-sold-text">Completed</span>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '11px' }}>Verifying...</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Toast */}
        <div className={`aw-toast ${toast.show ? "aw-toast--show" : ""}`}>
          {toast.message}
        </div>
      </div>
    </div>
  );
}
