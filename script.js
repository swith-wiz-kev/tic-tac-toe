"use strict";
const initGame = (() => {
  const addButtonsFunction = () => {
    function addButtonsFunction(button) {
      const buttonId = button.className;
      switch (buttonId) {
        case "editp1":
          editNameOne();
          break;
        case "editp2":
          editNameTwo();
          break;
        case "swap":
          swapXO();
          break;
        case "restart":
          restartGame();
          break;
        default:
          break;
      }
    }

    function editNameOne(event) {}

    function editNameTwo(event) {}

    function swapXO(event) {}

    function restartGame(event) {}

    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) =>
      button.addEventListener("click", addButtonsFunction)
    );
  };

  const addCellsFunction = () => {
    function cellClick(event) {
      gameBoard.handleMove(event.target.dataset.number);
    }

    const cells = document.querySelectorAll(".tictactoe-grid>div");
    cells.forEach((cell) => {
      cell.addEventListener("click", cellClick);
    });
  };

  const watchControlSelectSetting = () => {
    function pauseAI(params) {}
    const inputControlSelect = document.querySelector(".opponent input");
    inputControlSelect.addEventListener("input", pauseAI);
  };
  return {
    addButtonsFunction,
    addCellsFunction,
    watchControlSelectSetting,
  };
})();

const gameBoard = (() => {
  let moveNumber = 1;
  let boardContent = [];
  let activePlayer = "P1"; //change to func later
  for (let index = 0; index < 9; index++) {
    boardContent[index] = "";
  }

  let currentMarker = "X";

  function toggleMarker() {
    if (currentMarker === "X") {
      currentMarker = "O";
    } else {
      currentMarker = "X";
    }
  }

  function fillCell(cellNumber, currentMarker) {
    const targetCell = document.querySelector(`[data-number="${cellNumber}"]`);
    targetCell.textContent = currentMarker;
    boardContent[cellNumber - 1] = currentMarker;
  }

  function isEnd() {
    function checkWinConditions(marker) {
      for (let index = 0; index < winConditions.length; index++) {
        const winCondition = winConditions[index].split("");
        let matchedCount = 0;
        winCondition.forEach((cellnumber) => {
          if (boardContent[cellnumber - 1] === marker) {
            matchedCount++;
            console.log({ marker, cellnumber, matchedCount });
          }
        });
        if (matchedCount === 3) {
          return true;
        }
      }
      return false;
    }

    const winConditions = [
      "123",
      "456",
      "789",
      "147",
      "258",
      "369",
      "159",
      "357",
    ];
    return checkWinConditions("X") || checkWinConditions("O");
  }

  function showEndMessage() {}

  const handleMove = (cellNumber) => {
    if (boardContent[cellNumber - 1] === "" && !isEnd()) {
      fillCell(cellNumber, currentMarker);
      gameBoard.handleMoveEnd();
    }
  };

  const handleMoveEnd = () => {
    if (isEnd()) {
      displayGameStatus.toggleText();
      displayWinMsg.toggleText();
      displayWinMsg.updateText("Player2\n wins!");
    }
    moveNumber++;
    toggleMarker();
    let currentPlayer = "";
    if (activePlayer === "P1") {
      activePlayer = "P2";
      currentPlayer = displayP2Name.getText();
    } else {
      activePlayer = "P1";
      currentPlayer = displayP1Name.getText();
    }
    const textGameStatus = `${currentPlayer}'s Turn\nMove #${moveNumber}`;
    displayGameStatus.updateText(textGameStatus);
  };

  return {
    boardContent,
    handleMove,
    handleMoveEnd,
  };
})();

const display = (className, initialText) => {
  const displayElement = document.querySelector(className);
  const currentState =
    getComputedStyle(displayElement).getPropertyValue("display");
  displayElement.textContent = initialText;
  const updateText = (text) => {
    displayElement.textContent = text;
  };

  const toggleText = () => {
    if (currentState === "none") {
      displayElement.style.display = "block";
    } else {
      displayElement.style.display = "none";
    }
  };

  const getText = () => {
    return displayElement.textContent;
  };

  return {
    updateText,
    toggleText,
    getText,
  };
};

const displayGameStatus = display(
  ".tictactoe-status>span",
  "Player1's Turn\nMove #1"
);
const displayWinMsg = display(".displaywinnermsg>span", "Player1\nwins!");
const displayP1Name = display(".setnames.playerone>span", "Player1");
const displayP2Name = display(".setnames.playertwo>span", "Player2");
const displayP1Turns = display(".turns.playerone>span", "1st Turn\nX");
const displayP2Turns = display(".turns.playertwo>span", "O");

//init
initGame.addButtonsFunction();
initGame.addCellsFunction();
initGame.watchControlSelectSetting();
