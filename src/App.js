import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StageSelect from './components/StageSelect';
import Game from './components/Game';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StageSelect />} />
        <Route path="/stage/:stageId" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;