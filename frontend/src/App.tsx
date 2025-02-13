import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import GameBoard from "./components/GameBoard";
import WaitingPage from "./components/WaitingPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/matchmaking" element={<WaitingPage />} />
        <Route path="/game/:roomId" element={<GameBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
