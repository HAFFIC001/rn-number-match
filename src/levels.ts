import { LevelSpec } from "./types";

export const LEVELS: LevelSpec[] = [
  { id: 1, name: "Novice", cols: 8, rows: 9,  initialFilledRows: 3, addRowLimit: 6, timerSeconds: 120 },
  { id: 2, name: "Adept",  cols: 9, rows: 10, initialFilledRows: 4, addRowLimit: 7, timerSeconds: 120 },
  { id: 3, name: "Master", cols: 10, rows: 12, initialFilledRows: 4, addRowLimit: 8, timerSeconds: 120 }
];