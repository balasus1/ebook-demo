import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import ReaderPage from './ReaderPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reader" element={<ReaderPage />} />
      </Routes>
    </Router>
  );
}

export default App;
