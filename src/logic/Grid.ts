import { Player } from "../enums/Player";
import { transpose } from "../utils/transpose";
import { Cell } from "./Cell";
import { Coordinate } from "./Coordinate";

export class Grid {
  constructor(
    public cells: (Grid | Cell)[][],
    public coordinate: Coordinate,
    public wonBy: Player | null = null
  ) {}

  public checkWonBy() {
    const values = this.cells.map((row) =>
      row.map((child) => (child instanceof Cell ? child.value : child.wonBy))
    );
    const transposedValues = transpose(values);

    for (const row of values) {
      const rowWonBy = this.checkLineWonBy(row);

      if (rowWonBy !== null) {
        this.wonBy = rowWonBy;
        return rowWonBy;
      }
    }

    for (const col of transposedValues) {
      const colWonBy = this.checkLineWonBy(col);

      if (colWonBy !== null) {
        this.wonBy = colWonBy;
        return colWonBy;
      }
    }

    const diagonalWonBy =
      this.checkLineWonBy([values[0][0], values[1][1], values[2][2]]) ??
      this.checkLineWonBy([values[0][2], values[1][1], values[2][0]]);
    if (diagonalWonBy !== null) {
      this.wonBy = diagonalWonBy;
      return diagonalWonBy;
    }

    this.wonBy = null;
    return null;
  }

  private checkLineWonBy(row: (Player | null)[]) {
    if (row[0] === row[1] && row[1] === row[2]) {
      return row[0];
    }

    return null;
  }
}
