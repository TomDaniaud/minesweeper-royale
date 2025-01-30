import {React, useState} from "react";
import { useNavigate } from "react-router-dom";
import useSocket from "../hooks/useSocket";

const HomePage = () => {
  const [playerName, setPlayerName] = useState(`Player${Math.floor(Math.random() * 100)}`);
  const navigate = useNavigate();
  const socket = useSocket();

  const joinQueue = () => {
    navigate("/matchmaking");
    socket.emit("joinQueue", playerName);
  };

  return (
    <div className="home-page">
      <h1>Welcome on Minesweeper BR !</h1>
      <input
        type="text"
        placeholder="Enter a name"
        className="px-4 py-2 border rounded-lg text-black"
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button onClick={() => joinQueue()}>🎮 Play</button>
    </div>
  );
};

export default HomePage;
