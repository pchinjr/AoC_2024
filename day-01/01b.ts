async function calculateSimilarityScore(filePath: string): Promise<number> {
  const input = await Deno.readTextFile(filePath);

  // Parse input into left and right lists
  const lines = input.trim().split("\n");
  const left: number[] = [];
  const right: number[] = [];

  for (const line of lines) {
    const [leftValue, rightValue] = line.split(/\s+/).map(Number);
    left.push(leftValue);
    right.push(rightValue);
  }

  console.log("Raw Left List:", left);
  console.log("Raw Right List:", right);

  // Count occurrences in the right list
  const rightCounts = right.reduce<Record<number, number>>((counts, value) => {
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});

  console.log("Right List Counts:", rightCounts);

  // Calculate similarity score
  const similarityScore = left.reduce((score, value) => {
    const occurrences = rightCounts[value] || 0;
    const increment = value * occurrences;
    console.log(
      `Value: ${value}, Occurrences in Right List: ${occurrences}, Increment: ${increment}`,
    );
    return score + increment;
  }, 0);

  console.log("Final Similarity Score:", similarityScore);
  return similarityScore;
}

export default calculateSimilarityScore;
