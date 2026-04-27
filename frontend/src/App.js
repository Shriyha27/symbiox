import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddWaste from "./pages/Addwaste";

// Inside your <Routes>:

import Login from "./pages/Login";
import Market from "./pages/Marketplace";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import Order from "./pages/Order";
import AboutUs from "./pages/AboutUs";
import Sales from "./pages/Sales";
import Help from "./pages/Help";
import Profile from "./pages/Profile";
import AIAssistant from "./components/AIAssistant";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/add-waste" element={<AddWaste />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add" element={<AddWaste />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/help" element={<Help />} />
        <Route path="/market" element={<Market />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <AIAssistant />
    </BrowserRouter>
  );
}