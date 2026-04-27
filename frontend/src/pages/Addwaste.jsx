import { useState, useEffect, useRef } from "react";
import "./Addwaste.css";

const WASTE_TYPES = [
  "Metal Scrap", "Plastic Waste", "Chemical Byproduct", "Glass Cullet",
  "Paper / Cardboard", "Organic Waste", "Electronic Waste", "Textile Offcuts",
  "Wood Waste", "Rubber", "Construction Debris", "Other",
];

const UNITS = ["kg", "tonnes", "litres", "m³", "units", "lbs"];

const CURRENCIES = [
  { symbol: "₹", code: "INR" },
  { symbol: "$", code: "USD" },
  { symbol: "€", code: "EUR" },
  { symbol: "£", code: "GBP" },
  { symbol: "¥", code: "JPY" },
  { symbol: "~", code: "Other" },
];

export default function AddWaste() {
  const [wasteType, setWasteType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [locationText, setLocationText] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
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
    setSelectedLocation("");
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
    setSelectedLocation(full);
    setSuggestions([]);
  };

  const clearLocation = () => {
    setLocationText("");
    setSelectedLocation("");
    setSuggestions([]);
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3200);
  };

  const handleSubmit = () => {
    if (!wasteType || !quantity || !price || !locationText.trim()) {
      showToast("⚠️ Please fill in all fields", "error");
      return;
    }

    // Prepare new listing object
    const newListing = {
      id: Date.now(),
      type: wasteType,
      image: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&w=600&q=80",
      location: locationText.split(',')[0],
      qty: `${quantity} ${unit}`,
      price: `${currencySymbol}${price}`,
      status: "Active",
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    // Save to user-specific listings in localStorage
    const email = localStorage.getItem("userEmail") || "guest";
    const storageKey = `${email}_listings`;
    const currentListings = JSON.parse(localStorage.getItem(storageKey) || "[]");
    localStorage.setItem(storageKey, JSON.stringify([newListing, ...currentListings]));

    showToast("✅ Waste listed successfully!");
    
    // Automatically redirect to home page (dashboard) after a brief delay
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1800);
  };

  const currencySymbol = CURRENCIES.find((c) => c.code === currency)?.symbol || "₹";

  return (
    <div className="aw-page">
      {/* Ambient blobs */}
      <div className="aw-blob aw-blob--1" />
      <div className="aw-blob aw-blob--2" />

      <div className="aw-card">
        <div className="aw-badge">
          <span className="aw-badge__dot" />
          SYMBIOX Platform
        </div>

        <h2 className="aw-title">
          Add <span className="aw-title--accent">Waste</span>
        </h2>
        <p className="aw-subtitle">List your industrial waste for circular reuse</p>

        {/* Waste Type */}
        <div className="aw-field">
          <label className="aw-label">Waste Type</label>
          <div className="aw-input-wrap aw-select-wrap">
            <span className="aw-icon">♻️</span>
            <select
              className="aw-select"
              value={wasteType}
              onChange={(e) => setWasteType(e.target.value)}
            >
              <option value="" disabled>Select waste type</option>
              {WASTE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <span className="aw-chevron">▾</span>
          </div>
        </div>

        {/* Quantity */}
        <div className="aw-field">
          <label className="aw-label">Quantity</label>
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

        {/* Price */}
        <div className="aw-field">
          <label className="aw-label">Price</label>
          <div className="aw-input-wrap aw-split-row">
            <select
              className="aw-currency-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
              ))}
            </select>
            <input
              className="aw-input aw-input--right"
              type="number"
              placeholder="0.00"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        {/* Location */}
        <div className="aw-field">
          <label className="aw-label">Location</label>
          <div className="aw-input-wrap location-wrap" style={{ position: "relative" }}>
            <span className="aw-icon">📍</span>
            <input
              className="aw-input aw-input--location"
              type="text"
              placeholder="Type city, area or address…"
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
          <span>🌿</span> Submit Waste Listing
        </button>
      </div>

      {/* Toast */}
      <div className={`aw-toast ${toast.show ? "aw-toast--show" : ""} ${toast.type === "error" ? "aw-toast--error" : ""}`}>
        {toast.message}
      </div>
    </div>
  );
}
