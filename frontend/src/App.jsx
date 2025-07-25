import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home/index';
import Header from './components/ui/header';
import CategoryDetails from './pages/CategoryDetails';
import VisaDetails from './pages/VisaDetails';
import AnalyticsDashboard from './pages/Analytics';
import Footer from "./components/ui/footer";
import { Analytics } from "@vercel/analytics/react"
import DonationPage from "./pages/DonationPage";
import SEOManager from "./components/SEOManager";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <SEOManager />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories/:id" element={<CategoryDetails />} />
          <Route path="/visa/:visaCode/stream/:streamId?" element={<VisaDetails />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/donate" element={<DonationPage />} />
        </Routes>
        <Analytics />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;