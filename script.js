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
      gameBoard.handleMove(10);
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

  const getMove2 = (boardContent) => {
    let moveList = readBoard(boardContent);

    function readBoard(board) {
      let moveListTemp = [];
      let counter = [1, 1];

      for (let i = 0; i < board.length; i++) {
        if (board[i] == "X") {
          moveListTemp[counter[0] * 2 - 2] = i + 1;
          counter[0]++;
        } else if (board[i] == "O") {
          moveListTemp[counter[1] * 2 - 1] = i + 1;
          counter[1]++;
        }
      }
      return moveListTemp;
    }

    let moveLogger = [];

    function bestMove(moveList, moveLogger) {
      function getResult(resultSubArray, moveList) {
        let resultInt = 0;
        const markerX = moveList.length % 2 == 0; //1 = X turn  0 = O Turn

        function checkCell(cell, cellNumber) {
          if (cell == -1) {
            //if cell empty
            resultSubArray.push(cellNumber);
            if (!emptyCells.includes(cellNumber)) {
              emptyCells.push(cellNumber);
            }
          } else if (cell % 2 == !markerX) {
            // if cell is your marker
            resultInt += 1;
          } else if (cell % 2 == markerX) {
            // if cell is opponent marker
            resultInt += 3;
          }
        }

        checkCell(moveList.indexOf(resultSubArray[0]), resultSubArray[0]);
        checkCell(moveList.indexOf(resultSubArray[1]), resultSubArray[1]);
        checkCell(moveList.indexOf(resultSubArray[2]), resultSubArray[2]);

        return resultInt;
      }

      let resultArr = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7],
      ];

      let reportArr = [];

      let emptyCells = [];

      for (let index = 0; index < resultArr.length; index++) {
        const result = getResult(resultArr[index], moveList);
        if (result == 2) {
          const temp = resultArr[index][3];
          reportArr.push([10, temp]);
          index = 10;
        } else if (result == 6) {
          const temp = resultArr[index][3];
          reportArr.push([11, temp]);
        }
      }
      if (reportArr.length == 0) {
        reportArr.push([0, 0]); // filler to avoid undefined
      }

      function addEntry(entryType, cellNumber, moveLogger) {
        if (moveLogger.length == 0) {
          moveLogger[0] = [1, ""];
        }
        if (entryType <= 2) {
          moveList.push(cellNumber);
          const moveListTemp = moveList.slice();
          moveLogger[moveLogger[0][0]] = moveListTemp;
          if (entryType == 1) {
            moveLogger[0][1] += "W" + (moveListTemp.length % 2);
            const temp = moveLogger[0][1];
            moveLogger[moveLogger[0][0]].push(temp);
            if (moveLogger[0][1].slice(-4, -1) == "T W") {
              const temp = moveLogger[moveLogger[0][0]].slice();
              moveLogger2.push(temp);
            }
            moveLogger[0][1] = moveLogger[0][1].slice(0, -2);
          } else if (entryType == 2) {
            moveLogger[0][1] += "D";
            const temp = moveLogger[0][1];
            moveLogger[moveLogger[0][0]].push(temp);
            moveLogger[0][1] = moveLogger[0][1].slice(0, -1);
          }
          moveList.pop();
          moveLogger[0][0]++;
        } else if (entryType == 3) {
          moveLogger[0][1] += "T ";
        } else if (entryType == 4) {
          moveLogger[0][1] += "R ";
        } else if (entryType == 5) {
          const tempString =
            moveLogger[moveLogger[0][0] - 1][
              moveLogger[moveLogger[0][0] - 1].length - 1
            ];
          moveLogger[moveLogger[0][0] - 1][
            moveLogger[moveLogger[0][0] - 1].length - 1
          ] =
            tempString.slice(0, cellNumber) +
            "S" +
            tempString.slice(cellNumber + 1);
        } else if (entryType == 99) {
          moveLogger[0][1] = moveLogger[0][1].slice(0, -2);
        }
      }

      if (reportArr[reportArr.length - 1][0] == 10) {
        addEntry(1, reportArr[reportArr.length - 1][1], moveLogger);
        return [reportArr[reportArr.length - 1][1], "W"];
      } else if (moveList.length == 8) {
        addEntry(2, emptyCells[0], moveLogger);
        return [emptyCells[0], "D"];
      } else if (
        reportArr[reportArr.length - 1][0] == 11 &&
        moveLogger.length == 0
      ) {
        return [reportArr[reportArr.length - 1][1], "T"];
      } else if (reportArr[reportArr.length - 1][0] == 11) {
        const temp = reportArr[reportArr.length - 1][1];
        moveList.push(temp);
        addEntry(3, reportArr[reportArr.length - 1][1], moveLogger);
        bestMove(moveList, moveLogger);
        addEntry(99, "remove T", moveLogger);
        moveList.pop();
        return [reportArr[reportArr.length - 1][1], "T"];
      } else {
        const possibleMoves = emptyCells.slice();
        let newPossibleMoves = possibleMoves.slice();
        const moveLoggerStartLength = moveLogger.length;

        for (let i = 0; i < possibleMoves.length; i++) {
          moveList.push(possibleMoves[i]);
          addEntry(4, possibleMoves[i], moveLogger);
          const bestMoveNumber = bestMove(moveList, moveLogger);
          addEntry(99, "remove R", moveLogger);
          moveList.pop();
          const currentMarker = (moveList.length + 1) % 2; //0:X, 1:O
          const lastSim =
            moveLogger[moveLogger[0][0] - 1][
              moveLogger[moveLogger[0][0] - 1].length - 1
            ];
          if (bestMoveNumber != undefined) {
            if (bestMoveNumber[1] == "S") {
              newPossibleMoves.splice(
                newPossibleMoves.indexOf(possibleMoves[i]),
                1
              );
              moveLogger.pop();
              moveLogger[0][0]--;
            } else if (lastSim.slice(-2) == "W" + currentMarker) {
              const cellNumberLog =
                (moveLogger[moveLogger[0][0] - 1].length -
                  1 -
                  moveList.length) *
                -2;
              addEntry(5, cellNumberLog, moveLogger);
              const invalidCount =
                moveLogger.length - moveLoggerStartLength - 1;
              moveLogger.splice(moveLoggerStartLength, invalidCount);
              moveLogger[0][0] -= invalidCount;
              return [possibleMoves[i], "S"];
            } else if (lastSim.slice(-2) == "W" + (0 + !currentMarker)) {
              newPossibleMoves.splice(
                newPossibleMoves.indexOf(possibleMoves[i]),
                1
              );
              moveLogger.pop();
              moveLogger[0][0]--;
            }
          }
        }
        if (moveList.length == finalAnswer - 1 && newPossibleMoves.length > 0) {
          const randomMove = Math.floor(
            Math.random() * newPossibleMoves.length
          );
          return [newPossibleMoves[randomMove], "R"];
        } else if (moveList.length == finalAnswer - 1) {
          return [possibleMoves[0], "L"];
        }
      }
    }
    const finalAnswer = moveList.length + 1;
    if (moveList.length == 0) {
      moveList.push(Math.floor(Math.random() * 9) + 1);
    } else {
      const finalMove = bestMove(moveList, moveLogger);
      console.log(finalMove);
      moveList.push(finalMove[0]);
    }
    return moveList[moveList.length - 1];
  };
  return {
    name,
    inputControl,
    getMarker,
    setMarker,
    editName,
    getTextElement,
    getMove,
    getMove2,
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
      handleMove(players[activePlayer].getMove2(boardContent));
    } else if (isAiPaused && players[activePlayer].inputControl) {
      // cellClick during AI move while AI paused
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
