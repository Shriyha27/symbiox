import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Addwaste.css";

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({
    companyName: localStorage.getItem("companyName") || "",
    industry: localStorage.getItem("industry") || "",
    location: localStorage.getItem("location") || "",
    website: localStorage.getItem("website") || "",
    bio: localStorage.getItem("bio") || "",
    email: localStorage.getItem("userEmail") || "",
    avatarUrl: localStorage.getItem("userAvatar") || ""
  });

  const [toast, setToast] = useState({ show: false, message: "" });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg") {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfile({ ...profile, avatarUrl: reader.result });
        };
        reader.readAsDataURL(file);
      } else {
        setToast({ show: true, message: "⚠️ Please upload PNG or JPEG only" });
        setTimeout(() => setToast({ show: false, message: "" }), 3000);
      }
    }
  };

  const handleSave = () => {
    Object.keys(profile).forEach(key => {
      localStorage.setItem(key, profile[key]);
    });
    localStorage.setItem("userName", profile.companyName || profile.email);
    localStorage.setItem("userAvatar", profile.avatarUrl);
    
    setToast({ show: true, message: "✅ Profile updated successfully!" });
    setTimeout(() => {
      setToast({ show: false, message: "" });
      navigate("/dashboard");
    }, 1800);
  };

  const currentAvatar = profile.avatarUrl || (profile.companyName 
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.companyName)}&background=22c55e&color=fff&size=120` 
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="aw-page" style={{ flex: 1, marginLeft: '250px', flexDirection: 'column', justifyContent: 'flex-start', padding: '80px 40px' }}>
        <div className="aw-blob aw-blob--1" />
        <div className="aw-blob aw-blob--2" />

        <div className="aw-container">
          <div className="aw-layout-grid">
            <div className="aw-card" style={{ margin: 0, animationDelay: '0.1s' }}>
              <div className="aw-badge">
                <span className="aw-badge__dot" />
                User Settings
              </div>

              <h2 className="aw-title">
                Update <span className="aw-title--accent">Profile</span>
              </h2>
              <p className="aw-subtitle">Complete your business profile to build trust</p>

              {/* Profile Picture Section */}
              <div className="aw-field">
                <label className="aw-label">Profile Picture</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="aw-input-wrap">
                    <span className="aw-icon">🔗</span>
                    <input
                      className="aw-input"
                      type="text"
                      name="avatarUrl"
                      placeholder="Paste image URL here"
                      value={profile.avatarUrl.startsWith('data:') ? 'Local file uploaded' : profile.avatarUrl}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', flex: 1 }}></div>
                    <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>or</span>
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', flex: 1 }}></div>
                  </div>

                  <button 
                    className="aw-submit-btn" 
                    style={{ marginTop: 0, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '13px', boxShadow: 'none' }}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <span>📁</span> Upload PNG/JPEG
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/png, image/jpeg"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              <div className="aw-field">
                <label className="aw-label">Company Name</label>
                <div className="aw-input-wrap">
                  <span className="aw-icon">🏢</span>
                  <input
                    className="aw-input"
                    type="text"
                    name="companyName"
                    placeholder="Enter company name"
                    value={profile.companyName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="aw-field">
                <label className="aw-label">Industry Type</label>
                <div className="aw-input-wrap">
                  <span className="aw-icon">🏭</span>
                  <input
                    className="aw-input"
                    type="text"
                    name="industry"
                    placeholder="e.g. Manufacturing, Logistics"
                    value={profile.industry}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="aw-field">
                <label className="aw-label">Location</label>
                <div className="aw-input-wrap">
                  <span className="aw-icon">📍</span>
                  <input
                    className="aw-input"
                    type="text"
                    name="location"
                    placeholder="City, State"
                    value={profile.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="aw-field">
                <label className="aw-label">Website</label>
                <div className="aw-input-wrap">
                  <span className="aw-icon">🌐</span>
                  <input
                    className="aw-input"
                    type="url"
                    name="website"
                    placeholder="https://example.com"
                    value={profile.website}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="aw-field" style={{ marginBottom: '32px' }}>
                <label className="aw-label">Business Bio</label>
                <div className="aw-input-wrap">
                  <textarea
                    className="aw-input"
                    name="bio"
                    placeholder="Briefly describe your business goals..."
                    style={{ minHeight: '100px', resize: 'vertical', paddingLeft: '16px' }}
                    value={profile.bio}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button className="aw-submit-btn" onClick={handleSave}>
                <span>💾</span> Save Profile Changes
              </button>
            </div>

            <div className="aw-history-section" style={{ marginTop: 0, animationDelay: '0.3s' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '40px', border: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
                <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 24px' }}>
                  <img
                    src={currentAvatar}
                    alt="profile-preview"
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid rgba(34, 197, 94, 0.2)' }}
                  />
                  <div style={{ position: 'absolute', bottom: '0', right: '0', background: '#22c55e', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #0f172a', fontSize: '14px' }}>
                    📸
                  </div>
                </div>
                
                <h3 style={{ fontSize: '24px', color: '#fff', marginBottom: '8px' }}>
                  {profile.companyName || "Your Company Name"}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
                  {profile.industry || "Industry Not Set"} • {profile.location || "Location Not Set"}
                </p>
                
                <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#4ade80', letterSpacing: '1px', marginBottom: '12px' }}>Account Status</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Profile Strength</span>
                    <span style={{ color: '#fff' }}>{profile.bio ? "Strong" : "Basic"}</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: profile.bio ? '100%' : '30%', height: '100%', background: '#22c55e' }} />
                  </div>
                </div>
              </div>
            </div>
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
