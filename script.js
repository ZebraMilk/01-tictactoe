const Player = (name, token) => {
  // TODO return a player object with some methods on it like .place or .score
};

// This is the internal gameBoard, 
const gameBoard = (() => {
  // TODO initialize an arry in here that is private
  const board = [null, null, null, null, null, null, null, null, null];






  return {
    // TODO return an object with the public stuff I want to expose
    board: board
  };

})();

const gameFlow = (() => {
  // Here goes things like turn tracking, checking for win/tie
  // new game

  // turn track variable

  // 

  return {
    // TODO expose some stuff
  };


})();

// Grabs the user option fields and stores those valuables as variables
// Goal is to pass this.playerToken into another module and rename it for easier use
const userOptions = ((doc) => {
  const playerTokenChoice = doc.getElementById("player-token-choice").value;

  return {
    playerToken: playerTokenChoice
  }
})(document);

// This grabs DOM elements and does stuff to them
const displayController = ((doc) => {

  // grid stuff
  const board = doc.querySelector(".game-board");
  const clearGrid = () => {
    while (board.lastElementChild) {
      board.removeChild(board.lastElementChild);
    }
  };
  const makeGrid = () => {
    for (let index = 0; index < 9; index++) {
      const newSquare = doc.createElement("div");
      newSquare.classList.add("square", index);
      board.appendChild(newSquare);
    };
  };
  
  // event listener?




  return {
    // QUESTION: why do I return the function object and not the function expression, makeGrid() here?
    newGame: makeGrid
  };
})(document);

displayController.newGame()










const computerAI = (() => {




  return {

  };
})();






