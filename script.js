const gameBoard = gameboardModule(() => {
  let boardState = [];

  const initializeBoard = () => {
    createCells();
    assignCells();
  };
  const initializeSettings = () => {
    getOpponent();
    getFirstTurn();
  };
  return {
    initializeBoard,
    initializeSettings,
  };
})();

gameBoard.initializeBoard();
gameBoard.initializeSettings();
