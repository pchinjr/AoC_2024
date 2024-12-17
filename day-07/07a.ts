export default async function solveChallenge(
  filePath: string,
): Promise<number> {
  const input = await Deno.readTextFile(filePath);

  // Parse input lines
  const lines = input.trim().split("\n");
  let totalSum = 0;

  for (const line of lines) {
    const [targetPart, numbersPart] = line.split(":");
    const targetValue = Number(targetPart.trim());
    const numbers = numbersPart.trim().split(" ").map(Number);

    // Check if any operator combination can evaluate to the target value
    if (canMatchTarget(numbers, targetValue)) {
      totalSum += targetValue;
    }
  }

  return totalSum;
}

// Function to check all operator combinations
function canMatchTarget(numbers: number[], target: number): boolean {
  const n = numbers.length;
  const operatorCount = n - 1;

  // Generate all combinations of '+' and '*'
  const totalCombinations = 1 << operatorCount; // 2^(n-1) combinations

  for (let mask = 0; mask < totalCombinations; mask++) {
    if (evaluateExpression(numbers, mask) === target) {
      return true;
    }
  }

  return false;
}

// Evaluate the expression left-to-right with a given combination of operators
function evaluateExpression(numbers: number[], operatorMask: number): number {
  let result = numbers[0];

  for (let i = 0; i < numbers.length - 1; i++) {
    const operator = (operatorMask & (1 << i)) ? "*" : "+";
    if (operator === "+") {
      result += numbers[i + 1];
    } else {
      result *= numbers[i + 1];
    }
  }

  return result;
}
