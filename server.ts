import * as WebSocket from "ws";
import * as uuid from "uuid";
import { Player, Cell, Game, Connection } from "./utils/type";
import { checkGameState } from "./utils/checkGameState";
import { renderBoard } from "./utils/utils";


let allGames: Game[] = [];
const connections: Connection[] = [];

const wss = new WebSocket.Server({ port: 4000 });

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (message: Buffer) => {
    const messageString = message.toString();
    console.log("Message ", messageString)
    const [command, ...args] = messageString.split(" ");
    if (command === "register") {
      const [name] = args;
      if (connections.some((c) => c.name === name)) {
        ws.send(`Name "${name}" is already taken`);
        ws.close();
        return;
      }
      connections.push({ ws, name });
      ws.send(
        "Choose an option:\n" +
          "1. Create a new game\n" +
          "2. Join as player 2 in an existing game\n" +
          "3. Be a spectator"
      );
    } else if (command === "create") {
      if (allGames.length) {
        ws.send("Game already exists");
        return;
      }
      const game: Game = {
        id: uuid.v4(),
        player1: ws,
        player2: null,
        spectators: [],
        board: [
          [Cell.Empty, Cell.Empty, Cell.Empty],
          [Cell.Empty, Cell.Empty, Cell.Empty],
          [Cell.Empty, Cell.Empty, Cell.Empty],
        ],
        currentPlayer: Player.X,
      };
      allGames.push(game);
      ws.send(`Game created with id ${game.id}. Waiting for player 2 to join`);
      console.log(`Game ${game.id} Created`)
    } else if (command === "join") {
      if (!allGames.length) {
        ws.send("No active game");
        return;
      }
      if (allGames[0].player2) {
        ws.send("Game is already full");
        return;
      }
      allGames[0].player2 = ws;
      allGames[0].player1.send(`Player 2 has joined the game. It is now your turn`);
      allGames[0].player2?.send(`Player 2 has joined the game. Waiting for Player 1's turn`);
      allGames[0].player1.send(renderBoard(allGames[0].board));
      allGames[0].player2?.send(renderBoard(allGames[0].board));
      allGames[0].player1.send(`Move Player 1`);
      console.log(`Player 2 Joined ${allGames[0].id}`)
    } else if (command === "spectate") {
      if (!allGames.length) {
        ws.send("No active game to spectate");
        return;
      }
      allGames[0].spectators.push(ws);
      ws.send("You are now a spectator");
      ws.send(renderBoard(allGames[0].board));
    } else if (command === "move") {
      if(!allGames.length) {
        ws.send("No active game");
        return;
      }
      const [row, column] = args.map(Number);
      if (allGames[0].player1 !== ws && allGames[0].player2 !== ws) {
        ws.send("You are not a player in this game");
        return;
      }
      if (
        (allGames[0].currentPlayer === Player.X && allGames[0].player1 !== ws) ||
        (allGames[0].currentPlayer === Player.O && allGames[0].player2 !== ws)
      ) {
        ws.send("It's not your turn");
        return;
      }
      if(row > 2 || column > 2) {
        ws.send("Invalid move");
        ws.send("Move")
        return;
      }
      if (allGames[0].board[row][column] !== Cell.Empty) {
        ws.send("Invalid move");
        ws.send("Move")
        return;
      }
      allGames[0].board[row][column] = Cell[allGames[0].currentPlayer];
      // Switch Current Player
      if (allGames[0].currentPlayer === Player.X) {
        allGames[0].currentPlayer = Player.O;
      } else {
        allGames[0].currentPlayer = Player.X;
      }
      allGames[0].player1.send(renderBoard(allGames[0].board));
      allGames[0].player2?.send(renderBoard(allGames[0].board));
      allGames[0].spectators.forEach((spectator) => {
        spectator.send(renderBoard(allGames[0].board));
      });
      checkGameState(allGames[0], allGames);
      if (allGames[0].player1 !== ws) {
        allGames[0].player1?.send("Move Player 1")
        allGames[0].player2?.send("Waiting for Player 1's turn")
      } else {
        allGames[0].player1?.send("Waiting for Player 2's turn")
        allGames[0].player2?.send("Move Player 2")
      }
    // * For More than 1 Game
    // } else if (command === "list") {
    //   ws.send(
    //     "Active games:\n" +
    //       allGames
    //       .map(game => `${game.id}: ${game?.player2 ? "Game in progress" : "Waiting for player 2"}`)
    //       .join("\n")
    //   );
    } else {
      ws.send("Invalid command");
    }
  }); // End of Message

  ws.on("close", () => {
    const connection = connections.find((c) => c.ws === ws);
    if (connection) {
      connections.splice(connections.indexOf(connection), 1);
    }
    if (allGames.length) {
      if (allGames[0].player1 === ws) {
        allGames[0].player2?.send(`Player 1 has disconnected`);
        allGames[0].spectators.forEach((spectator) => {
          spectator.send(`Player 1 has disconnected`);
        });
        allGames[0].player2?.close();
        allGames[0].spectators.forEach((spectator) => {
          spectator.close();
        });
        console.log(`${allGames[0].id} Ended because Player 1 Disconnected`);
      } else if (allGames[0].player2 === ws) {
        allGames[0].player1.send(`Player 2 has disconnected`);
        allGames[0].spectators.forEach((spectator) => {
          spectator.send(`Player 2 has disconnected`);
        });
        allGames[0].player1.close();
        allGames[0].spectators.forEach((spectator) => {
          spectator.close();
        });
        console.log(`${allGames[0].id} Ended because Player 2 Disconnected`);
      } else if (allGames[0].spectators.includes(ws)) {
        allGames[0].spectators.splice(allGames[0].spectators.indexOf(ws), 1);
      }
      console.log(`Game ${allGames[0].id} Ended`);
      allGames.splice(0, 1);
    }
  }); // End of close
});

console.log("Server is Up");
