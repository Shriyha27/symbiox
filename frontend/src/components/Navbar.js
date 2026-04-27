import { useState } from "react";
import "../styles/Dashboard.css";

export default function Navbar() {
  const [show, setShow] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const userName = localStorage.getItem("userName") || "Guest";

  return (
    <div className="navbar">
      <div className="profile" onClick={() => setShow(!show)} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          style={{ borderRadius: '50%' }}
        />
        <span style={{ fontWeight: '500', color: '#333' }}>{userName}</span>
      </div>

      {show && (
        <div className="dropdown">
          <p onClick={logout}>Logout</p>
        </div>
      )}
    </div>
  );
}