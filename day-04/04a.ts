async function countOccurrencesOfXMAS(filePath: string): Promise<number> {
  const input = await Deno.readTextFile(filePath);
  const grid = input.trim().split("\n").map((line) => line.split(""));

  const directions = [
    { dx: 1, dy: 0 }, // Horizontal right
    { dx: -1, dy: 0 }, // Horizontal left
    { dx: 0, dy: 1 }, // Vertical down
    { dx: 0, dy: -1 }, // Vertical up
    { dx: 1, dy: 1 }, // Diagonal down-right
    { dx: -1, dy: -1 }, // Diagonal up-left
    { dx: 1, dy: -1 }, // Diagonal up-right
    { dx: -1, dy: 1 }, // Diagonal down-left
  ];

  const word = "XMAS";
  const wordLength = word.length;
  let count = 0;

  function isValid(x: number, y: number): boolean {
    return x >= 0 && x < grid.length && y >= 0 && y < grid[0].length;
  }

  function search(
    x: number,
    y: number,
    direction: { dx: number; dy: number },
  ): boolean {
    for (let i = 0; i < wordLength; i++) {
      const nx = x + i * direction.dx;
      const ny = y + i * direction.dy;
      if (!isValid(nx, ny) || grid[nx][ny] !== word[i]) {
        return false;
      }
    }
    return true;
  }

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if (grid[x][y] === "X") { // Starting letter of "XMAS"
        for (const direction of directions) {
          if (search(x, y, direction)) {
            count++;
          }
        }
      }
    }
  }

  return count;
}

export default countOccurrencesOfXMAS;
