import { Player } from "../enums/Player";
import { Coordinate } from "./Coordinate";

export class Cell {
  constructor(
    public value: Player | null = null,
    public coordinate: Coordinate
  ) {}
}
