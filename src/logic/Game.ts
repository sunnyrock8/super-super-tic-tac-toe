import { Player } from "../enums/Player";
import { cloneObject } from "../utils/cloneObject";
import { transpose } from "../utils/transpose";
import { Cell } from "./Cell";
import { Coordinate } from "./Coordinate";
import { Grid } from "./Grid";

const THREE_ARRAY = [0, 1, 2];

export class Game {
  private grid = new Grid([], new Coordinate(0, 0));
  private currentPlayer = Player.X;
  private currentSuperGrid = new Coordinate(0, 0, true);
  private currentNormalGrid = new Coordinate(0, 0, true);

  constructor() {
    this.initializeGame();
  }

  private initializeGame() {
    this.grid = new Grid(
      [
        this.initializeSuperGridRow(0),
        this.initializeSuperGridRow(1),
        this.initializeSuperGridRow(2),
      ],
      new Coordinate(0, 0)
    );
  }

  public getGrid() {
    return cloneObject(this.grid);
  }

  public get activePlayer() {
    return this.currentPlayer;
  }

  public get activeSuperGrid() {
    return this.currentSuperGrid;
  }

  public get activeNormalGrid() {
    return this.currentNormalGrid;
  }

  public copy() {
    return cloneObject(this);
  }

  public swapTurns() {
    this.currentPlayer = this.currentPlayer === Player.X ? Player.O : Player.X;
  }

  public swapPlayableArea(
    normalCoordinate: Coordinate,
    cellCoordinate: Coordinate
  ) {
    this.currentSuperGrid = normalCoordinate;
    this.currentNormalGrid = cellCoordinate;

    const superGrid = this.grid.cells[this.currentSuperGrid.y][
      this.currentSuperGrid.x
    ] as Grid;
    const normalGrid = superGrid.cells[this.currentNormalGrid.y][
      this.currentNormalGrid.x
    ] as Grid;

    if (superGrid.wonBy !== null) {
      this.currentSuperGrid = new Coordinate(
        this.currentSuperGrid.x,
        this.currentSuperGrid.y,
        true
      );
    }
    if (normalGrid.wonBy !== null) {
      this.currentNormalGrid = new Coordinate(
        this.currentNormalGrid.x,
        this.currentNormalGrid.y,
        true
      );
    }
  }

  public setCellValue(
    value: Player,
    superCoordinate: Coordinate,
    normalCoordinate: Coordinate,
    cellCoordinate: Coordinate
  ) {
    const newGame = this.copy();

    const superGrid = newGame.grid.cells[superCoordinate.y][
      superCoordinate.x
    ] as Grid;
    const normalGrid = superGrid.cells[normalCoordinate.y][
      normalCoordinate.x
    ] as Grid;
    const cell = normalGrid.cells[cellCoordinate.y][cellCoordinate.x] as Cell;

    if (cell.value !== null) return newGame;

    cell.value = value;

    normalGrid.checkWonBy();
    superGrid.checkWonBy();
    newGame.grid.checkWonBy();

    newGame.swapTurns();
    newGame.swapPlayableArea(normalCoordinate, cellCoordinate);

    return newGame;
  }

  public getCell(
    superCoordinate: Coordinate,
    normalCoordinate: Coordinate,
    cellCoordinate: Coordinate
  ) {
    const superGrid = this.grid.cells[superCoordinate.y][
      superCoordinate.x
    ] as Grid;
    const normalGrid = superGrid.cells[normalCoordinate.y][
      normalCoordinate.x
    ] as Grid;
    const cell = normalGrid.cells[cellCoordinate.y][cellCoordinate.x] as Cell;

    return cell;
  }

  private initializeCellRow(n: number) {
    return THREE_ARRAY.map((nCell) => new Cell(null, new Coordinate(nCell, n)));
  }

  private initializeNormalGridRow(n: number) {
    return THREE_ARRAY.map(
      (nNormal) =>
        new Grid(
          [
            this.initializeCellRow(0),
            this.initializeCellRow(1),
            this.initializeCellRow(2),
          ],
          new Coordinate(nNormal, n)
        )
    );
  }

  private initializeSuperGridRow(n: number) {
    return THREE_ARRAY.map(
      (nSuper) =>
        new Grid(
          [
            this.initializeNormalGridRow(0),
            this.initializeNormalGridRow(1),
            this.initializeNormalGridRow(2),
          ],
          new Coordinate(nSuper, n)
        )
    );
  }
}
