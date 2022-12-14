import Board from "./Board.js";
import Tile from "./Tile.js";

const boardElement = document.querySelector(".board");

const board = new Board(boardElement);

board.randomEmptyCell().tile = new Tile(boardElement);
board.randomEmptyCell().tile = new Tile(boardElement);

const setupInput = function () {
  window.addEventListener("keydown", handleInput, { once: true });
};

const handleInput = async function (e) {
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;

    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;

    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;

    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;

    default:
      setupInput();
      return;
  }

  board.cells.forEach((cell) => cell.mergeTiles());

  const newTile = new Tile(boardElement);
  board.randomEmptyCell().tile = newTile;

  if(!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()){
    newTile.waitForTransition(true).then(()=>{console.log("you lose")})
    return;
  }

  setupInput();
};

const moveUp = function () {
  slideTiles(board.cellsByColumns);
};

const moveDown = function () {
  slideTiles(board.cellsByColumns.map((column) => [...column].reverse()));
};

const moveRight = function () {
  slideTiles(board.cellsByRows.map((column) => [...column].reverse()));
};

const moveLeft = function () {
  slideTiles(board.cellsByRows);
};

const slideTiles = function (cells) {
  Promise.all(
    cells.flatMap((group) => {
      const promises = [];
      for (let i = 1; i < group.length; i++) {
        const cell = group[i];
        if (cell.tile == null) continue;
        let lastValidCell;
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j];
          if (!moveToCell.canAccept(cell.tile)) break;
          lastValidCell = moveToCell;
        }
        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition());
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile;
          } else {
            lastValidCell.tile = cell.tile;
          }
          cell.tile = null;
        }
      }
      return promises;
    })
  );
};

setupInput();

const canMoveUp = function () {
  return canMove(board.cellsByColumns);
};

const canMoveDown = function () {
  return canMove(board.cellsByColumns.map((column) => column.reverse()));
};

const canMoveLeft = function () {
  return canMove(board.cellsByRows);
};

const canMoveRight = function () {
  return canMove(board.cellsByRows.map((column) => column.reverse()));
};

const canMove = function (cells) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index == 0) return false;
      if (cell.tile == null) return false;
      const moveToCell = group[index - 1];
      return moveToCell.canAccept(cell.tile);
    });
  });
};
