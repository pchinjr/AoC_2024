import { assertEquals } from "jsr:@std/assert";
import calculateSimilarityScore from "../day-01/01b.ts";

const mockFiles: string[] = [];

// Helper to create a mock file and register it for cleanup
function mockFile(content: string): string {
  const tempFileName = `./mock_${crypto.randomUUID()}.txt`;
  Deno.writeTextFileSync(tempFileName, content);
  mockFiles.push(tempFileName); // Register the file for cleanup
  return tempFileName;
}

// Cleanup function to delete all mock files
function cleanupMockFiles() {
  mockFiles.forEach((file) => {
    try {
      if (Deno.statSync(file).isFile) {
        Deno.removeSync(file);
      }
    } catch (err) {
      const error = err as Error; // Explicitly cast error to Error
      console.warn(
        `Warning: Could not remove mock file: ${file} - ${error.message}`,
      );
    }
  });
  mockFiles.length = 0; // Clear the mock files registry
}

Deno.test("calculateSimilarityScore - example lists", async () => {
  const input = `3 4\n4 3\n2 5\n1 3\n3 9\n3 3`;
  const mockPath = mockFile(input);
  try {
    const result = await calculateSimilarityScore(mockPath);
    assertEquals(result, 31, "The similarity score should match the example.");
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("calculateSimilarityScore - no matches", async () => {
  const input = `1 10\n2 20\n3 30`;
  const mockPath = mockFile(input);
  try {
    const result = await calculateSimilarityScore(mockPath);
    assertEquals(
      result,
      0,
      "The similarity score should be 0 if there are no matches.",
    );
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("calculateSimilarityScore - all matches", async () => {
  const input = `1 1\n2 2\n3 3\n1 1\n2 2`;
  const mockPath = mockFile(input);
  try {
    const result = await calculateSimilarityScore(mockPath);
    assertEquals(
      result,
      15,
      "The similarity score should account for all matches.",
    );
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("calculateSimilarityScore - empty lists", async () => {
  const input = ``;
  const mockPath = mockFile(input);
  try {
    const result = await calculateSimilarityScore(mockPath);
    assertEquals(
      result,
      0,
      "The similarity score should be 0 for empty lists.",
    );
  } finally {
    cleanupMockFiles();
  }
});
