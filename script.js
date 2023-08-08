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
  for (let index = 0; index < 9; index++) {
    boardContent[index] = "";
  }

  let currentMarker = "X";

  function fillCell(cellNumber, currentMarker) {
    const targetCell = document.querySelector(`[data-number="${cellNumber}"]`);
    targetCell.textContent = currentMarker;
    boardContent[cellNumber - 1] = currentMarker;
  }

  function isEnd() {}

  function showEndMessage() {}

  const handleMove = (cellNumber) => {
    if (boardContent[cellNumber - 1] === "" && !isEnd()) {
      fillCell(cellNumber, currentMarker);
      gameBoard.handleMoveEnd();
    }
  };

  const handleMoveEnd = () => {
    if (isEnd()) {
      displayWinMsg.toggleText();
      displayGameStatus.updateText();
    }
    moveNumber++;
    displayGameStatus.updateText();
  };

  return {
    handleMove,
    handleMoveEnd,
  };
})();

const display = (className) => {
  const displayElement = document.querySelector(className);
  const currentState =
    getComputedStyle(displayElement).getPropertyValue("display");

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

const displayGameStatus = display(".tictactoe-status");
const displayWinMsg = display(".displaywinnerbg");
const displayP1Name = display(".setnames.playerone>span");
const displayP2Name = display(".setnames.playertwo>span");
const displayP1Turns = display(".turns.playerone");
const displayP2Turns = display(".turns.playertwo");

//init
initGame.addButtonsFunction();
initGame.addCellsFunction();
initGame.watchControlSelectSetting();
