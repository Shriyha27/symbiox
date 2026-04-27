import Sidebar from "../components/Sidebar";

export default function AboutUs() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content" style={{ marginLeft: '250px', padding: '40px', width: 'calc(100% - 250px)', color: 'white' }}>
        <div className="content-wrapper" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '20px', fontWeight: '600' }}>About <span style={{ color: '#22c55e' }}>Us</span></h2>
          
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', padding: '40px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#e2e8f0' }}>
              Welcome to <strong>SYMBIOX</strong>. We are a premier B2B industrial waste marketplace dedicated to bridging the gap between waste generators and recyclers.
            </p>
            <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#e2e8f0', marginTop: '20px' }}>
              Our mission is to foster a circular economy by turning industrial byproducts into valuable resources, helping companies reduce their carbon footprint, and creating a sustainable future for the next generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
