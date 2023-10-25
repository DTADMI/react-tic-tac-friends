import {
  ConnectedSocket, MessageBody,
  OnConnect, OnDisconnect, OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Socket, Server } from "socket.io";

@SocketController()
export class MainController {
  @OnConnect()
  public onConnection(
    @ConnectedSocket() socket: Socket,
    @SocketIO() io: Server
  ) {
    console.log("New Socket connected: ", socket.id);
    socket.on("custom_event", (data: any) => {
      console.log("Data: ", data);
    });
  }

  @OnDisconnect()
  public onDisconnection(
      @ConnectedSocket() socket: Socket,
      @SocketIO() io: Server
  ) {
    console.log(`Socket ${socket.id} disconnected`);
    socket.emit("on_player_disconnected", {socketId: socket.id});
  }
}
