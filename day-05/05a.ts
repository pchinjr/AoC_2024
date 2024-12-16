async function solveChallenge(filePath: string): Promise<number> {
  const input = await Deno.readTextFile(filePath);

  const [rawRules, rawUpdates] = input.trim().split("\n\n");
  const rules = rawRules.split("\n").map((rule) => rule.split("|").map(Number));
  const updates = rawUpdates.split("\n").map((update) =>
    update.split(",").map(Number)
  );

  // Construct adjacency list for rules
  const graph: Record<number, Set<number>> = {};
  for (const [x, y] of rules) {
    if (!graph[x]) graph[x] = new Set();
    graph[x].add(y);
  }

  function isUpdateValid(update: number[]): boolean {
    // Construct a position map for quick lookup
    const position = new Map<number, number>();
    update.forEach((page, index) => position.set(page, index));

    for (const [x, y] of rules) {
      if (position.has(x) && position.has(y)) {
        // If both pages are in the update, check their order
        if (position.get(x)! > position.get(y)!) {
          return false;
        }
      }
    }
    return true;
  }

  function findMiddle(update: number[]): number {
    const middleIndex = Math.floor((update.length - 1) / 2);
    return update[middleIndex];
  }

  let total = 0;

  for (const update of updates) {
    if (isUpdateValid(update)) {
      total += findMiddle(update);
    }
  }

  return total;
}

export default solveChallenge;
