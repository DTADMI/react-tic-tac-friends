import React, {useContext, useRef, useState} from "react";
import gameContext from "../../contexts/GameContext";
import gameService from "../../services/gameService/GameService";
import socketService from "../../services/socketService/SocketService";
import {Button, Card, Form} from "react-bootstrap";
import "./JoinRoom.css";

interface IJoinRoomProps {}

export function JoinRoom(props: IJoinRoomProps) {
  const roomIdRef = useRef<HTMLInputElement>(null);
  const [isJoining, setJoining] = useState(false);

  const { setInRoom, isInRoom } = useContext(gameContext);

  const joinRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    const roomName = roomIdRef?.current?.value ?? "";
    const socket = socketService.socket;
    if (!roomName || roomName.trim() === "" || !socket) return;

    setJoining(true);

    const joined = await gameService
      .joinGameRoom(socket, roomName)
      .catch((err) => {
        alert(err);
      });

    if (joined) setInRoom(true);

    setJoining(false);
  };

  return (
      <>
        <Card>
          <Card.Body>
            <h4 className="text-center mb-4">Enter a room ID to join the Game</h4>
            <Form className="d-grid gap-3" onSubmit={joinRoom}>
              <Form.Group controlId="formRoomId">
                <Form.Label>Room ID</Form.Label>
                <Form.Control type="text" placeholder="Enter Room ID" ref={roomIdRef} required />
              </Form.Group>
              <Button className="w-100" variant="primary" type="submit" disabled={isJoining}>
                {"Join"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </>

  );
}
