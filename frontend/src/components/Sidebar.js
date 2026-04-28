import { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import "../pages/Addwaste.css";
import { Link } from "react-router-dom";
import logo from "../logo.png";

export default function Sidebar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const userEmail = localStorage.getItem("userEmail") || "guest";
  const profileKey = `${userEmail}_profile`;
  const notifKey = `${userEmail}_notifications`;

  const profile = JSON.parse(localStorage.getItem(profileKey) || "{}");
  const userName = profile.email || "Guest";
  const companyName = profile.companyName || "";
  const userAvatar = profile.avatarUrl || "";

  const avatarUrl = userAvatar
    ? userAvatar
    : (companyName
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=22c55e&color=fff`
      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");

  // Load notifications from localStorage
  useEffect(() => {
    const loadNotifs = () => {
      const stored = JSON.parse(localStorage.getItem(notifKey) || "[]");
      setNotifications(stored);
    };
    loadNotifs();
    // Poll every 3s to pick up new notifications from other pages
    const interval = setInterval(loadNotifs, 3000);
    return () => clearInterval(interval);
  }, [notifKey]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem(notifKey, JSON.stringify(updated));
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        style={{
          display: "none",
          position: "fixed",
          top: "20px",
          left: "20px",
          zIndex: 1001,
          background: "rgba(34, 197, 94, 0.9)",
          border: "none",
          color: "white",
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}
      >
        {isMobileMenuOpen ? "×" : "☰"}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 99
          }}
        />
      )}

      <div className={`sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <img src={logo} alt="Symbiox Logo" style={{ width: "40px", height: "40px", objectFit: "contain" }} />
        <h2 className="logo" style={{ margin: 0 }}>SYMBIOX</h2>
      </div>

      {/* Nav Links */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: "15px" }}>
          <Link to="/dashboard" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "10px" }}>🏠 Home</Link>
        </li>
        <li style={{ marginBottom: "15px" }}>
          <Link to="/orders" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "10px" }}>📦 Orders</Link>
        </li>
        <li style={{ marginBottom: "15px" }}>
          <Link to="/sales" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "10px" }}>💰 Sales</Link>
        </li>
        <li style={{ marginBottom: "15px" }}>
          <Link to="/analytics" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "10px" }}>📊 Analytics</Link>
        </li>
        <li style={{ marginBottom: "15px" }}>
          <Link to="/about" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "10px" }}>ℹ️ About Us</Link>
        </li>
        <li style={{ marginBottom: "15px" }}>
          <Link to="/help" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "10px" }}>❓ Help</Link>
        </li>
      </ul>

      {/* Bottom Section */}
      <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px", position: "relative" }}>

        {/* Notification Bell */}
        <div
          className="notif-bell-wrap"
          onClick={() => { setShowNotifs(!showNotifs); setShowDropdown(false); }}
          style={{ marginBottom: "12px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#94a3b8" }}>
            <span style={{ fontSize: "20px" }}>🔔</span>
            <span>Notifications</span>
          </div>
          {unreadCount > 0 && (
            <span className="notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
          )}
        </div>

        {/* Notification Panel */}
        {showNotifs && (
          <div className="notif-panel">
            <div className="notif-panel-header">
              <h4>🔔 Notifications</h4>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {unreadCount > 0 && (
                  <button className="notif-mark-read" onClick={markAllRead}>Mark all read</button>
                )}
                <button
                  onClick={() => setShowNotifs(false)}
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#94a3b8",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "14px",
                    lineHeight: 1,
                    flexShrink: 0,
                    transition: "background 0.2s, color 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,80,80,0.15)"; e.currentTarget.style.color = "#f87171"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#94a3b8"; }}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="notif-list">
              {notifications.length === 0 ? (
                <div className="notif-empty">
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>📭</div>
                  No notifications yet
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className={`notif-item ${!n.read ? "notif-item--unread" : ""}`}>
                    <div className="notif-item__title">{n.title}</div>
                    <div className="notif-item__msg">{n.message}</div>
                    <div className="notif-item__time">{n.time}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Profile Row */}
        <div
          onClick={() => { setShowDropdown(!showDropdown); setShowNotifs(false); }}
          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", padding: "8px", borderRadius: "12px", transition: "0.3s", background: showDropdown ? "rgba(255,255,255,0.05)" : "transparent" }}
        >
          <img
            src={avatarUrl}
            alt="profile"
            style={{ borderRadius: "50%", width: "40px", height: "40px", border: "2px solid rgba(34, 197, 94, 0.3)", objectFit: "cover", flexShrink: 0 }}
          />
          <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <span style={{ fontWeight: "600", color: "white", fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {companyName || "Complete Profile"}
            </span>
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>{userName}</span>
          </div>
        </div>

        {/* Profile Dropdown */}
        {showDropdown && (
          <div style={{ position: "absolute", bottom: "70px", left: "0", background: "#1e293b", padding: "8px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.5)", width: "100%", border: "1px solid rgba(255,255,255,0.1)", zIndex: 1000, animation: "aw-fadeIn 0.2s ease" }}>
            <Link to="/profile" style={{ textDecoration: "none", color: "#e2e8f0", display: "block", padding: "10px", borderRadius: "8px", fontSize: "13px", transition: "0.2s" }} className="dropdown-item">
              👤 Manage Profile
            </Link>
            <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "4px 0" }} />
            <div onClick={handleLogout} style={{ color: "#fb7185", padding: "10px", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: "500" }}>
              🚪 Logout
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}