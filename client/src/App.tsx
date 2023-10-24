import React, {useEffect, useMemo, useState} from "react";
import styled from "styled-components";
import "./App.css";
import socketService from "./services/socketService";
import { JoinRoom } from "./components/joinRoom/JoinRoom";
import GameContext, { IGameContextProps } from "./gameContext";
import { Game } from "./components/game/Game";

function App() {
  const [isInRoom, setInRoom] = useState(false);
  const [isFirstInRoom, setFirstInRoom] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState<"x" | "o">("x");
  const [isPlayerTurn, setPlayerTurn] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);

  const connectSocket = async () => {
    const socket = await socketService
      .connect(process.env.REACT_APP_SERVER_URL ?? "http://localhost:9000")
      .catch((err) => {
        console.log("Error: ", err);
      });
  };

  useEffect(() => {
    connectSocket();
  }, []);

  const gameContextValue: IGameContextProps = useMemo(() => ({
    isInRoom,
    setInRoom,
    isFirstInRoom,
    setFirstInRoom,
    playerSymbol,
    setPlayerSymbol,
    isPlayerTurn,
    setPlayerTurn,
    isGameStarted,
    setGameStarted,
  }), [isInRoom, isFirstInRoom, playerSymbol, isPlayerTurn, isGameStarted]);

  return (
    <GameContext.Provider value={gameContextValue}>
      <div className="wrapperContainer">
        <h1 className="homeText">Welcome to Tic-Tac-Toe</h1>
        <div className="mainContainer">
          {!isInRoom && <JoinRoom />}
          {isInRoom && <Game />}
        </div>
      </div>
    </GameContext.Provider>
  );
}

export default App;
