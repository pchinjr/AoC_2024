type GridCell = {
  visitCount: number;
  isBlocking: boolean;
};

type Point = { x: number; y: number };

type Grid = {
  width: number;
  height: number;
  cells: GridCell[][];
};

class Guard {
  x: number;
  y: number;
  dx: number;
  dy: number;
  grid: Grid;
  spawn: Point;
  uniqueVisits: number;
  isLooping: boolean;

  constructor(grid: Grid, spawn: Point) {
    this.grid = JSON.parse(JSON.stringify(grid)); // Deep copy grid
    this.spawn = { ...spawn };
    this.x = spawn.x;
    this.y = spawn.y;
    this.dx = 0;
    this.dy = -1; // Facing Up initially
    this.uniqueVisits = 1;
    this.isLooping = false;

    this.grid.cells[this.y][this.x].visitCount = 1;
  }

  move(): boolean {
    for (let i = 0; i < 4; i++) {
      const next = { x: this.x + this.dx, y: this.y + this.dy };

      if (!this.inBounds(next)) return false;

      const cell = this.grid.cells[next.y][next.x];
      if (cell.isBlocking) {
        // Turn right
        [this.dx, this.dy] = [-this.dy, this.dx];
        continue;
      }

      cell.visitCount += 1;

      if (cell.visitCount === 1) {
        this.uniqueVisits += 1;
      } else if (cell.visitCount > 4) {
        this.isLooping = true;
      }

      this.x = next.x;
      this.y = next.y;

      return true;
    }

    throw new Error("Guard cannot move in any direction!");
  }

  inBounds(p: Point): boolean {
    return p.x >= 0 && p.x < this.grid.width && p.y >= 0 &&
      p.y < this.grid.height;
  }

  willLoop(): boolean {
    while (true) {
      if (!this.move()) return false;
      if (this.isLooping) return true;
    }
  }

  allMoves(): Point[] {
    const moves: Point[] = [];
    const copy = new Guard(this.grid, this.spawn);

    while (copy.move()) {
      moves.push({ x: copy.x, y: copy.y });
    }

    return moves;
  }
}

function parseInput(input: string): { grid: Grid; spawn: Point } {
  const lines = input.trim().split("\n");
  const height = lines.length;
  const width = lines[0].length;

  const grid: Grid = {
    width,
    height,
    cells: Array.from(
      { length: height },
      () =>
        Array.from(
          { length: width },
          () => ({ visitCount: 0, isBlocking: false }),
        ),
    ),
  };

  let spawn: Point = { x: 0, y: 0 };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = lines[y][x];
      grid.cells[y][x].isBlocking = cell === "#";

      if (cell === "^") {
        spawn = { x, y };
      }
    }
  }

  return { grid, spawn };
}

export default async function solveChallenge(
  filePath: string,
): Promise<number> {
  const input = await Deno.readTextFile(filePath);
  const { grid, spawn } = parseInput(input);

  const guard = new Guard(grid, spawn);
  const moves = guard.allMoves();

  let loopCount = 0;
  const seen = new Set<string>();

  for (const move of moves) {
    const key = `${move.x},${move.y}`;
    if (seen.has(key) || (move.x === spawn.x && move.y === spawn.y)) continue;

    seen.add(key);

    const testGuard = new Guard(grid, spawn);
    testGuard.grid.cells[move.y][move.x].isBlocking = true;

    if (testGuard.willLoop()) {
      loopCount++;
    }
  }

  return loopCount;
}
