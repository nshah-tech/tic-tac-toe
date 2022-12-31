# tic-tac-toe
A command-line based game of tic tac toe that can be played over a websocket connection
## Overview
The server is a WebSocket server that listens for incoming connections and manages the game state. 
It handles the following commands: **list**, **register**, **create**, **join**, **spectate**, and **move**.

The client is a command-line interface that connects to the server and sends the appropriate commands to update the game state. It allows the user to choose between creating a new game, joining an existing game as player 2, or spectating an existing game. It also allows the player to make moves in the game.

## How to run the code
First clone the repo <br>
`git clone https://github.com/nshah-tech/tic-tac-toe.git`<br>
Install Packages. (Assuming you already have node)<br>
`npm i`<br>
Run the Server<br>
`npm run server` or `npx ts-node server.ts`<br>
Then in another terminal run the clients<br>
`npm run client` or `npx ts-node client.ts 127.0.0.1 client`<br>
`npm run client2` or `npx ts-node client.ts 127.0.0.1 client2`<br>
`npm run spectate1` or `npx ts-node client.ts 127.0.0.1 spectate1`<br>
`npm run spectate2` or `npx ts-node client.ts 127.0.0.1 spectate2`<br>
If you wanna create a custom client the format is basically<br>
`npx ts-node client.ts $ADDRESS $NAME` where you replace $ADDRESS and $NAME with ip address and unique name