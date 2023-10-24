import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import "./Game.css"
import gameContext from "../../contexts/GameContext";
import gameService from "../../services/gameService/GameService";
import socketService from "../../services/socketService/SocketService";


const RowContainer = styled.div`
  width: 100%;
  display: flex;
`;

const Cell = styled.div`
  display: flex;
  height: 5rem;//9em;
  width: 5rem;//13em;
  align-items: center;
  justify-content: center;
  border: 0.1rem solid #8e44ad;
  border-radius: 20px;
  cursor: pointer;
  transition: all 270ms ease-in-out;

  &:hover {
    background-color: #8d44ad28;
  }
`;

const PlayStopper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 99;
  cursor: default;
`;

const X = styled.span`
  font-size: 2.5rem;//100px;
  color: #1d42a7;
  &::after {
    content: "X";
  }
`;

const O = styled.span`
  font-size: 2.5rem;//100px;
  color: #117755;//#8e44ad;
  &::after {
    content: "O";
  }
`;

export type IPlayMatrix = Array<Array<string | null>>;
export interface IStartGame {
  start: boolean;
  symbol: "x" | "o";
}
export interface IStopGame {
  socketId: string;
}

export function Game() {
  const gameOverMessage = "Game Over! \n Click on the Replay button to play again!";
  const [isGameOver, setGameOver] = useState(false);
  const [matrix, setMatrix] = useState<IPlayMatrix>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);

  const {
    playerSymbol,
    setPlayerSymbol,
    isPlayerTurn,
    setPlayerTurn,
    isGameStarted,
    setGameStarted,
    isGameRestarting,
    setGameRestarting,
    setGameMessage,
    setInRoom,
  } = useContext(gameContext);

  const checkGameState = (matrix: IPlayMatrix) => {
    for (const row of matrix) {
      if (row.every((value) => value && value === playerSymbol)) {
        return [true, false];
      } else if (row.every((value) => value && value !== playerSymbol)) {
        return [false, true];
      }
    }

    for (let i = 0; i < matrix.length; i++) {
      let column = [];
      for (let j = 0; j < matrix[i].length; j++) {
        column.push(matrix[j][i]);
      }

      if (column.every((value) => value && value === playerSymbol)) {
        return [true, false];
      } else if (column.every((value) => value && value !== playerSymbol)) {
        return [false, true];
      }
    }

    if (matrix[1][1]) {
      if (matrix[0][0] === matrix[1][1] && matrix[2][2] === matrix[1][1]) {
        if (matrix[1][1] === playerSymbol) return [true, false];
        else return [false, true];
      }

      if (matrix[2][0] === matrix[1][1] && matrix[0][2] === matrix[1][1]) {
        if (matrix[1][1] === playerSymbol) return [true, false];
        else return [false, true];
      }
    }

    //Check for a tie
    if (matrix.every((m) => m.every((v) => v !== null))) {
      return [true, true];
    }

    return [false, false];
  };

  const updateGameMatrix = (column: number, row: number, symbol: "x" | "o") => {
    const newMatrix = [...matrix];

    if (newMatrix[row][column] === null || newMatrix[row][column] === "null") {
      newMatrix[row][column] = symbol;
      setMatrix(newMatrix);
    } else {
      alert("You can't play there!");
      return;
    }

    if (socketService.socket) {
      gameService.updateGame(socketService.socket, newMatrix);
      const [currentPlayerWon, otherPlayerWon] = checkGameState(newMatrix);
      if (currentPlayerWon && otherPlayerWon) {
        gameService.gameWin(socketService.socket, "The Game is a TIE!");
        setGameOver(true);
        setGameMessage(gameOverMessage);
        alert("The Game is a TIE!");
      } else if (currentPlayerWon && !otherPlayerWon) {
        gameService.gameWin(socketService.socket, "You Lost!");
        setGameOver(true);
        setGameMessage(gameOverMessage);
        alert("You Won!");
      }

      setPlayerTurn(false);
    }
  };

  const handleGameUpdate = () => {
    if (socketService.socket) {
      gameService.onGameUpdate(socketService.socket, (newMatrix) => {
        setMatrix(newMatrix);
        checkGameState(newMatrix);
        setPlayerTurn(true);
      });
    }
  };

  const handleGameStart = () => {
    if (socketService.socket) {
      gameService.onGameStart(socketService.socket, (options) => {
        setGameStarted(true);
        setPlayerSymbol(options.symbol);
        if (options.start) setPlayerTurn(true);
        else setPlayerTurn(false);
      });
    }
  };

  const handleGameWin = () => {
    if (socketService.socket) {
      gameService.onGameWin(socketService.socket, (message) => {
        console.log("On Game Win", message);
        setPlayerTurn(false);
        setGameOver(true);
        setGameMessage(gameOverMessage);
        alert(message);
      });
    }
  };

  const handleGameStop = () => {
    //TODO
    if (socketService.socket) {
      gameService.onPlayerDisconnected(socketService.socket, (message) => {
        console.log("The other player disconnected", message);
        setInRoom(false);
        alert(message);
      });
    }
  };

  const callGameRestart = () => {
    if (socketService.socket) {
      let message = "The game restarted!";
      gameService.gameRestarting(socketService.socket, message + "\n It's your turn now!");
      setMatrix([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);
      setPlayerTurn(false);
      setGameRestarting(false);
      setGameOver(false);
      alert(message + "\n It's your opponent turn now!");
      setGameMessage(message + "\n It's your turn now!");
    }
  }

  const handleGameRestarting = () => {
    if (socketService.socket) {
      gameService.onGameRestarting(socketService.socket, (message) => {
        console.log("On Game restarting : ", message);
        setMatrix([
          [null, null, null],
          [null, null, null],
          [null, null, null],
        ]);
        setGameOver(false);
        setPlayerTurn(true);
        alert(message);
        setGameMessage(message);
      });
    }
  }

  useEffect(() => {
    handleGameUpdate();
    handleGameStart();
    handleGameWin();
    handleGameRestarting();
    handleGameStop();
  }, []);

  useEffect(() => {
    if(isGameRestarting) {
      callGameRestart();
    }
  }, [isGameRestarting]);

  useEffect(() => {
    if(!isGameStarted) {
      setGameMessage("Waiting for the other player to join the room...");
    } else if (!isGameOver) {
      if(isPlayerTurn) {
        setGameMessage("Your turn to play!!!");
      } else {
        setGameMessage("Wait for your opponent's turn to play!!!");
      }
    }
  },[isGameStarted, isPlayerTurn, isGameOver]);

  const playTurn = (column: string | null) => {
    if(!column || column === "null"){
      return null;
    }
    return column === "x" ? ( <X /> ) : ( <O /> );
  }

  return (
      <>
        {(!isGameStarted || !isPlayerTurn) && <PlayStopper />}
        <div className="gameContainer">
          {matrix.map((row, rowIdx) => {
            return (
                <RowContainer>
                  {row.map((column, columnIdx) => (
                      <Cell
                          onClick={() =>
                              updateGameMatrix(columnIdx, rowIdx, playerSymbol)
                          }
                      >
                        {playTurn(column)}
                      </Cell>
                  ))}
                </RowContainer>
            );
          })}

        </div>
      </>

  );
}
