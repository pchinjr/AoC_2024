async function solveChallenge(filePath: string): Promise<number> {
  const input = await Deno.readTextFile(filePath);

  // Split the input into rows based on newlines
  const grid = input.trim().split("\n").map((row) => row.split(""));
  const rows = grid.length;
  const cols = grid[0].length;

  console.debug("Constructed grid:", grid);

  // Check if a position is within bounds
  function isValid(x: number, y: number): boolean {
    return x >= 0 && x < rows && y >= 0 && y < cols;
  }

  // Extract letters along a diagonal or straight line
  function getLetters(
    x: number,
    y: number,
    dx: number,
    dy: number,
    length: number,
  ): string {
    let result = "";
    for (let i = 0; i < length; i++) {
      const nx = x + i * dx;
      const ny = y + i * dy;
      if (!isValid(nx, ny)) return ""; // Stop early if out of bounds
      result += grid[nx][ny];
    }
    console.debug(
      `Diagonal from (x=${x}, y=${y}) with dx=${dx}, dy=${dy}: ${result}`,
    );
    return result;
  }

  // Check if the given center forms a valid X-MAS pattern
  function isCrossShape(x: number, y: number): boolean {
    const mas = "MAS";
    const sam = "SAM";

    // Check diagonals from center
    const diag1 = getLetters(x - 1, y - 1, 1, 1, 3); // Top-left to bottom-right
    const diag2 = getLetters(x - 1, y + 1, 1, -1, 3); // Top-right to bottom-left

    console.debug(
      `Checking diagonals at (x=${x}, y=${y}): diag1=${diag1}, diag2=${diag2}`,
    );
    return (
      (diag1 === mas || diag1 === sam) &&
      (diag2 === mas || diag2 === sam)
    );
  }

  let count = 0;

  // Iterate over each position in the grid
  for (let x = 1; x < rows - 1; x++) { // Ensure center of X-MAS has room for diagonals
    for (let y = 1; y < cols - 1; y++) {
      if (grid[x][y] === "A" && isCrossShape(x, y)) {
        console.debug(`X-MAS found at center (x=${x}, y=${y})`);
        count++;
      }
    }
  }

  console.debug("Total X-MAS patterns found:", count);
  return count;
}

export default solveChallenge;
