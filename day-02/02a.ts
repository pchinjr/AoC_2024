async function countSafeReports(filePath: string): Promise<number> {
  const input = await Deno.readTextFile(filePath);
  const lines = input.trim().split("\n");

  let safeReports = 0;

  for (const line of lines) {
    const levels = line.split(/\s+/).map(Number);
    console.log(`Checking report: ${levels}`);

    if (isSafeReport(levels)) {
      console.log("Safe");
      safeReports++;
    } else {
      console.log("Unsafe");
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
      console.log(
        `Failed difference rule: ${levels[i - 1]} -> ${
          levels[i]
        } (diff: ${diff})`,
      );
      return false; // Adjacent levels differ by less than 1 or more than 3
    }
    differences.push(diff);
  }

  console.log(`Differences: ${differences}`);

  // Check if all differences are increasing or all decreasing
  const allIncreasing = differences.every((d) => d > 0);
  const allDecreasing = differences.every((d) => d < 0);

  if (!allIncreasing && !allDecreasing) {
    console.log(
      "Failed consistency rule: Differences are neither all increasing nor all decreasing",
    );
    return false;
  }

  return true;
}

export default countSafeReports;
