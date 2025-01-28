import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./componets/HomePage";
import GameBoard from "./componets/GameBoard";
import Matchmaking from "./componets/Matchmaking";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/matchmaking" element={<Matchmaking />} />
        <Route path="/game/:roomId" element={<GameBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
