import { useState } from 'react';
import Home from './pages/Home/index';
import Header from './components/ui/header';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <Home />
    </>
  );
}

export default App;