import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

const DEFAULT_ITEMS = [
  { id: 1, type: "Copper Scrap", image: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=600&q=80", location: "Mumbai", qty: "2.4 tonnes", price: "$4,500" },
  { id: 2, type: "Industrial Plastic", image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80", location: "Pune", qty: "850 kg", price: "$1,200" },
  { id: 3, type: "Electronic PCBS", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80", location: "Bangalore", qty: "120 units", price: "$2,800" },
  { id: 4, type: "Aluminum Cans", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80", location: "Surat", qty: "1.5 tonnes", price: "$3,100" },
  { id: 5, type: "Glass Cullet", image: "https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=600&q=80", location: "Chennai", qty: "2,000 kg", price: "$900" },
  { id: 6, type: "Cardboard Bales", image: "https://images.unsplash.com/photo-1603484477859-abe6a73f9366?auto=format&fit=crop&w=600&q=80", location: "Delhi", qty: "3.2 tonnes", price: "$1,800" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ waste: 0, revenue: 0, co2: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [items, setItems] = useState([]);
  const [results, setResults] = useState([]);
  const userEmail = localStorage.getItem("userEmail") || "guest";
  useEffect(() => {
    // Waste type → image mapping
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
      default: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=600&q=80"
    };

    const getImage = (type = "") => {
      const t = type.toLowerCase();
      for (const [key, url] of Object.entries(imageMap)) {
        if (t.includes(key)) return url;
      }
      return imageMap.default;
    };

    // Load user-specific listings and assign images where missing
    const userListings = JSON.parse(localStorage.getItem(`${userEmail}_listings`) || "[]");
    const normalizedListings = userListings.map(item => ({
      ...item,
      image: item.image || getImage(item.type || item.wasteType),
      qty: item.qty || item.quantity || "N/A",
      location: item.location || item.loc || "N/A"
    }));

    const allItems = [...normalizedListings, ...DEFAULT_ITEMS];
    setItems(allItems);

    // CO2 Factors (kg saved per kg of material)
    const co2Factors = {
      metal: 4.0,
      copper: 4.5,
      aluminum: 3.8,
      plastic: 1.5,
      paper: 0.9,
      cardboard: 0.8,
      glass: 0.3,
      electronic: 2.5,
      pcb: 3.0,
      other: 1.0
    };

    const calculateStats = () => {
      let totalWaste = 0;
      let totalCO2 = 0;

      allItems.forEach(item => {
        // Parse quantity (e.g., "2.4 tonnes" or "850 kg")
        const qtyValue = parseFloat(item.qty || item.quantity || 0);
        const qtyLower = (item.qty || item.quantity || "").toLowerCase();
        
        let weightInKg = qtyValue;
        if (qtyLower.includes('tonne')) weightInKg = qtyValue * 1000;
        else if (qtyLower.includes('unit')) weightInKg = qtyValue * 0.5; // Estimated avg unit weight

        totalWaste += weightInKg;

        // Determine factor based on material type
        const typeLower = item.type.toLowerCase();
        let factor = co2Factors.other;
        
        for (const [key, val] of Object.entries(co2Factors)) {
          if (typeLower.includes(key)) {
            factor = val;
            break;
          }
        }

        totalCO2 += weightInKg * factor;
      });

      return {
        waste: Math.round(totalWaste),
        revenue: 4500 + (userListings.length * 200), // Simulated revenue growth
        co2: Math.round(totalCO2)
      };
    };

    setStats(calculateStats());
  }, [userEmail]);

  const handleOrder = (item) => {
    const orderKey = `${userEmail}_orders`;
    const currentOrders = JSON.parse(localStorage.getItem(orderKey) || "[]");
    
    const newOrder = {
      ...item,
      orderId: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      status: "Processing",
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    };
    
    localStorage.setItem(orderKey, JSON.stringify([newOrder, ...currentOrders]));
    alert(`✅ Order placed for ${item.type}! It will appear in your Orders list.`);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) {
      setIsSearching(false);
      setResults([]);
      return;
    }
    
    const filtered = items.filter(item => 
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setResults(filtered);
    setIsSearching(true);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
    setResults([]);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="content-wrapper">
          <div className="dashboard-header stagger-1">
            <h2>Dashboard</h2>
            
            <div className="header-actions">
              <form className="search-container" onSubmit={handleSearch}>
                <input 
                  type="text" 
                  placeholder="Search waste, materials..." 
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="search-btn">Search</button>
              </form>
              
              <div className="action-buttons">
                <button className="btn add-waste-btn" onClick={() => navigate('/add')}>+ Add Waste</button>
                <button className="btn order-now-btn" onClick={() => navigate('/orders')}>Order Now</button>
              </div>
            </div>
          </div>

          <div className="cards">
            <div className="card stagger-1" onClick={() => navigate('/analytics')} style={{ cursor: 'pointer' }}>
              <h3>{stats.waste.toLocaleString()} kg</h3>
              <p>Waste Listed</p>
            </div>
            <div className="card stagger-2" onClick={() => navigate('/analytics')} style={{ cursor: 'pointer' }}>
              <h3>${stats.revenue.toLocaleString()}</h3>
              <p>Revenue</p>
            </div>
            <div className="card stagger-3" onClick={() => navigate('/analytics')} style={{ cursor: 'pointer' }}>
              <h3>{stats.co2.toLocaleString()} kg</h3>
              <p>CO₂ Saved</p>
            </div>
          </div>

          <div className="recent-searches-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>{isSearching ? `Search Results for "${searchTerm}"` : "Trending Materials"}</h3>
            {isSearching && (
              <button onClick={clearSearch} className="clear-search-btn">
                Clear Results
              </button>
            )}
          </div>

          <div className="search-list">
            {(isSearching ? results : items.slice(0, 4)).map((item, index) => (
              <div key={item.id} className={`search-card stagger-${(index % 4) + 1}`}>
                <img 
                  src={item.image} 
                  alt={item.type} 
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.type)}&background=1e293b&color=22c55e&size=400&bold=true`;
                  }}
                />
                <div className="search-card-info">
                  <p className="item-type" style={{ marginBottom: '4px' }}>{item.type}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '13px', color: '#94a3b8' }}>
                    <span>📍 {item.location}</span>
                    <span style={{ color: '#22c55e', fontWeight: '600' }}>{item.qty}</span>
                  </div>
                  
                  <button 
                    className="aw-sell-btn" 
                    style={{ marginTop: '16px', width: '100%', fontSize: '12px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOrder(item);
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {isSearching && results.length === 0 && (
            <div style={{ width: '100%', textAlign: 'center', padding: '60px', color: '#94a3b8' }} className="fade-in">
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🔍</span>
              <p>No results found for "{searchTerm}".</p>
              <p style={{ fontSize: '13px', marginTop: '8px' }}>Try searching for "Copper", "Plastic", or "Mumbai".</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}