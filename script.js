const playerFactory = (name, token) => {

  const playerName = name;
  const playerToken = token;
  // This stores the id values of the places on the board where this player has moved
  const playerMoves = [];
  return {
    playerName,
    playerToken,
    playerMoves
  };
  // Do I need any functions here? What do I want the player to be able to do?
};

const grabDOM = ((doc) => {
  "use strict"
  // Isolate all the DOM grabbing (except input fields)
  const board = doc.querySelector(".game-board");
  const newGameBtn = doc.querySelector(".new-game");
// Grabs the user option fields and stores those valuables as variables
  const playerTokenChoice = doc.getElementById("player-token-choice");
  const player1Name = doc.getElementById("player1-name");

  return {
    board,
    newGameBtn,
    playerTokenChoice,
    player1Name

  };

})(document);


// This is the internal gameBoard, 
const gameBoard = (() => {
  "use strict";
  // Private array
  let _boardArray = [null, null, null, null, null, null, null, null, null];

  const resetBoardArray = () => {
    _boardArray = [null, null, null, null, null, null, null, null, null];
  };

  const updateBoard = (index, value) => (_boardArray[index] = value);
  // checks the board array to see if the square is occupied, returns boolean
  const isOccupied = (index) => _boardArray[index] ? true : false;

  const logBoard = () => console.log(_boardArray);

  return {
    resetBoardArray,
    updateBoard,
    isOccupied,
    logBoard
  };

})();


// This grabs game DOM elements and does stuff to them
const displayController = ((doc) => {
  "use strict";
  // grid stuff
  const board = grabDOM.board;

  const _clearGrid = () => {
    while (board.lastElementChild) {
      board.removeChild(board.lastElementChild);
    }
  };

  const _makeGrid = () => {
    for (let index = 0; index < 9; index++) {
      const newSquare = doc.createElement("div");
      newSquare.classList.add("square");
      newSquare.id = index;
      board.appendChild(newSquare);
    };
  };

  const newGrid = () => {
    _clearGrid();
    _makeGrid();
    gameBoard.resetBoardArray();
  };

  return {
    newGrid
  };

})(document);

// TODO:: maybe put this inside of the gameBoard module so it has access to the private _boardArray?
const checkState = (() => {


  return {

  };
})();


const gameFlow = (() => {
  "use strict";
  // Here goes things like turn tracking, checking for win/tie (maybe separate that logic?)
  let playerTurn = true;
  let activeGame = false;
  // new game
  const newGame = (() => {
    const startGame = () => {
    // Clear the board and set up a new one
    displayController.newGrid();
    // Make player1 with the user choice, player2 with the other choice
    const player1 = playerFactory(`${grabDOM.player1Name}`, `${grabDOM.playerTokenChoice.value}`);
    const player2 = playerFactory("player2", (grabDOM.playerTokenChoice.value === "X" ? "O" : "X"));

    activeGame = true;
    // Return the player whose turn is first
    playerTurn = (player1.playerToken === "X" ? true : false);
    };
    
    return {
      player1,
      player2
    };
  })();
  // turn change function
  const changeTurn = () => playerTurn = !playerTurn;
  // check game state for tie/win

  return {
    newGame,
    changeTurn,
    player1: newGame.player1,
    player2: newGame.player2,
    playerTurn,
    activeGame
  };


})();

const computerAI = ((computerPlayer) => {
  // TODO: write a basic AI that picks a random empty suare to move
  const computerMove = () => {
    let random = (Math.floor(Math.random * 10000) % 9);
    while (gameBoard.isOccupied(random)) {
      random = (random + 1) % 9;
    }
    gameBoard.updateBoard(random, computerPlayer.playerToken);
  };
  // TODO: write a less basic AI that favors placing tokens adjacent to already occupied squares

  // TODO: write a better AI that tries to win, favors getting three in a row

  // TODO: write an unbeatable AI

  return {
    computerMove
  };
})(gameFlow.newGame.player2);

const listenerHandler = (() => {
  "use strict";
  // TODO: move all the listeners here.

  grabDOM.newGameBtn.addEventListener("click", (e) => {
    e.preventDefault();
    gameFlow.newGame();
  });

  grabDOM.board.addEventListener("click", (e) => {
    e.stopPropagation();
    gameBoard.updateBoard(e.target.id, (gameFlow.playerTurn ? gameFlow.player1.playerToken : gameFlow.player2.playerToken));
    e.target.innerText = (gameFlow.playerTurn ? gameFlow.player1.playerToken : gameFlow.player2.playerToken);
    gameFlow.changeTurn();
  });

  return {

  };

})();


displayController.newGrid();
