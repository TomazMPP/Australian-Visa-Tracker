import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/index';
import Header from './components/ui/header';
import CategoryDetails from './pages/CategoryDetails';
import VisaDetails from './pages/VisaDetails';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories/:id" element={<CategoryDetails />} />
          <Route path="/visa/:visaId/stream/:streamId?" element={<VisaDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;