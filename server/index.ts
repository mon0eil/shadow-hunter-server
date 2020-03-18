import * as WebSocket from "ws";
import { Game } from "./game";

const wss = new WebSocket.Server({
  port: 13475
});

const game = new Game(); // Change this to be able to create games manually

wss.on("connection", connection => {
    game.addPlayer(connection);
});
