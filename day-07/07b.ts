export default async function solveChallenge(filePath: string): Promise<number> {
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
  
    // Generate all combinations of '+', '*', and '||'
    const totalCombinations = 3 ** operatorCount; // 3^(n-1) combinations
  
    for (let mask = 0; mask < totalCombinations; mask++) {
      if (evaluateExpression(numbers, mask, operatorCount) === target) {
        return true;
      }
    }
  
    return false;
  }
  
  // Evaluate the expression left-to-right with a given combination of operators
  function evaluateExpression(numbers: number[], operatorMask: number, operatorCount: number): number {
    let result = numbers[0];
    let currentIndex = 0;
  
    for (let i = 0; i < operatorCount; i++) {
      const operator = getOperator(operatorMask, i);
      const nextNumber = numbers[i + 1];
  
      if (operator === "||") {
        result = concatenateNumbers(result, nextNumber);
      } else if (operator === "+") {
        result += nextNumber;
      } else if (operator === "*") {
        result *= nextNumber;
      }
    }
  
    return result;
  }
  
  // Function to retrieve the operator based on the mask
  function getOperator(mask: number, position: number): string {
    const operatorIndex = Math.floor(mask / 3 ** position) % 3;
    return operatorIndex === 0 ? "+" : operatorIndex === 1 ? "*" : "||";
  }
  
  // Function to concatenate two numbers
  function concatenateNumbers(a: number, b: number): number {
    return Number(`${a}${b}`);
  }
  