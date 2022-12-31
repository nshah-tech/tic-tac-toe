import { Player, Cell, Game, Connection } from "./type";

export function checkForEmptyCells(game: Game) {
  for (const row of game.board) {
    for (const cell of row) {
      if (cell === Cell.Empty) return false;
    }
  }
  return true;
}

export function endGame(game: Game, allGames: Game[]) {
  game.player1.close();
  game.player2?.close();
  game.spectators.forEach((spectator) => {
    spectator.close();
  });
  console.log(`Game ${game.id} Ended`);
  allGames.splice(allGames.indexOf(game), 1);
}

export function renderBoard(board: Cell[][]): string {
  let output = "";
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
      output += board[row][column];
      if (column < 2) {
        output += "|";
      }
    }
    output += "\n";
    if (row < 2) {
      output += "-----\n";
    }
  }
  return output;
}
