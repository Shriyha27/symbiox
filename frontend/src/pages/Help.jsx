import Sidebar from "../components/Sidebar";

export default function Help() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content" style={{ marginLeft: '250px', padding: '40px', width: 'calc(100% - 250px)', color: 'white' }}>
        <div className="content-wrapper stagger-1" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '20px', fontWeight: '600' }} className="stagger-1">Help & <span style={{ color: '#22c55e' }}>Support</span></h2>
          
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', padding: '40px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} className="stagger-2">
            <h3 style={{ fontSize: '20px', color: '#e2e8f0', marginBottom: '10px' }}>Contact Us</h3>
            <p style={{ fontSize: '16px', color: '#94a3b8', marginBottom: '30px' }}>Need assistance with the platform? Our support team is here to help.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <strong>📧 Email:</strong> support@symbiox.com
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <strong>📞 Phone:</strong> +1 (800) 123-4567
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
