export class Coordinate {
  constructor(
    private xCoord: number,
    private yCoord: number,
    private universal = false
  ) {}

  public get x() {
    return this.xCoord;
  }

  public get y() {
    return this.yCoord;
  }

  public toTuple() {
    return [this.xCoord, this.yCoord];
  }

  public equals(coordinate: Coordinate) {
    return (
      this.universal ||
      coordinate.universal ||
      (this.x === coordinate.x && this.y === coordinate.y)
    );
  }
}
