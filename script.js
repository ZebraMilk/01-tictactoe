const playerFactory = (name, token) => {

  // This stores the id values of the places on the board where this player has moved
  const moves = [];



  return {
    name,
    token,
    moves
  };
  // Do I need any functions here? What do I want the player to be able to do?
};

const grabDOM = ((doc) => {
  "use strict";
  // Isolate all the DOM grabbing (except input fields)
  const board = doc.querySelector(".game-board");
  board.preventDefault;
  const newGameBtn = doc.querySelector(".new-game");
  // Grabs the user option fields and stores those valuables as variables
  const playerTokenChoice = doc.getElementById("player-token-choice");
  const playerOneName = doc.getElementById("player-one-name");

  const playerOneType = doc.getElementById("player-one-type");

  const userOptions = {
    
  }

  return {
    board,
    newGameBtn,
    playerTokenChoice,
    playerOneName,


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

  // There is a better way to do this with .reduce() but I will do that later
  const isFull = () => {
    let result = true;
    for (let i = 0; i < 9; i++) {
      if (_boardArray[i] === null) {
        result = false;
      };
    };
    return result;
  };



  const getMoves = (player) => {
    return _boardArray.filter(() => player.token);
  };


  const logBoard = () => console.log(_boardArray);

  return {
    resetBoardArray,
    updateBoard,
    isOccupied,
    isFull,
    logBoard,
    getMoves
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

  const updateSquare = (index, value) => {
    const target = doc.getElementById(index);
    target.innerText = `${value}`;
  };


  return {
    newGrid,
    updateSquare
  };

})(document);

const checkState = (() => {
  // initialize arrays of win states and check the players for those states
  const _winStates = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 9],
    [0, 4, 8],
    [2, 4, 6]
  ];

  // Compare player moves against the win arrays
  const checkWin = (player) => _winStates.reduce((isWinner, winState) => {
    winState.every(move => player.moves.includes(move)) ? (isWinner = true) : false;
    return isWinner;
  }, false);

  const checkForWinner = (playerOne, playerTwo) => {
    const playerOneWins = checkWin(playerOne);
    const playerTwoWins = checkWin(playerTwo);
    if (playerOneWins) {
      alert("Player One Wins!")
      gameFlow.activeGame = false;
      return playerOne;

    }
    if (playerTwoWins) {
      alert("Player Two Wins!")
      gameFlow.activeGame = false;
      return playerTwo;

    }
    else return false;
  }

  const checkTie = () => {
    if (gameBoard.isFull() && !checkForWinner(gameFlow.playerOne, gameBoard.playerTwo)) {
      alert("Cat's game!");
      gameFlow.activeGame = false;
      return true;
    }
    return false;
  }
  
  return {
    checkWin,
    checkTie,
    checkForWinner
  };
})();


const gameFlow = (() => {
  "use strict";
  // Here goes things like turn tracking, checking for win/tie (maybe separate that logic?)
  let playerOneTurn;
  let activeGame = false;
  let playerOne;
  let playerTwo;

  const _makePlayers = () => {
    // Make playerOne with the user choice, playerTwo with the other choice
    const playerOne = playerFactory(`${grabDOM.playerOneName.value}`, `${grabDOM.playerTokenChoice.value}`);
    const playerTwo = playerFactory("playerTwo", (grabDOM.playerTokenChoice.value == "X" ? "O" : "X"));
    const players = [playerOne, playerTwo];
    return players;
  };

  // new game
  const newGame = () => {
    const players = _makePlayers();
    gameFlow.playerOne = players[0];
    gameFlow.playerTwo = players[1];
    gameFlow.activeGame = true;
    gameFlow.playerOneTurn = (gameFlow.playerOne.token === "X" ? true : false);
  };
  // turn change function
  const changeTurn = () => playerOneTurn = !playerOneTurn;

  const getCurrentPlayer = () => gameFlow.playerOneTurn ? gameFlow.playerOne : gameFlow.playerTwo;

  return {
    newGame,
    changeTurn,
    playerOne,
    playerTwo,
    playerOneTurn,
    activeGame,
    getCurrentPlayer
  };
})();


const computerAI = (() => {
  // TODO: write a basic AI that picks a random empty suare to move
  const randomMove = () => {
    let computer = gameFlow.getCurrentPlayer();
    if (!gameBoard.isFull()) {
      let random = (Math.floor(Math.random() * 10000) % 9);
      for (let i = 0; i < 9; i++) {
        if (!gameBoard.isOccupied(random)) {
          continue;
        };
        random = (random + 1) % 9;
      };

      gameBoard.updateBoard(random, computer.token);
      displayController.updateSquare(random, computer.token);
      computer.moves.push(random);
    }
    checkState.checkWin(computer);
    gameFlow.changeTurn();
  };
  // TODO: write a less basic AI that favors placing tokens adjacent to already occupied squares

  // TODO: write a better AI that tries to win, favors getting three in a row

  // TODO: write an unbeatable AI

  return {
    randomMove
  };
})();

const listenerHandler = (() => {
  "use strict"
  // user move
  const userMove = (e) => {
    let currentPlayer = gameFlow.getCurrentPlayer();
    gameBoard.updateBoard(e.target.id, currentPlayer.token);
    displayController.updateSquare(e.target.id, currentPlayer.token);
    currentPlayer.moves.push(Number(e.target.id));
  }

  // TODO: move all the listeners here.
  // TODO only add listener once newGame

  grabDOM.newGameBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // Clear the board and set up a new one
    displayController.newGrid();
    gameFlow.newGame();
  });

    grabDOM.board.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!gameBoard.isFull()) {
      userMove(e);
      checkState.checkWin(gameFlow.getCurrentPlayer());
      gameFlow.changeTurn();
        // This is just for now, will gate this behind a check for opponent type
      computerAI.randomMove();
    };
  });

  return {

  };

})();
