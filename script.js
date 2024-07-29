// Initial references
const container = document.querySelector(".container");
const playerTurn = document.getElementById("playerTurn");
const startScreen = document.querySelector(".startScreen");
const startButton = document.getElementById("start");
const message = document.getElementById("message");
let initialMatrix = Array.from({ length: 6 }, () => Array(7).fill(0));
let currentPlayer;

// Random Number Between Range
const generateRandomNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min;

// Loop through array and check for same values
const verifyArray = (arrayElement) => {
  let count = 0;
  for (let i = 0; i < arrayElement.length; i++) {
    if (arrayElement[i] === currentPlayer) {
      count++;
      if (count === 4) return true;
    } else {
      count = 0;
    }
  }
  return false;
};

// Check for game over (Last step)
const gameOverCheck = () => {
  if (initialMatrix.every(row => row.every(cell => cell !== 0))) {
    message.innerText = "Game Over. It's a draw!";
    startScreen.classList.remove("hide");
  }
};

// Check rows
const checkAdjacentRowValues = (row) => verifyArray(initialMatrix[row]);

// Check columns
const checkAdjacentColumnValues = (column) => {
  const columnValues = initialMatrix.map(row => row[column]);
  return verifyArray(columnValues);
};

// Get Right diagonal values
const getRightDiagonal = (row, column) => {
  let diagonal = [];
  while (row > 0 && column < initialMatrix[0].length - 1) {
    row--;
    column++;
  }
  while (row < initialMatrix.length && column >= 0) {
    diagonal.push(initialMatrix[row][column]);
    row++;
    column--;
  }
  return diagonal;
};

const getLeftDiagonal = (row, column) => {
  let diagonal = [];
  while (row > 0 && column > 0) {
    row--;
    column--;
  }
  while (row < initialMatrix.length && column < initialMatrix[0].length) {
    diagonal.push(initialMatrix[row][column]);
    row++;
    column++;
  }
  return diagonal;
};

// Check diagonal
const checkAdjacentDiagonalValues = (row, column) => {
  const leftDiagonal = getLeftDiagonal(row, column);
  const rightDiagonal = getRightDiagonal(row, column);
  return verifyArray(leftDiagonal) || verifyArray(rightDiagonal);
};

// Win check logic
const winCheck = (row, column) => {
  return checkAdjacentRowValues(row) || checkAdjacentColumnValues(column) || checkAdjacentDiagonalValues(row, column);
};

// Sets the circle to exact points
const setPiece = (row, column) => {
  while (row >= 0 && initialMatrix[row][column] !== 0) {
    row--;
  }
  if (row >= 0) {
    initialMatrix[row][column] = currentPlayer;
    document.querySelectorAll(".grid-row")[row].querySelectorAll(".grid-box")[column].classList.add("filled", `player${currentPlayer}`);
    if (winCheck(row, column)) {
      message.innerHTML = `Player <span>${currentPlayer}</span> wins!`;
      startScreen.classList.remove("hide");
      return true;
    }
  }
  gameOverCheck();
  return false;
};

// When user clicks on a box
const fillBox = (e) => {
  const colValue = parseInt(e.target.getAttribute("data-value"));
  if (!setPiece(5, colValue)) {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    playerTurn.innerHTML = `Player <span>${currentPlayer}'s</span> turn`;
  }
};

// Create Matrix
const matrixCreator = () => {
  initialMatrix = Array.from({ length: 6 }, () => Array(7).fill(0));
  container.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("grid-row");
    for (let j = 0; j < 7; j++) {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("grid-box");
      cellDiv.setAttribute("data-value", j);
      cellDiv.addEventListener("click", fillBox);
      rowDiv.appendChild(cellDiv);
    }
    container.appendChild(rowDiv);
  }
};

// Initialise game
const startGame = () => {
  currentPlayer = generateRandomNumber(1, 3);
  matrixCreator();
  playerTurn.innerHTML = `Player <span>${currentPlayer}'s</span> turn`;
};

// Start game
startButton.addEventListener("click", () => {
  startScreen.classList.add("hide");
  startGame();
});

// Initialize on window load
window.onload = startGame;
