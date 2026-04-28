import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import "./Addwaste.css"; // Reuse the same CSS for consistent UI

const MATERIALS = [
  "Metal Scrap", "Plastic Waste", "Chemical Byproduct", "Glass Cullet",
  "Paper / Cardboard", "Organic Waste", "Electronic Waste", "Textile Offcuts",
  "Wood Waste", "Rubber", "Construction Debris", "Other",
];

const UNITS = ["kg", "tonnes", "litres", "m³", "units", "lbs"];

export default function Order() {
  const userEmail = localStorage.getItem("userEmail") || "guest";
  const orderKey = `${userEmail}_orders`;

  const [orders] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(orderKey) || "[]");
    if (saved.length > 0) return saved;

    // Fallback if no orders yet
    return [
      { orderId: "ORD-8821", type: "Metal Scrap", qty: "1.2 tonnes", status: "Delivered", date: "24 Apr" },
      { orderId: "ORD-9012", type: "Plastic Waste", qty: "500 kg", status: "Processing", date: "26 Apr" },
    ];
  });

  const [materialType, setMaterialType] = useState("");
  const [otherMaterialType, setOtherMaterialType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [locationText, setLocationText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const debounceRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.closest(".location-wrap")?.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocationChange = (e) => {
    const val = e.target.value;
    setLocationText(val);
    clearTimeout(debounceRef.current);
    if (val.trim().length < 3) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(() => fetchLocations(val), 380);
  };

  const fetchLocations = async (query) => {
    setLoadingSuggestions(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const selectLocation = (full, display) => {
    setLocationText(full);
    setSuggestions([]);
  };

  const clearLocation = () => {
    setLocationText("");
    setSuggestions([]);
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3200);
  };

  const handleSubmit = () => {
    const finalMaterialType = materialType === "Other" ? otherMaterialType.trim() : materialType;
    if (!materialType || (materialType === "Other" && !otherMaterialType.trim()) || !quantity || !locationText.trim()) {
      showToast("⚠️ Please fill in all fields", "error");
      return;
    }

    const newOrder = {
      orderId: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      type: finalMaterialType,
      qty: `${quantity} ${unit}`,
      location: locationText.split(',')[0],
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      status: "Processing"
    };

    const currentOrders = JSON.parse(localStorage.getItem(orderKey) || "[]");
    localStorage.setItem(orderKey, JSON.stringify([newOrder, ...currentOrders]));

    // Push "Order Placed" notification
    const notifKey = `${userEmail}_notifications`;
    const notifs = JSON.parse(localStorage.getItem(notifKey) || "[]");
    notifs.unshift({
      id: Date.now(),
      title: "📦 Order Placed!",
      message: `Your order for ${finalMaterialType} (${quantity} ${unit}) has been submitted. Awaiting confirmation.`,
      time: new Date().toLocaleTimeString(),
      read: false
    });
    localStorage.setItem(notifKey, JSON.stringify(notifs));

    // Simulate order acceptance notification after 8 seconds
    setTimeout(() => {
      const latestNotifs = JSON.parse(localStorage.getItem(notifKey) || "[]");
      const companies = ["EcoSteel Corp", "PolyNext Industries", "GreenMetal Recyclers", "Symbiox Verified Supplier"];
      const acceptedBy = companies[Math.floor(Math.random() * companies.length)];
      latestNotifs.unshift({
        id: Date.now() + 1,
        title: "✅ Order Accepted!",
        message: `${acceptedBy} has accepted your order for ${finalMaterialType}. They will contact you at your registered email shortly.`,
        time: new Date().toLocaleTimeString(),
        read: false
      });
      localStorage.setItem(notifKey, JSON.stringify(latestNotifs));
    }, 8000);

    showToast("✅ Order submitted successfully!");
    
    // Automatically redirect to home page (dashboard) after a brief delay
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1800);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        {/* Ambient blobs */}
        <div className="aw-blob aw-blob--1" />
        <div className="aw-blob aw-blob--2" />

        <div className="aw-container">
          <div className="aw-layout-grid">
            {/* Column 1: Order Form */}
            <div className="aw-card stagger-1" style={{ margin: 0 }}>
              <div className="aw-badge stagger-1">
                <span className="aw-badge__dot" />
                SYMBIOX Marketplace
              </div>

              <h2 className="aw-title stagger-1">
                Order <span className="aw-title--accent">Materials</span>
              </h2>
              <p className="aw-subtitle stagger-1">Request industrial waste for your business</p>

              {/* Material Type */}
              <div className="aw-field">
                <label className="aw-label">Material Type</label>
                <div className="aw-input-wrap aw-select-wrap">
                  <span className="aw-icon">📦</span>
                  <select
                    className="aw-select"
                    value={materialType}
                    onChange={(e) => { setMaterialType(e.target.value); setOtherMaterialType(""); }}
                  >
                    <option value="" disabled>Select material type</option>
                    {MATERIALS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <span className="aw-chevron">▾</span>
                </div>
                {materialType === "Other" && (
                  <div className="aw-input-wrap aw-other-wrap">
                    <span className="aw-icon">✏️</span>
                    <input
                      className="aw-input"
                      type="text"
                      placeholder="Please specify the material type…"
                      value={otherMaterialType}
                      onChange={(e) => setOtherMaterialType(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div className="aw-field">
                <label className="aw-label">Quantity Needed</label>
                <div className="aw-input-wrap aw-split-row">
                  <span className="aw-icon">⚖️</span>
                  <input
                    className="aw-input aw-input--left"
                    type="number"
                    placeholder="Enter amount"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  <select
                    className="aw-unit-select"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="aw-field">
                <label className="aw-label">Delivery Location</label>
                <div className="aw-input-wrap location-wrap" style={{ position: "relative" }}>
                  <span className="aw-icon">📍</span>
                  <input
                    className="aw-input aw-input--location"
                    type="text"
                    placeholder="Type city, area or delivery address…"
                    autoComplete="off"
                    value={locationText}
                    onChange={handleLocationChange}
                  />
                  {locationText && (
                    <button className="aw-clear-btn" onClick={clearLocation}>×</button>
                  )}

                  {/* Suggestions dropdown */}
                  {(loadingSuggestions || suggestions.length > 0) && (
                    <div className="aw-suggestions" ref={suggestionsRef}>
                      {loadingSuggestions ? (
                        <div className="aw-suggestion-loading">🔍 Searching locations…</div>
                      ) : (
                        suggestions.map((r, i) => {
                          const name = r.name || r.display_name.split(",")[0];
                          const sub = r.display_name.split(",").slice(1, 3).join(",").trim();
                          return (
                            <div
                              key={i}
                              className="aw-suggestion-item"
                              onClick={() => selectLocation(r.display_name, name)}
                            >
                              <span className="aw-suggestion-pin">📍</span>
                              <div>
                                <div className="aw-suggestion-name">{name}</div>
                                <div className="aw-suggestion-sub">{sub}</div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button className="aw-submit-btn" onClick={handleSubmit}>
                <span>🚀</span> Place Order
              </button>
            </div>

            {/* Column 2: Order History */}
            <div className="aw-history-section stagger-2" style={{ marginTop: 0 }}>
              <h3 className="aw-history-title">
                <span>📋</span> Your Order Details
              </h3>
              <div className="aw-table-container">
                <table className="aw-table">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Quantity</th>
                      <th>Location</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, idx) => (
                      <tr key={idx}>
                        <td>{order.type}</td>
                        <td>{order.qty}</td>
                        <td>{order.location || "N/A"}</td>
                        <td>{order.date}</td>
                        <td>
                          <span className={`aw-status-pill aw-status--${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Toast */}
        <div className={`aw-toast ${toast.show ? "aw-toast--show" : ""} ${toast.type === "error" ? "aw-toast--error" : ""}`}>
          {toast.message}
        </div>
      </div>
    </div>
  );
}
