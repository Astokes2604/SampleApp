import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Stack from './components/AboutStack';
import Contact from './components/Contact';
import Pokemon from './components/Gallery';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app demon-bg">
        <nav className="navbar demon-border">
          <Link to="/">Home</Link>
          <Link to="/stack">My Stack</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/pokemonlist">Pokemon</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stack" element={<Stack />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pokemonlist" element={<Pokemon />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;