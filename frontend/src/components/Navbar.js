import { useState } from "react";
import "../styles/Dashboard.css";

export default function Navbar() {
  const [show, setShow] = useState(false);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const userEmail = localStorage.getItem("userEmail") || "guest";
  const profileKey = `${userEmail}_profile`;
  const profile = JSON.parse(localStorage.getItem(profileKey) || "{}");
  const userName = profile.companyName || profile.email || "Guest";

  return (
    <div className="navbar">
      <div className="profile" onClick={() => setShow(!show)} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
        <img
          src={profile.avatarUrl || "https://i.pravatar.cc/40"}
          alt="profile"
          style={{ borderRadius: '50%', width: '32px', height: '32px', objectFit: 'cover' }}
        />
        <span style={{ fontWeight: '500', color: 'white' }}>{userName}</span>
      </div>

      {show && (
        <div className="dropdown">
          <p onClick={logout}>Logout</p>
        </div>
      )}
    </div>
  );
}