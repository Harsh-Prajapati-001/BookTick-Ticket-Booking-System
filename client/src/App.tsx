import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SeatMap from './pages/SeatMap';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/show/:id" element={<SeatMap />} />
      </Routes>
    </Router>
  );
}

export default App;
