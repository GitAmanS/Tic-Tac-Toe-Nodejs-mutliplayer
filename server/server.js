const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: "http://localhost:5173/",
});

const allUsers = {};
const waitingPlayers = [];

io.on("connection", (socket) => {
  console.log("new user joined", socket.id);
  allUsers[socket.id] = {
    socket: socket,
    online: true,
  };

  socket.on("request_to_play", (data) => {
    const currentUser = allUsers[socket.id];
    currentUser.playerName = data.playerName;

    if (waitingPlayers.length > 0) {
      const opponentPlayer = waitingPlayers.shift();

      const room = {
        player1: opponentPlayer,
        player2: currentUser,
      };

      opponentPlayer.socket.emit("OpponentFound", {
        opponentName: currentUser.playerName,
        playingAs: "circle",
      });

      currentUser.socket.emit("OpponentFound", {
        opponentName: opponentPlayer.playerName,
        playingAs: "cross",
      });

      currentUser.socket.on("playerMoveFromClient", (data) => {
        opponentPlayer.socket.emit("playerMoveFromServer", {
          ...data,
        });
      });

      opponentPlayer.socket.on("playerMoveFromClient", (data) => {
        currentUser.socket.emit("playerMoveFromServer", {
          ...data,
        });
      });
    } else {
      waitingPlayers.push(currentUser);
    }
  });

  socket.on("disconnect", function () {
    const currentUser = allUsers[socket.id];
    currentUser.online = false;

    const index = waitingPlayers.findIndex((player) => player.socket.id === socket.id);
    if (index !== -1) {
      waitingPlayers.splice(index, 1);
    }
  });
});

httpServer.listen(3000);
