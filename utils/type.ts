import * as WebSocket from "ws"; //For WebSocket Type
export enum Player {
  X = "X",
  O = "O",
}

export enum Cell {
  X = "X",
  O = "O",
  Empty = " ",
}
export interface Game {
  id: string;
  player1: WebSocket;
  player2?: WebSocket | null;
  spectators: WebSocket[];
  board: Cell[][];
  currentPlayer: Player;
}

export type Connection = {
    ws: WebSocket;
    name: string;
};