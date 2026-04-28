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
  const [otherWasteType, setOtherWasteType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [locationText, setLocationText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Contact details
  const [contactName, setContactName] = useState(() => {
    const profile = JSON.parse(localStorage.getItem(`${localStorage.getItem("userEmail")}_profile`) || "{}");
    return profile.companyName || "";
  });
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState(() => localStorage.getItem("userEmail") || "");

  // Quality report
  const [qualityReport, setQualityReport] = useState(null);
  const fileInputRef = useRef(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setQualityReport(file);
  };

  const handleSubmit = () => {
    const finalWasteType = wasteType === "Other" ? otherWasteType.trim() : wasteType;
    if (!wasteType || (wasteType === "Other" && !otherWasteType.trim()) || !quantity || !price || !locationText.trim()) {
      showToast("⚠️ Please fill in all required fields", "error");
      return;
    }
    if (!contactName.trim() || !contactPhone.trim() || !contactEmail.trim()) {
      showToast("⚠️ Please fill in contact details", "error");
      return;
    }

    // Prepare new listing object
    const newListing = {
      id: Date.now(),
      type: finalWasteType,
      image: (() => {
        const imageMap = {
          copper: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=600&q=80",
          metal: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=600&q=80",
          steel: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=600&q=80",
          aluminum: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
          plastic: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80",
          electronic: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
          pcb: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
          glass: "https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=600&q=80",
          paper: "https://images.unsplash.com/photo-1603484477859-abe6a73f9366?auto=format&fit=crop&w=600&q=80",
          cardboard: "https://images.unsplash.com/photo-1603484477859-abe6a73f9366?auto=format&fit=crop&w=600&q=80",
          chemical: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=600&q=80",
          textile: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
          rubber: "https://images.unsplash.com/photo-1558618047-f8e3d19f4e96?auto=format&fit=crop&w=600&q=80",
          wood: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80",
        };
        const t = finalWasteType.toLowerCase();
        for (const [key, url] of Object.entries(imageMap)) {
          if (t.includes(key)) return url;
        }
        return "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=600&q=80";
      })(),
      location: locationText.split(',')[0],
      qty: `${quantity} ${unit}`,
      price: `${currencySymbol}${price}`,
      status: "Active",
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      contact: { name: contactName, phone: contactPhone, email: contactEmail },
      qualityReport: qualityReport ? qualityReport.name : null,
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

        <h2 className="aw-title stagger-1">
          Add <span className="aw-title--accent">Waste</span>
        </h2>
        <p className="aw-subtitle stagger-1">List your industrial waste for circular reuse</p>

        {/* Waste Type */}
        <div className="aw-field stagger-1">
          <label className="aw-label">Waste Type</label>
          <div className="aw-input-wrap aw-select-wrap">
            <span className="aw-icon">♻️</span>
            <select
              className="aw-select"
              value={wasteType}
              onChange={(e) => { setWasteType(e.target.value); setOtherWasteType(""); }}
            >
              <option value="" disabled>Select waste type</option>
              {WASTE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <span className="aw-chevron">▾</span>
          </div>
          {wasteType === "Other" && (
            <div className="aw-input-wrap aw-other-wrap">
              <span className="aw-icon">✏️</span>
              <input
                className="aw-input"
                type="text"
                placeholder="Please specify your waste type…"
                value={otherWasteType}
                onChange={(e) => setOtherWasteType(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Quantity */}
        <div className="aw-field stagger-1">
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
        <div className="aw-field stagger-2">
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
        <div className="aw-field stagger-2">
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

        {/* Contact Details */}
        <div className="aw-section-divider">
          <span className="aw-section-label">📞 Contact Details</span>
        </div>

        <div className="aw-field">
          <label className="aw-label">Contact Name</label>
          <div className="aw-input-wrap">
            <span className="aw-icon">👤</span>
            <input
              className="aw-input"
              type="text"
              placeholder="Full name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
          </div>
        </div>

        <div className="aw-field">
          <label className="aw-label">Phone Number</label>
          <div className="aw-input-wrap">
            <span className="aw-icon">📱</span>
            <input
              className="aw-input"
              type="tel"
              placeholder="+91 00000 00000"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="aw-field">
          <label className="aw-label">Email Address</label>
          <div className="aw-input-wrap">
            <span className="aw-icon">✉️</span>
            <input
              className="aw-input"
              type="email"
              placeholder="contact@example.com"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Quality Report Upload */}
        <div className="aw-section-divider">
          <span className="aw-section-label">📄 Quality Report</span>
        </div>

        <div className="aw-field">
          <label className="aw-label">Upload Quality Report</label>
          <div
            className={`aw-upload-zone ${qualityReport ? "aw-upload-zone--filled" : ""}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,image/png,image/jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {qualityReport ? (
              <div className="aw-upload-preview">
                <span className="aw-upload-file-icon">
                  {qualityReport.name.match(/\.(jpg|jpeg|png)$/i) ? "🖼️" :
                   qualityReport.name.match(/\.pdf$/i) ? "📕" : "📝"}
                </span>
                <div className="aw-upload-file-info">
                  <span className="aw-upload-file-name">{qualityReport.name}</span>
                  <span className="aw-upload-file-size">{(qualityReport.size / 1024).toFixed(1)} KB</span>
                </div>
                <button
                  className="aw-upload-remove"
                  onClick={(e) => { e.stopPropagation(); setQualityReport(null); if(fileInputRef.current) fileInputRef.current.value = ""; }}
                >×</button>
              </div>
            ) : (
              <>
                <span className="aw-upload-icon">📎</span>
                <p className="aw-upload-text">Click to upload quality report</p>
                <p className="aw-upload-hint">PNG, JPEG, PDF, DOC, DOCX supported</p>
              </>
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
