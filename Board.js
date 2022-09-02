const BOARD_SIZE = 4;
const CELL_SIZE = 100;
const GAP = 15;

export default class Board {
  #cells;
  constructor(boardElement) {
    boardElement.style.setProperty("--board-size", BOARD_SIZE);
    boardElement.style.setProperty("--cell-size", `${CELL_SIZE}px`);
    boardElement.style.setProperty("--gap", `${GAP}px`);
    this.#cells = createCellElements(boardElement).map(
      (cellElement, index) =>
        new Cell(
          cellElement,
          index % BOARD_SIZE,
          Math.floor(index / BOARD_SIZE)
        )
    );
  }

  get cells() {
    return this.#cells;
  }

  get emptyCells() {
    return this.#cells.filter((cell) => cell.tile == null);
  }

  get cellsByColumns() {
    return this.#cells.reduce((cells, cell) => {
      cells[cell.x] = cells[cell.x] || [];
      cells[cell.x][cell.y] = cell;
      return cells;
    }, []);
  }

  get cellsByRows() {
    return this.#cells.reduce((cells, cell) => {
      cells[cell.y] = cells[cell.y] || [];
      cells[cell.y][cell.x] = cell;
      return cells;
    }, []);
  }

  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.emptyCells.length);
    return this.emptyCells[randomIndex];
  }
}

class Cell {
  #x;
  #y;
  #tile;
  #cellElement;
  #mergeTile;

  constructor(cellElement, x, y) {
    this.#x = x;
    this.#y = y;
    this.#cellElement = cellElement;
  }

  set tile(value) {
    this.#tile = value;
    if (value == null) return;
    this.#tile.x = this.#x;
    this.#tile.y = this.#y;
  }

  get tile() {
    return this.#tile;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get MergeTile() {
    return this.#mergeTile;
  }

  set MergeTile(value) {
    this.#mergeTile = value;
    if (value == null) return;
    this.#mergeTile.x = this.#x;
    this.#mergeTile.y = this.#y;
  }

  canAccept(tile) {
    return (
      this.tile == null ||
      (this.mergeTile == null && this.tile.value == tile.value)
    );
  }

  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) return;
    this.tile.value = this.tile.value + this.mergeTile.value;
    this.mergeTile.remove();
    this.mergeTile = null;
  }
}

const createCellElements = function (boardElement) {
  let cells = [];
  for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
    const cell = document.createElement("div");
    boardElement.appendChild(cell);
    cell.classList.add("cell");
    cells.push(cell);
  }
  return cells;
};
