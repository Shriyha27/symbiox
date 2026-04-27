import { useState } from "react";
import "../styles/Dashboard.css";
import { Link } from "react-router-dom";
import logo from "../logo.png";

export default function Sidebar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const userName = localStorage.getItem("userName");
  const companyName = localStorage.getItem("companyName");
  const userAvatar = localStorage.getItem("userAvatar");
  
  const avatarUrl = userAvatar 
    ? userAvatar
    : (companyName 
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=22c55e&color=fff`
        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");

  const handleLogout = () => {
    localStorage.clear(); // Clear all profile data on logout
    window.location.href = "/";
  };

  return (
    <div className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <img src={logo} alt="Symbiox Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
        <h2 className="logo" style={{ margin: 0 }}>SYMBIOX</h2>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: '15px' }}><Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>🏠 Home</Link></li>
        <li style={{ marginBottom: '15px' }}><Link to="/orders" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>📦 Orders</Link></li>
        <li style={{ marginBottom: '15px' }}><Link to="/sales" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>💰 Sales</Link></li>
        <li style={{ marginBottom: '15px' }}><Link to="/about" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>ℹ️ About Us</Link></li>
        <li style={{ marginBottom: '15px' }}><Link to="/help" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>❓ Help</Link></li>
      </ul>
      
      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', position: 'relative' }}>
        <div onClick={() => setShowDropdown(!showDropdown)} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '8px', borderRadius: '12px', transition: '0.3s', background: showDropdown ? 'rgba(255,255,255,0.05)' : 'transparent' }}>
          <img
            src={avatarUrl}
            alt="profile"
            style={{ borderRadius: '50%', width: '40px', height: '40px', border: '2px solid rgba(34, 197, 94, 0.3)' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span style={{ fontWeight: '600', color: 'white', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {companyName || "Complete Profile"}
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{userName || "Guest"}</span>
          </div>
        </div>
        
        {showDropdown && (
          <div style={{ position: 'absolute', bottom: '70px', left: '0', background: '#1e293b', padding: '8px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', width: '100%', border: '1px solid rgba(255,255,255,0.1)', zIndex: 1000, animation: 'aw-fadeIn 0.2s ease' }}>
            <Link to="/profile" style={{ textDecoration: 'none', color: '#e2e8f0', display: 'block', padding: '10px', borderRadius: '8px', fontSize: '13px', transition: '0.2s' }} className="dropdown-item">
              👤 Manage Profile
            </Link>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' }}></div>
            <div onClick={handleLogout} style={{ color: '#fb7185', padding: '10px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>
              🚪 Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}