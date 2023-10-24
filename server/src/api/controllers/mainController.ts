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
    console.table(socket.rooms)
    socket.on("custom_event", (data: any) => {
      console.log("Data: ", data);
    });
  }

  @OnDisconnect()
  public onDisconnection(
      @ConnectedSocket() socket: Socket,
      @SocketIO() io: Server
  ) {
    console.log(`Player ${socket.id} disconnected`);
    console.table(socket.rooms);
    const socketRooms = Array.from(socket.rooms.values()).filter(
        (r) => r !== socket.id
    );
    let room = socketRooms?.[0];
    console.log(`Room ${room}`);
    socket.emit("on_player_disconnected", {socketId: socket.id});
  }
}
