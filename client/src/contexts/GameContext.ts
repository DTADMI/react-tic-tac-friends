import React from "react";

export interface IGameContextProps {
  isInRoom: boolean;
  setInRoom: (inRoom: boolean) => void;
  isGameRestarting: boolean;
  setGameRestarting: (gameRestarting: boolean) => void;
  playerSymbol: "x" | "o";
  setPlayerSymbol: (symbol: "x" | "o") => void;
  isPlayerTurn: boolean;
  setPlayerTurn: (turn: boolean) => void;
  isGameStarted: boolean;
  setGameStarted: (started: boolean) => void;
  gameMessage: string;
  setGameMessage: (message: string) => void;
}

const defaultState: IGameContextProps = {
  isInRoom: false,
  setInRoom: () => {},
  isGameRestarting: false,
  setGameRestarting: () => {},
  playerSymbol: "x",
  setPlayerSymbol: () => {},
  isPlayerTurn: false,
  setPlayerTurn: () => {},
  isGameStarted: false,
  setGameStarted: () => {},
  gameMessage: "",
  setGameMessage: () => {}
};

export default React.createContext(defaultState);
