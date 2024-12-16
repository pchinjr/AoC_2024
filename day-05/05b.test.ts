import { assertEquals } from "jsr:@std/assert";
import solveChallenge from "./05b.ts";

const mockFiles: string[] = [];

function mockFile(content: string): string {
  const tempFileName = `./mock_${crypto.randomUUID()}.txt`;
  Deno.writeTextFileSync(tempFileName, content);
  mockFiles.push(tempFileName);
  return tempFileName;
}

function cleanupMockFiles() {
  mockFiles.forEach((file) => {
    try {
      if (Deno.statSync(file).isFile) {
        Deno.removeSync(file);
      }
    } catch (err) {
      const error = err as Error;
      console.warn(
        `Warning: Could not remove mock file: ${file} - ${error.message}`,
      );
    }
  });
  mockFiles.length = 0;
}

Deno.test("solveChallenge - example input", async () => {
  const input = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

  const mockPath = mockFile(input);
  try {
    const result = await solveChallenge(mockPath);
    assertEquals(
      result,
      123,
      "The sum of middle page numbers of corrected updates should be 123.",
    );
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("solveChallenge - no invalid updates", async () => {
  const input = `1|2
2|3

1,2,3
2,3
3`;

  const mockPath = mockFile(input);
  try {
    const result = await solveChallenge(mockPath);
    assertEquals(result, 0, "There should be no invalid updates to correct.");
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("solveChallenge - single invalid update", async () => {
  const input = `1|2
2|3

3,2,1`;

  const mockPath = mockFile(input);
  try {
    const result = await solveChallenge(mockPath);
    assertEquals(result, 2, "The sum of middle page numbers should be 2.");
  } finally {
    cleanupMockFiles();
  }
});
