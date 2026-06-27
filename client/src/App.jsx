import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Verify from './pages/Verify';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-certificate" element={<Dashboard />} />
        <Route path="/verify/:certificateId" element={<Verify />} />
      </Routes>
    </Router>
  );
}
