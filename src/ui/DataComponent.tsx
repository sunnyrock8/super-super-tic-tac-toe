import { styled } from "styled-components";
import { Player } from "../enums/Player";
import { Game } from "../logic/Game";
import { secondsToMmSs } from "../utils/secondsToMmSs";

export const DataComponent = ({
  game,
  setGame,
  gameTimer,
  timeElapsed,
  setTimeElapsed,
}: {
  game: Game;
  setGame: React.Dispatch<React.SetStateAction<Game>>;
  gameTimer: React.MutableRefObject<ReturnType<typeof setInterval> | null>;
  setTimeElapsed: React.Dispatch<React.SetStateAction<number>>;
  timeElapsed: number;
}) => {
  const gameGrid = game.getGrid();

  return (
    <>
      <CurrentPlayerText>
        Player{" "}
        <span
          style={{ color: game.activePlayer === Player.X ? "red" : "green" }}
        >
          {(gameGrid.wonBy ?? game.activePlayer) === Player.X ? "X" : "O"}
        </span>
        {gameGrid.wonBy === null ? "'s turn" : " wins"}
      </CurrentPlayerText>
      <TimeElapsedText>{secondsToMmSs(timeElapsed)}</TimeElapsedText>
      <GameCodeText>{game.gameCode}</GameCodeText>
      <ResetButton
        onClick={() => {
          setGame(new Game());

          if (gameTimer.current) {
            clearInterval(gameTimer.current);
            gameTimer.current = null;
          }
          setTimeElapsed(0);
        }}
      >
        Reset Game
      </ResetButton>
    </>
  );
};

const DataText = styled.h3`
  position: absolute;
  right: 2rem;
  bottom: 2rem;
  font-size: 2rem;
  font-family: sans-serif;
`;

const CurrentPlayerText = styled(DataText)`
  right: 2rem;
  bottom: 2rem;
`;

const TimeElapsedText = styled(DataText)`
  right: 2rem;
  top: 2rem;
`;

const GameCodeText = styled(DataText)`
  left: 2rem;
  top: 2rem;
`;

const ResetButton = styled.button`
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  font-size: 1.7rem;
  font-family: sans-serif;
  padding: 0.7rem 1.2rem;
  cursor: pointer;
`;
