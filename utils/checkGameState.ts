import { Player, Cell, Game, Connection } from "./type";
import { endGame, checkForEmptyCells } from "./utils";

export function checkGameState(game: Game, allGames: Game[]): void {
  // Check rows
  const board = game.board;
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] !== Cell.Empty &&
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2]
    ) {
      game.player1.send(`${board[i][0]} wins!`);
      game.player2?.send(`${board[i][0]} wins!`);
      game.spectators.forEach((spectator) => {
        spectator.send(`${board[i][0]} wins!`);
      });
      endGame(game, allGames);
      return;
    }
  }

  // Check columns
  for (let i = 0; i < 3; i++) {
    if (
      board[0][i] !== Cell.Empty &&
      board[0][i] === board[1][i] &&
      board[1][i] === board[2][i]
    ) {
      game.player1.send(`${board[0][i]} wins!`);
      game.player2?.send(`${board[0][i]} wins!`);
      game.spectators.forEach((spectator) => {
        spectator.send(`${board[0][i]} wins!`);
      });
      endGame(game, allGames);
      return;
    }
  }

  // Check diagonals
  if (
    board[0][0] !== Cell.Empty &&
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2]
  ) {
    game.player1.send(`${board[0][0]} wins!`);
    game.player2?.send(`${board[0][0]} wins!`);
    game.spectators.forEach((spectator) => {
      spectator.send(`${board[0][0]} wins!`);
    });
    endGame(game, allGames);
    return;
  }
  if (
    board[0][2] !== Cell.Empty &&
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0]
  ) {
    game.player1.send(`${board[0][2]} wins!`);
    game.player2?.send(`${board[0][2]} wins!`);
    game.spectators.forEach((spectator) => {
      spectator.send(`${board[0][2]} wins!`);
    });
    endGame(game, allGames);
    return;
  }

  // Check Draw
  if (checkForEmptyCells(game)) {
    game.player1.send("It's a draw!");
    game.player2?.send("It's a draw!");
    game.spectators.forEach((spectator) => {
      spectator.send("It's a draw!");
    });
    endGame(game, allGames);
  }
}
