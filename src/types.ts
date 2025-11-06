export type Cell = {
  id: string;
  row: number;
  col: number;
  value: number; // 1..9, 0 means empty
  matched: boolean; // faded when true
};

export type LevelSpec = {
  id: number;
  name: string;
  cols: number;
  rows: number; // total grid height
  initialFilledRows: number; // 3-4
  addRowLimit: number; // how many times Add Row can be used
  timerSeconds: number; // 120
};