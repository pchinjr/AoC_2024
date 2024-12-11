async function countSafeReportsWithDampener(filePath: string): Promise<number> {
    const input = await Deno.readTextFile(filePath);
    const lines = input.trim().split("\n");
  
    let safeReports = 0;
  
    for (const line of lines) {
      const levels = line.split(/\s+/).map(Number);
  
      if (isSafeReport(levels) || canBeMadeSafe(levels)) {
        safeReports++;
      }
    }
  
    return safeReports;
  }
  
  function isSafeReport(levels: number[]): boolean {
    if (levels.length < 2) return false;
  
    const differences = [];
    for (let i = 1; i < levels.length; i++) {
      const diff = levels[i] - levels[i - 1];
      if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
        return false; // Adjacent levels differ by less than 1 or more than 3
      }
      differences.push(diff);
    }
  
    // Check if all differences are increasing or all decreasing
    const allIncreasing = differences.every((d) => d > 0);
    const allDecreasing = differences.every((d) => d < 0);
  
    return allIncreasing || allDecreasing;
  }
  
  function canBeMadeSafe(levels: number[]): boolean {
    for (let i = 0; i < levels.length; i++) {
      const modifiedLevels = levels.slice(0, i).concat(levels.slice(i + 1));
      if (isSafeReport(modifiedLevels)) {
        return true;
      }
    }
  
    return false;
  }
  
  export default countSafeReportsWithDampener;  