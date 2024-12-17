async function solveChallenge(filePath: string): Promise<number> {
  const input = await Deno.readTextFile(filePath);
  const grid = input.trim().split("\n").map((line) => line.split(""));

  const directions = [
    [-1, 0], // Up (North)
    [0, 1], // Right (East)
    [1, 0], // Down (South)
    [0, -1], // Left (West)
  ];

  const directionMap: Record<string, number> = {
    "^": 0, // Facing Up
    ">": 1, // Facing Right
    "v": 2, // Facing Down
    "<": 3, // Facing Left
  };

  let startX = -1, startY = -1, currentDir = -1;

  // Find the guard's starting position and direction
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const cell = grid[i][j];
      if (cell in directionMap) {
        startX = i;
        startY = j;
        currentDir = directionMap[cell];
        grid[i][j] = "."; // Replace guard symbol with empty space
        break;
      }
    }
    if (startX !== -1) break;
  }

  // Track visited positions
  const visited = new Set<string>();
  let [x, y] = [startX, startY];
  visited.add(`${x},${y}`);

  while (true) {
    const [dx, dy] = directions[currentDir];
    const [nextX, nextY] = [x + dx, y + dy];

    // Check if next position is within bounds
    if (
      nextX >= 0 && nextX < grid.length &&
      nextY >= 0 && nextY < grid[0].length &&
      grid[nextX][nextY] === "."
    ) {
      // Move forward
      x = nextX;
      y = nextY;
      visited.add(`${x},${y}`);
    } else {
      // Turn right 90 degrees
      currentDir = (currentDir + 1) % 4;
    }

    // Exit when out of bounds
    if (
      nextX < 0 || nextX >= grid.length || nextY < 0 || nextY >= grid[0].length
    ) {
      break;
    }
  }

  return visited.size;
}

export default solveChallenge;
