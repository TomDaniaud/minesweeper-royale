import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSocket from "../hooks/useSocket";

const Matchmaking = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [playersWaiting, setPlayersWaiting] = useState(0);

  useEffect(() => {
    socket.on("updateQueue", (count) => setPlayersWaiting(count));

    socket.on("matchFound", ({ roomId }) => {
      navigate(`/game/${roomId}`);
      socket.emit("requestGameState");
    });

    return () => {
      socket.off("updateQueue");
      socket.off("matchFound");
    };
  }, [socket, navigate]);

  const joinQueue = () => {
    socket.emit("joinQueue");
  };

  return (
    <div>
      <h1>En attente d'autres joueurs...</h1>
      <p>Joueurs en attente : {playersWaiting}</p>
      <button onClick={joinQueue}>Rejoindre la partie</button>
    </div>
  );
};

export default Matchmaking;
