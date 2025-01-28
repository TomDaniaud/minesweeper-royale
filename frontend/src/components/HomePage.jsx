import React from "react";
import { useNavigate } from "react-router-dom";
import useSocket from "../hooks/useSocket";

const HomePage = () => {
  const navigate = useNavigate();
  const socket = useSocket();

  const joinQueue = () => {
    navigate("/matchmaking");
    socket.emit("joinQueue");
  };

  return (
    <div className="home-page">
      <h1>Welcome on Minesweeper BR !</h1>
      <button onClick={() => joinQueue()}>🎮 Play</button>
    </div>
  );
};

export default HomePage;
