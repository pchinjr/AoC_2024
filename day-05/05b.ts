async function solveChallenge(filePath: string): Promise<number> {
  const input = await Deno.readTextFile(filePath);
  const [rulesSection, updatesSection] = input.trim().split("\n\n");

  // Parse the rules into a directed graph
  const graph: Record<number, Set<number>> = {};
  const inDegree: Record<number, number> = {};

  rulesSection.split("\n").forEach((rule) => {
    const [from, to] = rule.split("|").map(Number);
    if (!graph[from]) graph[from] = new Set();
    graph[from].add(to);
    inDegree[to] = (inDegree[to] || 0) + 1;
    if (!(from in inDegree)) inDegree[from] = 0;
  });

  console.debug("Global Graph:", graph);

  const updates = updatesSection.split("\n").map((line) => line.split(",").map(Number));

  let sumOfMiddlePages = 0;

  // Function to validate an update
  function isValidUpdate(update: number[]): boolean {
    const position = new Map<number, number>();
    update.forEach((page, index) => position.set(page, index));

    for (const from of update) {
      for (const to of graph[from] || []) {
        if (position.has(from) && position.has(to)) {
          if (position.get(from)! > position.get(to)!) {
            return false;
          }
        }
      }
    }

    return true;
  }

  // Function to perform topological sort
  function topologicalSort(update: number[]): number[] {
    const localInDegree = { ...inDegree };
    const localGraph: Record<number, Set<number>> = {};
    const relevant = new Set(update);

    // Build a local graph for the update
    for (const node of relevant) {
      localGraph[node] = new Set(
        [...(graph[node] || [])].filter((neighbor) => relevant.has(neighbor))
      );
    }

    console.debug("Local Graph for update", update, ":", localGraph);

    // Initialize local in-degree for relevant nodes
    for (const node of relevant) {
      localInDegree[node] = 0;
    }
    for (const [node, neighbors] of Object.entries(localGraph)) {
      for (const neighbor of neighbors) {
        localInDegree[neighbor]++;
      }
    }

    console.debug("Local In-Degree Map for update", update, ":", localInDegree);

    const queue: number[] = [];
    const sorted: number[] = [];

    for (const node of relevant) {
      if (localInDegree[node] === 0) queue.push(node);
    }

    console.debug("Initial queue for update", update, ":", queue);

    while (queue.length > 0) {
      const current = queue.shift()!;
      sorted.push(current);

      for (const neighbor of localGraph[current] || []) {
        localInDegree[neighbor]--;
        if (localInDegree[neighbor] === 0) queue.push(neighbor);
      }
    }

    console.debug("Sorted update:", sorted);

    return sorted.length === update.length ? sorted : [];
  }

  // Function to determine the middle page of a sorted update
  function findMiddle(sortedUpdate: number[]): number {
    const middle = sortedUpdate[Math.floor((sortedUpdate.length - 1) / 2)];
    console.debug("Middle page of sorted update:", middle);
    return middle;
  }

  // Process each update
  updates.forEach((update) => {
    if (!isValidUpdate(update)) {
      // Only process invalid updates
      const correctedUpdate = topologicalSort(update);
      if (correctedUpdate.length > 0) {
        sumOfMiddlePages += findMiddle(correctedUpdate);
      }
    }
  });

  console.debug("Final total:", sumOfMiddlePages);
  return sumOfMiddlePages;
}

export default solveChallenge;
