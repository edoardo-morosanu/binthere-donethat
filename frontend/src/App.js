import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WasteSorter from './pages/WasteSorter';
import MiniGames from './pages/MiniGames';
import InvisibleHeroes from './pages/InvisibleHeroes';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sorter" element={<WasteSorter />} />
        <Route path="/games" element={<MiniGames />} />
        <Route path="/heroes" element={<InvisibleHeroes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;