import { assertEquals } from "jsr:@std/assert";
import countOccurrencesOfXMAS from "./04a.ts";

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

Deno.test("countOccurrencesOfXMAS - example input", async () => {
  const input =
    `MMMSXXMASM\nMSAMXMSMSA\nAMXSXMAAMM\nMSAMASMSMX\nXMASAMXAMM\nXXAMMXXAMA\nSMSMSASXSS\nSAXAMASAAA\nMAMMMXMMMM\nMXMXAXMASX`;
  const mockPath = mockFile(input);
  try {
    const result = await countOccurrencesOfXMAS(mockPath);
    assertEquals(
      result,
      18,
      "The number of XMAS occurrences should match the example.",
    );
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("countOccurrencesOfXMAS - single occurrence", async () => {
  const input = `XMAS`;
  const mockPath = mockFile(input);
  try {
    const result = await countOccurrencesOfXMAS(mockPath);
    assertEquals(result, 1, "There should be one occurrence of XMAS.");
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("countOccurrencesOfXMAS - no occurrences", async () => {
  const input = `ABCD\nEFGH\nIJKL\nMNOP`;
  const mockPath = mockFile(input);
  try {
    const result = await countOccurrencesOfXMAS(mockPath);
    assertEquals(result, 0, "There should be no occurrences of XMAS.");
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("countOccurrencesOfXMAS - overlapping occurrences", async () => {
  const input = `XMASXMAS`;
  const mockPath = mockFile(input);
  try {
    const result = await countOccurrencesOfXMAS(mockPath);
    assertEquals(
      result,
      2,
      "There should be two overlapping occurrences of XMAS.",
    );
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("countOccurrencesOfXMAS - diagonal occurrences", async () => {
  const input =
    `X.......\n.M.....\n..A....\n...S...\n....X..\n.....M.\n......A\n.......S`;
  const mockPath = mockFile(input);
  try {
    const result = await countOccurrencesOfXMAS(mockPath);
    assertEquals(
      result,
      2,
      "There should be two diagonal occurrences of XMAS.",
    );
  } finally {
    cleanupMockFiles();
  }
});
