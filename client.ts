import WebSocket from "ws";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const [, , address, name] = process.argv;
// console.log('process.argv = ', process.argv);
const ws = new WebSocket(`ws://${address}:4000`);

ws.on("open", () => {
  //   console.log('Open = ', name);
  ws.send(`register ${name}`);
});

ws.on("message", (message: Buffer) => {
  const messageString = message.toString();
  console.log(messageString);
  if (messageString.startsWith("Choose")) {
    rl.question("Enter your choice: ", (choice: string) => {
      if (choice === "1") {
        ws.send("create");
      } else if (choice === "2") {
        rl.question("Enter game id: ", (gameId: string) => {
          ws.send(`join ${gameId}`);
        });
      } else if (choice === "3") {
        rl.question("Enter game id: ", (gameId: string) => {
          ws.send(`spectate ${gameId}`);
        });
      } else {
        console.log("Invalid choice");
      }
    });
  } else if (messageString.startsWith("Move")) {
    rl.question("Enter your move (row column): ", (move: string) => {
      const [row, column] = move.split(" ").map(Number);
      ws.send(`move ${row} ${column}`);
    });
  }
});

ws.on("close", () => {
  console.log("Connection closed");
  rl.close();
});

rl.on("SIGINT", () => {
  ws.close();
  rl.close();
});
