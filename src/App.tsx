import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Game } from "./logic/Game";
import { Player } from "./enums/Player";
import { GameComponent } from "./ui/GameComponent";
import { DataComponent } from "./ui/DataComponent";

function App() {
  const [game, setGame] = useState(new Game());
  const [timeElapsed, setTimeElapsed] = useState(0);

  const gameTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const gameGrid = game.getGrid();

  useEffect(() => {
    return () => {
      if (gameTimer.current) {
        clearInterval(gameTimer.current);
        gameTimer.current = null;
      }
    };
  }, [gameTimer]);

  useEffect(() => {
    const gameWonBy = gameGrid.wonBy;

    if (gameWonBy !== null) {
      alert("Player " + (gameWonBy === Player.X ? "X" : "O") + " wins");
    }
  }, [gameGrid]);

  return (
    <Main>
      <GameComponent {...{ game, setGame, gameTimer, setTimeElapsed }} />
      <DataComponent
        {...{ game, setGame, gameTimer, timeElapsed, setTimeElapsed }}
      />
    </Main>
  );
}

const Main = styled.div`
  width: 100vw;
  height: 100vh;
`;

export default App;
