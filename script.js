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

  const handleMove = (cellNumber) => {
    if (boardContent[cellNumber - 1] === "") {
      fillCell(cellNumber, currentMarker);
      gameBoard.handleMoveEnd();
    }
  };

  const handleMoveEnd = () => {};

  return {
    handleMove,
    handleMoveEnd,
  };
})();

//init
initGame.addButtonsFunction();
initGame.addCellsFunction();
initGame.watchControlSelectSetting();
