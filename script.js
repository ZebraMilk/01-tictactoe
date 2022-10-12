
const grabDOM = ((doc) => {
  
  // Isolate all the DOM grabbing (except input fields)
  const board = doc.querySelector(".game-board");
  board.preventDefault;
  const newGameBtn = doc.querySelector(".new-game");
  // Grabs the user option fields and stores those valuables as variables
  const playerTokenChoice = doc.getElementById("player-token-choice");
  const playerOneName = doc.getElementById("player-one-name");
  // const playerOneType = doc.querySelector("input[name='player-one-type']:checked");

  const playerTwoName = doc.getElementById("player-two-name");
  // const playerTwoType = doc.querySelector("input[name='player-two-type']:checked").value;
  // const userOptions = {

  // }

  return {
    board,
    newGameBtn,
    playerTokenChoice,
    playerOneName,
    playerTwoName


  };

})(document);


// This is the internal gameBoard, 
const gameBoard = (() => {
  
  // Private array
  let _boardArray = [null, null, null, null, null, null, null, null, null];

  const resetBoardArray = () => {
    _boardArray = [null, null, null, null, null, null, null, null, null];
  };

  const updateBoard = (index, value) => (_boardArray[index] = value);
  // checks the board array to see if the square is occupied, returns boolean
  const isOccupied = (index) => _boardArray[index] ? true : false;

  // There is a better way to do this with .reduce() 
  const isFull = () => {
    let result = true;
    for (let i = 0; i < 9; i++) {
      if (_boardArray[i] === null) {
        result = false;
      };
    };
    return result;
  };






  const logBoard = () => console.log(_boardArray);

  return {
    resetBoardArray,
    updateBoard,
    isOccupied,
    isFull,
    logBoard
  };

})();


// This grabs game DOM elements and does stuff to them
const displayController = ((doc) => {
  
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

// Hold the player information and turn
const gameFlow = (() => {

  const _playerFactory = (name, token) => {
    // This stores the id values of the places on the board where this player has moved
    let moves = [];

    return {
      name,
      token,
      moves
    };
  };

  // Here goes things like turn tracking, checking for win/tie (maybe separate that logic?)
  let playerOneTurn = true;
  let activeGame = false;
  let playerOne;
  let playerTwo;

  // new game
  const newGame = () => {
    gameFlow.playerOne = _playerFactory(`${grabDOM.playerOneName.value}`, `${grabDOM.playerTokenChoice.value}`);
    gameFlow.playerTwo = _playerFactory(`${grabDOM.playerTwoName.value}`, (grabDOM.playerTokenChoice.value == "X" ? "O" : "X"));
    gameFlow.activeGame = true;
    gameFlow.playerOneTurn = (gameFlow.playerOne.token === "X" ? true : false);
  };
  // turn change function
  const changeTurn = () => gameFlow.playerOneTurn = !gameFlow.playerOneTurn;
    

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

// Check for win or tie
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

  let winner;

  // Compare player moves against the win arrays
  const _checkWin = (player) => _winStates.reduce((isWinner, winState) => {
    winState.every(move => player.moves.includes(move)) ? (isWinner = true) : false;
    return isWinner;
  }, false);

  const checkForWinner = () => {
    let playerOneWins = _checkWin(gameFlow.playerOne);
    let playerTwoWins = _checkWin(gameFlow.playerTwo);
    if (playerOneWins) {
      gameFlow.activeGame = false;
      checkState.winner = "playerOne";
      alert("Player One Wins!");
      return true;

    }
    if (playerTwoWins) {
      gameFlow.activeGame = false;
      checkState.winner = "playerTwo";
      alert("Player Two Wins!");
      return true;

    }
    else return false;
  };

  const checkTie = () => {
    if (gameBoard.isFull() && !checkForWinner()) {
      alert("Cat's game!");
      gameFlow.activeGame = false;
      return true;
    }
    return false;
  };

  return {
    checkTie,
    checkForWinner,
    winner
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
    if (!checkState.checkForWinner()) {
      gameFlow.changeTurn();
    };
  };
  // TODO: write a less basic AI that favors placing tokens adjacent to already occupied squares

  // TODO: write a better AI that tries to win, favors getting three in a row

  // TODO: write an unbeatable AI

  return {
    randomMove
  };
})();

const gameEvents = (() => {
  const currentPlayerMove = (e) => {
    let currentPlayer = gameFlow.getCurrentPlayer();
    console.log(currentPlayer);
    if (gameBoard.isOccupied(e.target.id)) {
      alert("This stall is occupied, try again!");
    // } else if (currentPlayer == gameFlow.playerTwo) {

    } else {
      gameBoard.updateBoard(e.target.id, currentPlayer.token);
      displayController.updateSquare(e.target.id, currentPlayer.token);
      currentPlayer.moves.push(Number(e.target.id));
      gameFlow.changeTurn();
      computerAI.randomMove();
    }
    
  };

  const newGame = () => {
    // Clear the board and set up a new one
    displayController.newGrid();
    gameFlow.newGame();
  };

  const updateBoard = (e) => {
    if (!gameBoard.isFull() && grabDOM.board.lastElementChild) {
      currentPlayerMove(e);
      // checkState.checkForWinner();
    };
  }

  
  return {
    currentPlayerMove,
    newGame,
    updateBoard
  };

})();

const listenerHandler = (() => {
  
  // TODO only add listener once newGame?

  grabDOM.newGameBtn.addEventListener("click", () => {
    //e.preventDefault();
    gameEvents.newGame();
  });

  grabDOM.board.addEventListener("click", (e) => {
    e.stopPropagation();
    // gameEvents.updateBoard(e);
    gameEvents.currentPlayerMove(e);
  });

  return {

  };

})();


//Testing new commit editor settings