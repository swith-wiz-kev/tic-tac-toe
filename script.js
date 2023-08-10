"use strict";
const initGame = (() => {
  const addButtonsFunction = () => {
    function addButtonsFunction(event) {
      const buttonId = event.target.className;
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

    function restartGame() {
      gameBoard.resetValues();
    }

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

  const readBoard = () => {
    return boardContent;
  };

  let activePlayer = "P1"; //change to func later

  let currentMarker = "X";

  let winPlayer = "";

  let gameEnd = 0;

  function isWin() {
    function checkWinConditions(marker) {
      for (let index = 0; index < winConditions.length; index++) {
        const winCondition = winConditions[index].split("");
        let matchedCount = 0;
        winCondition.forEach((cellnumber) => {
          if (boardContent[cellnumber - 1] === marker) {
            matchedCount++;
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

  const handleMove = (cellNumber) => {
    if (boardContent[cellNumber - 1] === "" && !gameEnd) {
      boardContent[cellNumber - 1] = currentMarker;
      handleMoveEnd();
    }
  };

  function handleMoveEnd() {
    function otherValue(currentValue, value1, value2) {
      if (currentValue == value1) {
        return value2;
      } else {
        return value1;
      }
    }

    function isDraw() {
      return moveNumber === 10;
    }

    function ownerOf(marker) {
      if (marker == "X") {
        return "P1";
      } else if (marker == "O") {
        return "P2";
      }
    }

    moveNumber++;

    if (isWin()) {
      gameEnd = 1;
      winPlayer = ownerOf(currentMarker);
    } else if (isDraw()) {
      gameEnd = 1;
      winPlayer = "";
    } else {
      currentMarker = otherValue(currentMarker, "X", "O");
      activePlayer = otherValue(activePlayer, "P1", "P2");
    }
    updateInterface();
  }

  const resetValues = () => {
    moveNumber = 1;
    for (let index = 0; index < 9; index++) {
      boardContent[index] = "";
    }
    activePlayer = "P1"; //change to func later
    currentMarker = "X";
    winPlayer = "";
    gameEnd = 0;
    updateInterface();
  };

  function updateInterface() {
    for (let cellNumber = 1; cellNumber <= 9; cellNumber++) {
      const targetCell = document.querySelector(
        `[data-number="${cellNumber}"]`
      );
      targetCell.textContent = boardContent[cellNumber - 1];
    }

    let currentPlayer = "";
    if (activePlayer === "P1") {
      currentPlayer = displayP1Name.getText();
    } else {
      currentPlayer = displayP2Name.getText();
    }
    const textGameStatus = `${currentPlayer}'s Turn\nMove #${moveNumber}`;
    displayGameStatus.updateText(textGameStatus);
    displayGameStatus.toggleText(1);
    displayWinMsg.toggleText(0);

    if (gameEnd) {
      displayGameStatus.toggleText(0);
      displayWinMsg.toggleText(1);
      let winMsg = "";
      if (winPlayer === "P1" || winPlayer === "P2") {
        let winPlayerName = "";
        if (winPlayer === "P1") {
          winPlayerName = displayP1Name.getText();
        } else if (winPlayer === "P2") {
          winPlayerName = displayP2Name.getText();
        }
        winMsg = winPlayerName + "\nwins!";
      } else {
        winMsg = "Draw";
      }
      displayWinMsg.updateText(winMsg);
    }
  }

  return {
    readBoard,
    handleMove,
    resetValues,
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

  const toggleText = (value) => {
    if (value == 0 || value == false) {
      displayElement.style.display = "none";
    } else if (value == 1 || value == true) {
      displayElement.style.display = "block";
    } else if (value === undefined && currentState === "none") {
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
