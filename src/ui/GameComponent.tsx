import React from "react";
import { styled } from "styled-components";
import { Game } from "../logic/Game";
import { Grid as GridType } from "../logic/Grid";
import { Coordinate } from "../logic/Coordinate";
import { Player } from "../enums/Player";

const THREE_ARRAY = [0, 1, 2];

export const GameComponent = ({
  game,
  setGame,
  gameTimer,
  setTimeElapsed,
}: {
  game: Game;
  setGame: React.Dispatch<React.SetStateAction<Game>>;
  gameTimer: React.MutableRefObject<ReturnType<typeof setInterval> | null>;
  setTimeElapsed: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const gameGrid = game.getGrid();
  const wonSuperGrids = game.completedSuperGrids;
  const wonGrids = game.completedGrids;

  return (
    <Board>
      <Grid $wonBy={gameGrid.wonBy}>
        {THREE_ARRAY.map((nSuperRow) =>
          THREE_ARRAY.map((nSuperCol) => {
            const superGridCoordinates = new Coordinate(nSuperCol, nSuperRow);
            const superGrid = gameGrid.cells[nSuperRow][nSuperCol] as GridType;

            return (
              <Grid
                key={`Super-${nSuperCol}-${nSuperRow}`}
                $wonBy={superGrid.wonBy}
              >
                {THREE_ARRAY.map((nNormalRow) =>
                  THREE_ARRAY.map((nNormalCol) => {
                    const normalGridCoordinates = new Coordinate(
                      nNormalCol,
                      nNormalRow
                    );
                    const normalGrid = superGrid.cells[nNormalRow][
                      nNormalCol
                    ] as GridType;

                    return (
                      <Grid
                        key={`Super-${nSuperCol}-${nSuperRow}--Normal-${nNormalCol}-${nNormalRow}`}
                        $wonBy={normalGrid.wonBy}
                      >
                        {THREE_ARRAY.map((nCellRow) =>
                          THREE_ARRAY.map((nCellCol) => {
                            const cell = game.getCell(
                              new Coordinate(nSuperCol, nSuperRow),
                              new Coordinate(nNormalCol, nNormalRow),
                              new Coordinate(nCellCol, nCellRow)
                            );
                            const activeSection =
                              superGridCoordinates.equals(
                                game.activeSuperGrid
                              ) &&
                              normalGridCoordinates.equals(
                                game.activeNormalGrid
                              );
                            const disabled =
                              cell.value !== null ||
                              !activeSection ||
                              !!wonSuperGrids.find((c) =>
                                c.equals(superGridCoordinates)
                              ) ||
                              !!wonGrids.find(
                                ([s, n]) =>
                                  s.equals(superGridCoordinates) &&
                                  n.equals(normalGridCoordinates)
                              );

                            return (
                              <Cell
                                key={`Super-${nSuperCol}-${nSuperRow}--Normal-${nNormalCol}-${nNormalRow}--Cell-${nCellCol}-${nCellRow}`}
                                $player={cell.value}
                                $disabled={disabled}
                                $activeSection={activeSection}
                                onClick={() => {
                                  if (disabled) return;

                                  const newGame = game.setCellValue(
                                    game.activePlayer,
                                    new Coordinate(nSuperCol, nSuperRow),
                                    new Coordinate(nNormalCol, nNormalRow),
                                    new Coordinate(nCellCol, nCellRow)
                                  );

                                  setGame(newGame);

                                  if (!gameTimer.current) {
                                    gameTimer.current = setInterval(() => {
                                      setTimeElapsed(
                                        (timeElapsed) => timeElapsed + 1
                                      );
                                    }, 1000);
                                  }
                                }}
                              >
                                {cell.value === null
                                  ? ""
                                  : cell.value === Player.X
                                  ? "X"
                                  : "O"}
                              </Cell>
                            );
                          })
                        )}
                      </Grid>
                    );
                  })
                )}
              </Grid>
            );
          })
        )}
      </Grid>
    </Board>
  );
};

const Board = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vh;
  height: 100vh;
  padding: 2rem;

  & > div > div {
    outline: 3px dashed teal;

    & > div {
      outline: 1.5px dashed teal;

      & > div {
        outline: 0.5px dashed teal;
      }
    }
  }
`;

const Grid = styled.div<{
  $wonBy: Player | null;
}>`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  width: 100%;
  height: 100%;

  &::after {
    display: ${({ $wonBy }) => ($wonBy !== null ? "grid" : "none")};
    place-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ $wonBy }) =>
      $wonBy === Player.X ? "rgba(255, 0, 0, 0.8)" : "rgba(0, 255, 0, 0.8)"};
    font-size: 5rem;
    font-family: sans-serif;
    color: #fff;
    content: "${({ $wonBy }) =>
      $wonBy === Player.X ? "X" : $wonBy === Player.O ? "O" : ""}";
  }
`;

const Cell = styled.div<{
  $player: Player | null;
  $disabled: boolean;
  $activeSection: boolean;
}>`
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  background-color: ${({ $disabled, $activeSection }) =>
    $disabled && !$activeSection ? "#a1a1a1" : "#fff"};
  display: grid;
  place-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  font-family: sans-serif;
  color: ${({ $player }) => ($player === Player.X ? "red" : "green")};
`;
