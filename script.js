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
        case "resume":
          resumeAi();
          break;
        default:
          break;
      }
    }

    function editNameOne() {
      playerOne.editName();
    }

    function editNameTwo() {
      playerTwo.editName();
    }

    function swapXO() {
      gameBoard.swapTurn();
    }

    function resumeAi() {
      gameBoard.setAiPause(0);
      displayAiPaused.toggleText(0);
      gameBoard.handleMove(10);
    }

    function restartGame() {
      gameBoard.resetValues();
      gameBoard.handleMove(10);
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
    function pauseAI(event) {
      if (event.target.value === "p1human") {
        playerOne.inputControl = 0;
      } else if (event.target.value === "p1ai") {
        playerOne.inputControl = 1;
      } else if (event.target.value === "p2human") {
        playerTwo.inputControl = 0;
      } else if (event.target.value === "p2ai") {
        playerTwo.inputControl = 1;
      }
      gameBoard.setAiPause(1);
      displayAiPaused.toggleText(1);
    }
    function initializeRadioButton(elementId, checked) {
      const selector = document.getElementById(elementId);
      selector.checked = checked;
    }
    initializeRadioButton("p1human", 1);
    initializeRadioButton("p1ai", 0);
    initializeRadioButton("p2human", 0);
    initializeRadioButton("p2ai", 1);
    const inputControlSelectors = document.querySelectorAll(".opponent input");
    inputControlSelectors.forEach((inputControlSelector) => {
      inputControlSelector.addEventListener("input", pauseAI);
    });
  };
  return {
    addButtonsFunction,
    addCellsFunction,
    watchControlSelectSetting,
  };
})();

const playerFactory = (
  initialName,
  initialInputControl,
  initialMarker,
  nameTextElement,
  markerTextElement
) => {
  let name = initialName;
  let inputControl = initialInputControl;
  let marker = initialMarker;
  const textElement = document.querySelector(nameTextElement);
  textElement.value = initialName;
  let editingName = 0;
  const getMarker = () => {
    return marker;
  };
  const setMarker = (newMarker) => {
    marker = newMarker;
    if (marker == "O") {
      markerTextElement.updateText("O");
    } else if (marker == "X") {
      markerTextElement.updateText("First Turn\nX");
    }
  };

  const editName = () => {
    function otherValue(currentValue, value1, value2) {
      if (currentValue == value1) {
        return value2;
      } else {
        return value1;
      }
    }
    editingName = otherValue(editingName, 0, 1);
    textElement.classList.toggle("editing");
    textElement.readOnly = !editingName;
    if (editingName) {
      textElement.focus();
      const temp = textElement.value;
      textElement.value = "";
      textElement.value = temp; //moving cursor to the right
    } else {
      textElement.scrollLeft = 0; //Scrolling to left incase overflow
    }
  };
  const getTextElement = () => {
    return textElement;
  };

  const getMove = (boardContent) => {
    const emptySpaces = boardContent
      .map((cell, index) => {
        return (cell == "") * (index + 1);
      })
      .filter((cellNumber) => {
        return cellNumber > 0;
      });
    const moveTarget = Math.floor(Math.random() * emptySpaces.length);
    return emptySpaces[moveTarget];
  };

  return {
    name,
    inputControl,
    getMarker,
    setMarker,
    editName,
    getTextElement,
    getMove,
  };
};

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
const displayP1Turns = display(".turns.playerone>span", "1st Turn\nX");
const displayP2Turns = display(".turns.playertwo>span", "O");
const displayAiPaused = display(".pauseai>span", "AI Paused");

const playerOne = playerFactory(
  "Player1",
  0,
  "X",
  ".setnames.playerone > input",
  displayP1Turns
);
const playerTwo = playerFactory(
  "Player2",
  1,
  "O",
  ".setnames.playertwo > input",
  displayP2Turns
);

const gameBoard = (() => {
  let moveNumber = 1;
  let boardContent = [];
  for (let index = 0; index < 9; index++) {
    boardContent[index] = "";
  }

  let gameEnd = [0, 0]; //[isGameEnd, isNotDraw]
  const players = [playerOne, playerTwo];
  let activePlayer = 0 + (playerOne.getMarker() == "O"); // 0 = p1, 1 = p2
  let isAiPaused = 0;
  const setAiPause = (value) => {
    isAiPaused = value;
  };

  function otherValue(currentValue, value1, value2) {
    if (currentValue == value1) {
      return value2;
    } else {
      return value1;
    }
  }

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
    if (!isAiPaused && players[activePlayer].inputControl && cellNumber == 10) {
      //cellnumber 10 is AI move
      handleMove(players[activePlayer].getMove(boardContent));
    } else if (
      boardContent[cellNumber - 1] === "" &&
      !gameEnd[0] &&
      cellNumber != 10
    ) {
      boardContent[cellNumber - 1] = players[activePlayer].getMarker();
      handleMoveEnd();
    }
  };

  function handleMoveEnd() {
    function isDraw() {
      return moveNumber === 10;
    }

    moveNumber++;

    if (isWin()) {
      gameEnd = [1, 1];
    } else if (isDraw()) {
      gameEnd = [1, 0];
    } else {
      activePlayer = otherValue(activePlayer, 0, 1);
    }
    updateInterface();
    handleMove(10);
  }

  const swapTurn = () => {
    if (moveNumber == 1) {
      const oldMarkerOne = playerOne.getMarker();
      const oldMarkerTwo = playerTwo.getMarker();
      playerOne.setMarker(oldMarkerTwo);
      playerTwo.setMarker(oldMarkerOne);
      activePlayer = 0 + (playerOne.getMarker() == "O");
      updateInterface();
    }
  };

  const resetValues = () => {
    moveNumber = 1;
    for (let index = 0; index < 9; index++) {
      boardContent[index] = "";
    }
    activePlayer = 0 + (playerOne.getMarker() == "O");
    gameEnd = [0, 0];
    updateInterface();
  };

  function updateInterface() {
    for (let cellNumber = 1; cellNumber <= 9; cellNumber++) {
      const targetCell = document.querySelector(
        `[data-number="${cellNumber}"]`
      );
      targetCell.textContent = boardContent[cellNumber - 1];
    }
    if (gameEnd[0]) {
      let tempWinMsg = "";
      if (gameEnd[1]) {
        tempWinMsg = players[activePlayer].name + "\nwins!";
      } else {
        tempWinMsg = "Draw";
      }
      displayGameStatus.toggleText(0);
      displayWinMsg.toggleText(1);
      displayWinMsg.updateText(tempWinMsg);
    } else {
      const textGameStatus = `${players[activePlayer].name}'s Turn\nMove #${moveNumber}`;
      displayGameStatus.updateText(textGameStatus);
      displayGameStatus.toggleText(1);
      displayWinMsg.toggleText(0);
    }
  }

  function editNameEventFunction(player) {
    player.getTextElement().addEventListener("input", (event) => {
      player.name = event.target.value;
      updateInterface();
    });
  }
  editNameEventFunction(playerTwo);
  editNameEventFunction(playerOne);

  return {
    handleMove,
    resetValues,
    swapTurn,
    setAiPause,
  };
})();

initGame.addButtonsFunction();
initGame.addCellsFunction();
initGame.watchControlSelectSetting();
