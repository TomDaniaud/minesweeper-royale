import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSocket from "../hooks/useSocket";


const WaitingPage = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [playersWaiting, setPlayersWaiting] = useState(0);
  const [nbPlayerPerMatch, setNbPlayerPerMatch] = useState(0);

  useEffect(() => {
    socket.on("updateQueue", ({ count, nb_player_per_match }: { count: number, nb_player_per_match: number }) => {
      setPlayersWaiting(count);
      setNbPlayerPerMatch(nb_player_per_match || -1);
    });

    socket.on("matchFound", ({ roomId }) => {
      navigate(`/game/${roomId}`);
    });

    return () => {
      socket.off("updateQueue");
      socket.off("matchFound");
    };
  }, [socket, navigate]);

  const cancel = () => {
    navigate('/');
    socket.emit("cancelQueue");
  }

  return (
    <div>
      <h1>Waiting for other players...</h1>
      <p>Waiting players : {playersWaiting} / {nbPlayerPerMatch}</p>
      <button onClick={() => cancel()}>Cancel</button>
    </div>
  );
};

export default WaitingPage;
