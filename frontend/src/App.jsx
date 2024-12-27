import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/index';
import Header from './components/ui/header';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen dark:bg-gray-950">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;