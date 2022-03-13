const playerFactory = (name, token) => {
  // TODO return a player object with some methods on it like .place or .score
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


// This is the internal gameBoard, 
const gameBoard = (() => {
  "use strict";
  // TODO initialize an arry in here that is private
  const _boardArray = [null, null, null, null, null, null, null, null, null]

  const resetBoardArray = () => {
    _boardArray = [null, null, null, null, null, null, null, null, null]
  };

  const updateBoard = (index, value) => (_boardArray[index] = value);
  const logBoard = () => console.log(_boardArray);

  return {
    // TODO return an object with the public stuff I want to expose
    resetBoardArray,
    updateBoard,
    logBoard
  };

})();

// Grabs the user option fields and stores those valuables as variables
// Goal is to pass playerToken into another module for easier use
const userOptions = ((doc) => {
  "use strict";
  const playerTokenChoice = doc.getElementById("player-token-choice");



  return {
    playerTokenChoice
  };
})(document);

// This grabs game DOM elements and does stuff to them
const displayController = ((doc) => {
  "use strict";
  // grid stuff
  const board = doc.querySelector(".game-board");
  board.addEventListener("click", (e) => {
    e.stopPropagation();
    gameBoard.updateBoard(e.target.id, userOptions.playerTokenChoice.value);
    e.target.innerText = userOptions.playerTokenChoice.value;
  });



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
    gameBoard.resetBoardArray;
  };

  const newGameBtn = doc.querySelector(".new-game");
  newGameBtn.addEventListener("click", (e) => {
    e.preventDefault();
    newGrid();
  });

  // event listeners?

  return {
    // QUESTION: why do I return the function object and not the function expression, makeGrid() here?
    newGrid
  };
})(document);

const computerAI = (() => {
  // TODO write a basic AI that picks a random empty suare to move

  // TODO write a less basic AI that favors placing tokens adjacent to already occupied squares

  // TODO write a better AI that tries to win, favors getting three in a row

  // TODO write an unbeatable AI

  return {

  };
})();

const gameFlow = (() => {
  "use strict"
  // Here goes things like turn tracking, checking for win/tie
  let currentTurn;
  // new game
  const newGame = () => {
    // Clear the board ans set up a new one
    displayController.newGrid();
    // Make player1 with the user choice, player2 with the other choice
    const player1 = playerFactory(player1, userOptions.playerTokenChoice.value);
    const player2 = playerFactory(player2, (userOptions.playerTokenChoice.value === "X" ? "O" : "X"));
    // Return the player whose turn is first
    currentTurn = (player1.token === "X" ? player1 : player2);
  };
  // turn track variable
  let changeTurn = () => currentTurn === player1 ? player2 : player1;
  // check game state for tie/win

  return {
    // TODO expose some stuff
    newGame,
    changeTurn
  };


})();


displayController.newGrid();
