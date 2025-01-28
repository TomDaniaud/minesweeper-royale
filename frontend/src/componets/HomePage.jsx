import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <h1>Welcome on Minesweeper BR !</h1>
      <button onClick={() => navigate("/matchmaking")}>🎮 Play</button>
    </div>
  );
};

export default HomePage;
