import { Cell, LevelSpec } from "../types";

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export function seedGrid(level: LevelSpec): { grid: Cell[]; pool: number[] } {
  const total = level.rows * level.cols;
  const grid: Cell[] = Array.from({ length: total }, (_, i) => {
    const row = Math.floor(i / level.cols);
    const col = i % level.cols;
    const shouldFill = row < level.initialFilledRows;
    const v = shouldFill ? randInt(1, 9) : 0;
    return { id: `${row}-${col}-${Math.random().toString(36).slice(2, 7)}`, row, col, value: v, matched: false };
  });
  // Remaining numbers pool for future rows
  const pool: number[] = Array.from({ length: level.cols * (level.rows - level.initialFilledRows) }, () => randInt(1, 9));
  return { grid, pool };
}

export function idxOf(cell: Cell, cols: number) {
  return cell.row * cols + cell.col;
}

export function canMatch(a: Cell, b: Cell): boolean {
  if (a.matched || b.matched) return false;
  if (a.value === 0 || b.value === 0) return false;
  return a.value === b.value || a.value + b.value === 10;
}

// Cells between two picks must be empty/matched along a straight path
export function isPathClear(a: Cell, b: Cell, grid: Cell[], cols: number): boolean {
  const ai = idxOf(a, cols), bi = idxOf(b, cols);
  const [from, to] = ai < bi ? [ai, bi] : [bi, ai];

  const ar = Math.floor(from / cols), ac = from % cols;
  const br = Math.floor(to / cols), bc = to % cols;

  const dr = Math.sign(br - ar);
  const dc = Math.sign(bc - ac);

  const isStraight =
    (dr === 0 && dc !== 0) || // horizontal
    (dc === 0 && dr !== 0) || // vertical
    (Math.abs(br - ar) === Math.abs(bc - ac) && dr !== 0); // diagonal

  if (isStraight) {
    let r = ar + dr, c = ac + dc;
    while (!(r === br && c === bc)) {
      const i = r * cols + c;
      const cell = grid[i];
      if (!cell.matched && cell.value !== 0) return false;
      r += dr; c += dc;
    }
    return true;
  }

  // Flattened forward scan (row-end -> next row-start) allowing only empty cells between
  for (let i = from + 1; i < to; i++) {
    const cell = grid[i];
    if (!cell.matched && cell.value !== 0) return false;
  }
  return true;
}

export function tryMatch(
  a: Cell | null,
  b: Cell | null,
  grid: Cell[],
  cols: number
): { success: boolean; updated: Cell[] } {
  if (!a || !b) return { success: false, updated: grid };
  if (a === b) return { success: false, updated: grid };
  if (!canMatch(a, b)) return { success: false, updated: grid };
  if (!isPathClear(a, b, grid, cols)) return { success: false, updated: grid };

  const updated = grid.map((c) => {
    if (c.id === a.id || c.id === b.id) return { ...c, matched: true };
    return c;
  });
  return { success: true, updated };
}

export function addRow(grid: Cell[], pool: number[], level: LevelSpec): { grid: Cell[]; pool: number[] } {
  if (pool.length === 0) return { grid, pool };
  const newGrid = [...grid];
  const cols = level.cols;

  // Find the first fully empty row from top; if none, shift up by one
  let targetRow = -1;
  for (let r = 0; r < level.rows; r++) {
    const rowSlice = newGrid.slice(r * cols, r * cols + cols);
    const allEmpty = rowSlice.every((c) => c.value === 0 || c.matched);
    if (allEmpty) { targetRow = r; break; }
  }
  if (targetRow === -1) {
    // shift everything up by one
    for (let r = 0; r < level.rows - 1; r++) {
      for (let c = 0; c < cols; c++) {
        const from = (r + 1) * cols + c;
        const to = r * cols + c;
        const cell = newGrid[from];
        newGrid[to] = { ...cell, row: r, col: c };
      }
    }
    // clear last row
    const lastR = level.rows - 1;
    for (let c = 0; c < cols; c++) {
      const idx = lastR * cols + c;
      newGrid[idx] = { ...newGrid[idx], row: lastR, col: c, value: 0, matched: false };
    }
    targetRow = level.rows - 1;
  }

  for (let c = 0; c < level.cols; c++) {
    const v = pool.shift();
    if (v == null) break;
    const idx = targetRow * cols + c;
    newGrid[idx] = { ...newGrid[idx], value: v, matched: false };
  }
  return { grid: newGrid, pool };
}

export function remainingUnmatched(grid: Cell[]) {
  return grid.filter((c) => c.value !== 0 && !c.matched).length;
}