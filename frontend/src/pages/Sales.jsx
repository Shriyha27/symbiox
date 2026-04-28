import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "./Addwaste.css";

// Mock company database for matched requesters
const companyDatabase = {
  "EcoSteel Corp": {
    name: "EcoSteel Corp",
    industry: "Steel Recycling",
    location: "Delhi NCR, India",
    email: "procurement@ecosteel.in",
    phone: "+91 98100 12345",
    website: "www.ecosteel.in",
    description: "India's leading steel scrap recycler with 20+ years of experience.",
    verified: true
  },
  "PolyNext": {
    name: "PolyNext Industries",
    industry: "Plastic Reprocessing",
    location: "Chennai, Tamil Nadu",
    email: "buy@polynext.com",
    phone: "+91 94440 56789",
    website: "www.polynext.com",
    description: "Specialized in HDPE, PET and industrial plastic waste reprocessing.",
    verified: true
  },
  "GreenMetal Recyclers": {
    name: "GreenMetal Recyclers",
    industry: "Metal Recycling",
    location: "Mumbai, Maharashtra",
    email: "ops@greenmetal.co.in",
    phone: "+91 97690 11223",
    website: "www.greenmetal.co.in",
    description: "Certified metal scrap buyers for copper, aluminum and brass.",
    verified: true
  }
};

export default function Sales() {
  const email = localStorage.getItem("userEmail") || "guest";
  const storageKey = `${email}_listings`;
  const notifKey = `${email}_notifications`;

  const [sales, setSales] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (saved.length > 0) {
      return saved.map((item, i) => ({
        id: item.id || i + 1,
        type: item.type || item.wasteType || "Unknown",
        qty: item.qty || item.quantity || "N/A",
        price: item.price || "N/A",
        loc: item.loc || item.location || "N/A",
        status: item.status || "Active",
        nearest: item.nearest || "N/A"
      }));
    }
    return [
      { id: 101, type: "Metal Scrap", qty: "2.5 tonnes", price: "₹45,000", loc: "Delhi", status: "Active", nearest: "EcoSteel Corp (2.4km)" },
      { id: 102, type: "Plastic Waste", qty: "800 kg", price: "₹6,400", loc: "Chennai", status: "Active", nearest: "PolyNext (4.8km)" },
    ];
  });

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [modal, setModal] = useState(null); // company details modal

  // Simulate matching for unmatched listings after 5 seconds
  useEffect(() => {
    const unmatched = sales.filter(s => !s.nearest || s.nearest === "N/A");
    if (unmatched.length === 0) return;

    const timer = setTimeout(() => {
      const companies = Object.keys(companyDatabase);
      setSales(prev => {
        const updated = prev.map(item => {
          if (!item.nearest || item.nearest === "N/A") {
            const randomCo = companies[Math.floor(Math.random() * companies.length)];
            const dist = (Math.random() * 9 + 1).toFixed(1);
            return { ...item, nearest: `${randomCo} (${dist}km)` };
          }
          return item;
        });
        localStorage.setItem(storageKey, JSON.stringify(updated));

        // Push notification for newly matched items
        const notifs = JSON.parse(localStorage.getItem(notifKey) || "[]");
        unmatched.forEach(item => {
          notifs.unshift({
            id: Date.now() + Math.random(),
            title: "🎯 Requester Matched!",
            message: `A buyer has been matched for your ${item.type} listing.`,
            time: new Date().toLocaleTimeString(),
            read: false
          });
        });
        localStorage.setItem(notifKey, JSON.stringify(notifs));
        return updated;
      });
      showToast("🎯 New requester matched for your listing!", "success");
    }, 5000);

    return () => clearTimeout(timer);
  }, [sales, storageKey, notifKey]);

  const handleSell = (id, nearest) => {
    const companyName = nearest.split("(")[0].trim();
    const updated = sales.map(s => s.id === id ? { ...s, status: "Sold" } : s);
    setSales(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // Push order-accepted notification
    const notifs = JSON.parse(localStorage.getItem(notifKey) || "[]");
    const soldItem = sales.find(s => s.id === id);
    notifs.unshift({
      id: Date.now(),
      title: "✅ Order Accepted!",
      message: `${companyName} has accepted your ${soldItem?.type} listing. They will contact you shortly.`,
      time: new Date().toLocaleTimeString(),
      read: false
    });
    localStorage.setItem(notifKey, JSON.stringify(notifs));

    showToast(`✅ Sold to ${companyName}! Check notifications for details.`, "success");
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  const openModal = (nearest) => {
    if (!nearest || nearest === "N/A") return;
    const companyName = nearest.split("(")[0].trim();
    const info = companyDatabase[companyName];
    if (info) {
      setModal(info);
    } else {
      setModal({
        name: companyName,
        industry: "Industrial Recycling",
        location: "India",
        email: `contact@${companyName.toLowerCase().replace(/\s/g, "")}.com`,
        phone: "+91 98000 00000",
        website: "N/A",
        description: "Verified industrial waste buyer on the Symbiox platform.",
        verified: true
      });
    }
  };

  const isMatched = (nearest) => nearest && nearest !== "N/A" && nearest !== "Matching…";

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="aw-blob aw-blob--1" />
        <div className="aw-blob aw-blob--2" />

        <div className="aw-history-section stagger-1" style={{ marginTop: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
            <div className="stagger-1">
              <div className="aw-badge">
                <span className="aw-badge__dot" />
                Sales Inventory
              </div>
              <h2 className="aw-title" style={{ marginBottom: 0 }}>
                Your <span className="aw-title--accent">Waste Listings</span>
              </h2>
            </div>
            <button
              className="aw-submit-btn stagger-2"
              style={{ width: "auto", padding: "12px 24px", fontSize: "14px" }}
              onClick={() => window.location.href = "/add"}
            >
              <span>+</span> Add New Listing
            </button>
          </div>

          <div className="aw-table-container stagger-3">
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
                      {isMatched(item.nearest) ? (
                        <div
                          style={{ display: "flex", flexDirection: "column", cursor: "pointer" }}
                          onClick={() => openModal(item.nearest)}
                          title="Click to view company details"
                        >
                          <span style={{ fontWeight: "600", color: "#22c55e", textDecoration: "underline dotted", textUnderlineOffset: "3px" }}>
                            {item.nearest.split("(")[0].trim()}
                          </span>
                          <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                            {item.nearest.match(/\(([^)]+)\)/)?.[1]} away · click for info
                          </span>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontWeight: "500", color: "#f59e0b" }}>⏳ Matching…</span>
                          <span style={{ fontSize: "11px", color: "#64748b" }}>Finding nearest buyer</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`aw-status-pill aw-status--${item.status.toLowerCase().replace(" ", "")}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.status === "Active" ? (
                        isMatched(item.nearest) ? (
                          <button
                            className="aw-sell-btn"
                            onClick={() => handleSell(item.id, item.nearest)}
                          >
                            Sell Now
                          </button>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <button
                              className="aw-sell-btn"
                              disabled
                              title="Waiting for a buyer to be matched"
                              style={{ opacity: 0.4, cursor: "not-allowed", filter: "grayscale(0.5)" }}
                            >
                              Sell Now
                            </button>
                            <span style={{ fontSize: "10px", color: "#64748b", textAlign: "center" }}>Awaiting match</span>
                          </div>
                        )
                      ) : item.status === "Sold" ? (
                        <span className="aw-sold-text">Completed</span>
                      ) : (
                        <span style={{ color: "#64748b", fontSize: "11px" }}>Verifying...</span>
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

      {/* Company Details Modal */}
      {modal && (
        <div className="sales-modal-overlay" onClick={() => setModal(null)}>
          <div className="sales-modal" onClick={e => e.stopPropagation()}>
            <button className="sales-modal-close" onClick={() => setModal(null)}>×</button>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg, #16a34a, #22c55e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>
                🏭
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h3 style={{ margin: 0, fontSize: "20px", color: "#fff" }}>{modal.name}</h3>
                  {modal.verified && (
                    <span style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", fontSize: "10px", padding: "2px 8px", borderRadius: "99px", fontWeight: 600 }}>✓ Verified</span>
                  )}
                </div>
                <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: "13px" }}>{modal.industry}</p>
              </div>
            </div>

            <p style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px", padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
              {modal.description}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { icon: "📍", label: "Location", value: modal.location },
                { icon: "✉️", label: "Email", value: modal.email, link: `mailto:${modal.email}` },
                { icon: "📞", label: "Phone", value: modal.phone, link: `tel:${modal.phone}` },
                { icon: "🌐", label: "Website", value: modal.website, link: modal.website !== "N/A" ? `https://${modal.website}` : null },
              ].map(({ icon, label, value, link }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", background: "rgba(255,255,255,0.04)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span style={{ fontSize: "18px", flexShrink: 0 }}>{icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>{label}</div>
                    {link ? (
                      <a href={link} target="_blank" rel="noreferrer" style={{ color: "#22c55e", fontSize: "14px", textDecoration: "none", fontWeight: 500 }}>{value}</a>
                    ) : (
                      <span style={{ color: "#e2e8f0", fontSize: "14px" }}>{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "24px", display: "flex", gap: "10px" }}>
              <a href={`mailto:${modal.email}`} className="aw-submit-btn" style={{ flex: 1, textAlign: "center", textDecoration: "none", padding: "12px" }}>
                ✉️ Send Email
              </a>
              <a href={`tel:${modal.phone}`} className="aw-sell-btn" style={{ flex: 1, textAlign: "center", textDecoration: "none", padding: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                📞 Call Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
