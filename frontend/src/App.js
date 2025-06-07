import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WasteSorter from './pages/WasteSorter';
import MiniGames from './pages/MiniGames';
import InvisibleHeroes from './pages/InvisibleHeroes';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sorter" element={<WasteSorter />} />
        <Route path="/games" element={<MiniGames />} />
        <Route path="/heroes" element={<InvisibleHeroes />} />
      </Routes>
    </Router>
  );
}

export default App;