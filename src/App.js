import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import StageSelect from './components/StageSelect';
import Game from './components/Game';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<StageSelect />} />
        <Route path="/stage/:stageId" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;