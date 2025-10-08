import type { ScoreItem } from "./ScoreItem.types";

type BaseScore = {
  average: number;
  rank: number;
};

export type Scores = BaseScore & {
  courses: ScoreItem[];
};
