import { Player, Cell, Game } from "./type";
import * as WebSocket from "ws"; //For WebSocket Type

export function isMoveValid(ws: WebSocket, allGames: Game[], row: number, column: number) {
  if (!allGames.length) {
    ws.send("No active game");
    return false;
  }
  if (allGames[0].player1 !== ws && allGames[0].player2 !== ws) {
    ws.send("You are not a player in this game");
    return false;
  }
  if (
    (allGames[0].currentPlayer === Player.X && allGames[0].player1 !== ws) ||
    (allGames[0].currentPlayer === Player.O && allGames[0].player2 !== ws)
  ) {
    ws.send("It's not your turn");
    return false;
  }
  if (row > 2 || column > 2) {
    ws.send("Invalid move");
    ws.send("Move");
    return false;
  }
  if (allGames[0].board[row][column] !== Cell.Empty) {
    ws.send("Invalid move");
    ws.send("Move");
    return false;
  }
  return true;
}
