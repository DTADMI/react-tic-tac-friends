import { Socket } from "socket.io-client";
import {IPlayMatrix, IStartGame, IStopGame} from "../../components/game/Game";

class GameService {
  public async joinGameRoom(socket: Socket, roomId: string): Promise<boolean> {
    return new Promise((rs, rj) => {
      socket.emit("join_game", { roomId, socketId: socket.id });
      socket.on("room_joined", () => rs(true));
      socket.on("room_join_error", ({ error }) => rj(error));
    });
  }

  public async updateGame(socket: Socket, gameMatrix: IPlayMatrix) {
    socket.emit("update_game", { matrix: gameMatrix });
  }

  public async onGameUpdate(
    socket: Socket,
    listener: (matrix: IPlayMatrix) => void
  ) {
    socket.on("on_game_update", ({ matrix }) => listener(matrix));
  }

  public async onGameStart(
    socket: Socket,
    listener: (options: IStartGame) => void
  ) {
    socket.on("start_game", listener);
  }
  public async onPlayerDisconnected(
    socket: Socket,
    listener: (options: IStopGame) => void
  ) {
    socket.on("on_player_disconnected", listener);
  }

  public async gameWin(socket: Socket, message: string) {
    socket.emit("game_win", { message });
  }

  public async onGameWin(socket: Socket, listener: (message: string) => void) {
    socket.on("on_game_win", ({ message }) => listener(message));
  }

  public async gameRestarting(socket: Socket, message: string) {
    socket.emit("game_restarting", { message });
  }

  public async onGameRestarting(socket: Socket, listener: (message: string) => void) {
    socket.on("on_game_restarting", ({ message }) => listener(message));
  }
}

export default new GameService();
