import React, {useEffect, useMemo, useState} from "react";
import styled from "styled-components";
import "./App.css";
import socketService from "./services/socketService/SocketService";
import { JoinRoom } from "./components/joinRoom/JoinRoom";
import GameContext, { IGameContextProps } from "./gameContext";
import { Game } from "./components/game/Game";
import {Button, Container} from "react-bootstrap";

function App() {
  const [isInRoom, setInRoom] = useState(false);
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

  const handleReplay = () => {

  }

  const gameContextValue: IGameContextProps = useMemo(() => ({
    isInRoom,
    setInRoom,
    playerSymbol,
    setPlayerSymbol,
    isPlayerTurn,
    setPlayerTurn,
    isGameStarted,
    setGameStarted,
  }), [isInRoom, playerSymbol, isPlayerTurn, isGameStarted]);

  return (
    <GameContext.Provider value={gameContextValue}>
      <div className="wrapperContainer">
        <h1 className="homeText">🧠🫱🏿‍🫲🏽❣️ This is Tic-Tac-Friends 💙🤌🏿🌈</h1>
        <div className="mainContainer d-grid gap-1">
          {!isInRoom && <JoinRoom />}
          {isInRoom &&
              <Container
                  className="d-flex align-items-center justify-content-center"
                  style={{ minHeight: "100vh"}}>
                <div className="d-grid" style={{ maxWidth: "400px"}}>
                  <Game />
                  <Button className="w-20 m-5" variant="primary" onClick={() => handleReplay()}>
                    Play again
                  </Button>
                </div>
              </Container>
              }
        </div>
      </div>
    </GameContext.Provider>
  );
}

export default App;
