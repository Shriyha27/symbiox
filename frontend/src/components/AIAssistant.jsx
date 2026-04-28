import { useState } from "react";
import "./AIAssistant.css";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm Symbi, your AI sustainability assistant. How can I help you today?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState("");

  const quickActions = [
    "How to list waste?",
    "Check market prices",
    "Find nearest buyers",
    "Track CO2 savings"
  ];

  const handleSend = (text) => {
    const userMessage = text || inputValue;
    if (!userMessage.trim()) return;

    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInputValue("");

    // Professional Response Logic
    setTimeout(() => {
      const input = userMessage.toLowerCase();
      let botResponse = "I'm not sure about that specific detail, but I can help you with listing waste, checking market prices, or finding nearest buyers. Try asking 'How to sell?'";

      if (input.includes("hi") || input.includes("hello") || input.includes("hey")) {
        botResponse = "Hello! I'm Symbi. I can help you navigate the Symbiox platform. Would you like to list new waste or browse active orders?";
      } else if (input.includes("sell") || input.includes("list")) {
        botResponse = "To sell waste: 1. Go to the 'Add Waste' page. 2. Fill in the material type, quantity, and your location. 3. Once listed, your waste will appear on the Dashboard for potential buyers.";
      } else if (input.includes("buy") || input.includes("order")) {
        botResponse = "To buy materials: Navigate to the 'Orders' page. You can browse available listings and click 'Order Now' to start the procurement process.";
      } else if (input.includes("price") || input.includes("market") || input.includes("cost")) {
        botResponse = "Market Update: Recycled Metal prices are currently stable at ₹18,000/tonne. Plastic polymers are seeing a 5% increase in demand from the Delhi industrial sector.";
      } else if (input.includes("co2") || input.includes("carbon") || input.includes("environment")) {
        botResponse = "By using Symbiox, you're contributing to a circular economy. Every tonne of metal recycled saves roughly 1.5 tonnes of CO2 compared to primary production!";
      } else if (input.includes("about") || input.includes("symbiox")) {
        botResponse = "Symbiox is an AI-powered circular economy platform that connects industrial waste generators with recyclers to minimize landfill waste and maximize resource efficiency.";
      } else if (input.includes("nearest") || input.includes("location") || input.includes("buyer")) {
        botResponse = "Our matching algorithm automatically finds the closest buyer for your listing to minimize transportation emissions and costs. Check your 'Sales' page to see active matches.";
      }
      
      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    }, 800);
  };

  return (
    <div className="ai-assistant-container">
      {/* Floating Button */}
      <div 
        className={`ai-fab ${isOpen ? "active" : ""}`} 
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with Symbi"
      >
        <span className="ai-icon">🤖</span>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>🤖</span>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px' }}>Symbi AI</h4>
                <span style={{ fontSize: '11px', color: '#22c55e' }}>● Online</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '20px' }}>×</button>
          </div>

          <div className="ai-chat-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`ai-message ${msg.isBot ? "bot" : "user"}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="ai-quick-actions">
            {quickActions.map(action => (
              <button key={action} onClick={() => handleSend(action)} className="quick-action-btn">
                {action}
              </button>
            ))}
          </div>

          <div className="ai-chat-footer">
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={() => handleSend()}>📩</button>
          </div>
        </div>
      )}
    </div>
  );
}
