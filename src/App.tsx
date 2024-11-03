import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Game } from "./logic/Game";
import { Player } from "./enums/Player";
import { GameComponent } from "./ui/GameComponent";
import { DataComponent } from "./ui/DataComponent";
import { db } from "./api/firebase";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { showConfirm } from "react-confirm-prompt";
import { gameConverter, GameDoc } from "./models/GameDoc";

function App() {
  const [game, setGame] = useState<Game>(new Game());
  const [timeElapsed, setTimeElapsed] = useState(0);

  const gameTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const onGameWonBy = useCallback((by: Player) => {
    alert(`Player ${by === Player.X ? "X" : "O"} wins!`);
  }, []);

  useEffect(() => {
    setGame(new Game(onGameWonBy));
  }, [onGameWonBy]);

  useEffect(() => {
    return () => {
      if (gameTimer.current) {
        clearInterval(gameTimer.current);
        gameTimer.current = null;
      }
    };
  }, [gameTimer]);

  useEffect(() => {
    (async function () {
      const isOnline = await showConfirm("Play local or online?", {
        description:
          "Would you like to play a game locally or online with another player remotely?",
        confirmLabel: "Online",
        cancelLabel: "Local",
      });

      if (isOnline) {
        const isNew = await showConfirm("Create new game or join with code?", {
          description:
            "Would you like to start a new online game or join an existing one with its game code?",
          confirmLabel: "Create New",
          cancelLabel: "Join with Code",
        });

        let id: string | null = null;
        if (isNew) {
          id = Math.random().toString(16).split(".").at(-1)!;
          const newGameDoc = {
            moves: [],
            created_at: new Date(),
            last_updated_at: new Date(),
            players_joined: 1,
          };

          await setDoc(doc(db, "games", id), newGameDoc);
          setGame(Game.loadFrom(id, newGameDoc, Player.X));
        } else {
          while (!id) {
            id = window.prompt("Enter game ID:");
          }
        }

        const unsub = onSnapshot(
          doc(db, "games", id).withConverter(gameConverter),
          async (gameDoc) => {
            if (!gameDoc.exists())
              return alert("No game with this game code was found!");

            const game = gameDoc.data();
            if (game.players_joined < 2) {
              await updateDoc(doc(db, "games", id!), {
                last_updated_at: new Date(),
                players_joined: game.players_joined + 1,
              });
            }
            setGame(
              Game.loadFrom(gameDoc.id, game, isNew ? Player.O : Player.X)
            );
          }
        );

        return () => unsub();
      } else {
      }
    })();
  }, []);

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
