import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSocket from "../hooks/useSocket";

let NB_PLAYER_PER_MATCH = -1;

const Matchmaking = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [playersWaiting, setPlayersWaiting] = useState(0);

  useEffect(() => {
    socket.on("updateQueue", ({count, nb_player_per_match}) => {
      setPlayersWaiting(count);
      console.log("receive");
      NB_PLAYER_PER_MATCH = nb_player_per_match;
  });

    socket.on("matchFound", ({ roomId }) => {
      navigate(`/game/${roomId}`);
    });

    return () => {
      socket.off("updateQueue");
      socket.off("matchFound");
    };
  }, [socket, navigate]);

  return (
    <div>
      <h1>Waiting for other players...</h1>
      <p>Waiting players : {playersWaiting} / {NB_PLAYER_PER_MATCH}</p>
    </div>
  );
};

export default Matchmaking;
