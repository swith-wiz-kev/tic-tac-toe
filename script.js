/*
multiple

vars

players
  playermoves
    move number
    possible moves
    location
  isplayerturn
  firstorsecond
  playerpiece
cells
  content
  related element
editname
  button
  text
isAiPaused
isAiControl


single

vars

turnstate
controlstate
aipausestate
isGameEnd
endResult




*/

const initGame = (() => {
  const addButtonsFunction = () => {
    function initializeButton(button) {
      const buttonId = button.className;
      const buttonFunction = "";
      switch (buttonId) {
        case "editp1":
          buttonFunction = editNameOne;

          break;

        case "editp2":
          buttonFunction = editNameTwo;
          break;
        case "swap":
          buttonFunction = swapXO;
          break;
        case "restart":
          buttonFunction = restartGame;
          break;
        default:
          break;
      }
      button.addEventListener("click", buttonFunction);
    }

    function editNameOne(event) {}

    function editNameTwo(event) {}

    function swapXO(event) {}

    function restartGame(event) {}

    const buttons = document.querySelectorAll("button");
    buttons.forEach(initializeButton);
  };

  const addCellsFunction = () => {
    function cellClick() {}

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

//init
initGame.addButtonsFunction();
initGame.addCellsFunction();
initGame.watchControlSelectSetting();
