import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WasteSorter from './pages/WasteSorter';
import MiniGames from './pages/MiniGames';
import InvisibleHeroes from './pages/InvisibleHeroes';
import Navbar from './components/Navbar';
import api from './services/api';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => {
          setUser(null);
          localStorage.removeItem("token");
        });
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sorter" element={<WasteSorter user={user} setUser={setUser} />} />
        <Route path="/games" element={<MiniGames />} />
        <Route path="/heroes" element={<InvisibleHeroes />} />
      </Routes>
    </Router>
  );
}

export default App;