import { QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { Player } from "../enums/Player";

export interface GameDoc {
  moves: {
    by: Player;
    super: [number, number];
    local: [number, number];
    cell: [number, number];
  }[];
  created_at: Date;
  last_updated_at: Date;
  players_joined: number;
}

export const gameConverter = {
  toFirestore: (game: GameDoc) => game,
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): GameDoc => {
    const data = snapshot.data(options);
    return data as GameDoc;
  },
};
