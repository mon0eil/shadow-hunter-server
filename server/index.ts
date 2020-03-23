const WebSocket = require("ws");
import { Game } from "./game";
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');

const server = http.createServer();

const clientDir = __dirname.endsWith('build') ? path.join(__dirname, '../../client') : path.join(__dirname, '../client');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(clientDir, 'dist/shadow-hunter-server')));
server.on('request', app);

const wss = new WebSocket.Server({
  server: server
});

const game = new Game(); // Change this to be able to create games manually

wss.on("connection", connection => {
    game.addPlayer(connection);
});

console.log(process.env);

server.listen(process.env.PORT ? process.env.PORT : 4200);
