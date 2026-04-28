import { useState } from "react";
import API from "../api";
import "../styles/global.css";
import logo from "../logo.png";
export default function Login() {
  const [mode, setMode] = useState("login"); // login/signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  
  const handleSubmit = async () => {
    if (!email || !password || (mode === "signup" && (!company || !industry))) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    
    try {
      if (mode === "login") {
        const res = await API.post("/users/login", { email, password });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userEmail", email);
        
        // Initialize or update scoped profile with server-side info if available
        const profileKey = `${email}_profile`;
        const existingProfile = JSON.parse(localStorage.getItem(profileKey) || "{}");
        const updatedProfile = {
          ...existingProfile,
          companyName: res.data.companyName || existingProfile.companyName || "",
          email: email
        };
        localStorage.setItem(profileKey, JSON.stringify(updatedProfile));
        
        localStorage.setItem("userName", updatedProfile.companyName || email);
      } else {
        await API.post("/users/register", {
          email,
          password,
          companyName: company
        });
        alert("Signup successful! Now login");
        setMode("login");
        setLoading(false);
        return;
      }

      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error:", err);
      const isNetworkError = err.message === "Network Error";
      const isNotFoundError = err.response?.status === 404;
      
      if (isNetworkError || isNotFoundError) {
        console.warn("Backend connectivity issue. Offering Demo Mode.");
        // Simulate a successful login for demo purposes on mobile/deployment
        if (window.confirm("🚀 Backend unreachable or not responding. Would you like to enter Demo Mode to preview the platform?")) {
          const demoEmail = email || "demo@symbiox.com";
          localStorage.setItem("token", "demo-token");
          localStorage.setItem("userEmail", demoEmail);
          const profileKey = `${demoEmail}_profile`;
          const demoProfile = { companyName: company || "Symbiox Demo Corp", email: demoEmail };
          localStorage.setItem(profileKey, JSON.stringify(demoProfile));
          localStorage.setItem("userName", demoProfile.companyName);
          window.location.href = "/dashboard";
        }
      } else {
        alert(err.response?.data || "Error occurred during login. Please check your credentials or use Demo Mode.");
      }
    }

    setLoading(false);
  };
  
  return (
    <div className="login-page">
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      
      <div className="login-card-wrapper">
        <div className="login-card">
          <div className="login-header">
            <h2 className="login-title">
              <img src={logo} alt="Symbiox Logo" style={{ width: '48px', height: '48px', objectFit: 'contain' }} /> SYMBIOX
            </h2>
            <p className="login-subtitle">Turning Waste into Opportunity</p>
          </div>

          {/* Toggle */}
          <div className="toggle-container">
            <div className="toggle">
              <div
                className={mode === "login" ? "active" : ""}
                onClick={() => setMode("login")}
              >
                Login
              </div>
              <div
                className={mode === "signup" ? "active" : ""}
                onClick={() => setMode("signup")}
              >
                Sign Up
              </div>
            </div>
          </div>

          <div className="auth-form-container">
            {/* Company field (only signup) */}
            {mode === "signup" && (
              <div className="animate-in">
                <div className="input-group">
                  <input type="text" placeholder=" " value={company} onChange={(e) => setCompany(e.target.value)} />
                  <label>Company Name</label>
                </div>

                <div className="input-group">
                  <input type="text" placeholder=" " value={industry} onChange={(e) => setIndustry(e.target.value)} />
                  <label>Industry Type</label>
                </div>
              </div>
            )}

            {/* Email */}
            <div className="input-group">
              <input type="email" placeholder=" " value={email} onChange={(e) => setEmail(e.target.value)} />
              <label>Email Address</label>
            </div>

            {/* Password */}
            <div className="input-group">
              <input
                type={show ? "text" : "password"}
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
              <span className="eye-icon" onClick={() => setShow(!show)}>
                {show ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {/* Button */}
          <button className="submit-btn login-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? <div className="spinner"></div> : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          <button 
            className="social-btn" 
            style={{ marginTop: '12px', background: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' }}
            onClick={() => {
              const email = "demo@symbiox.com";
              localStorage.setItem("token", "demo-token");
              localStorage.setItem("userEmail", email);
              const profileKey = `${email}_profile`;
              const demoProfile = { companyName: "Symbiox Demo Corp", email: email };
              localStorage.setItem(profileKey, JSON.stringify(demoProfile));
              localStorage.setItem("userName", demoProfile.companyName);
              window.location.href = "/dashboard";
            }}
          >
            🚀 Try Demo Mode (No Backend)
          </button>
          
          <div className="divider">
            <span>or continue with</span>
          </div>
          
          <div className="social-login">
            <button className="social-btn">Google</button>
            <button className="social-btn">Linkedin</button>
          </div>
        </div>
      </div>
    </div>
  );
}