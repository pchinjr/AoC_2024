// Import the function to test
import { assertEquals } from "jsr:@std/assert";
import calculateTotalDistance from "../day-01/01a.ts";

const mockFiles: string[] = []; // Registry for tracking mock files

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

Deno.test("calculateTotalDistance - example lists", async () => {
  const input = `3 4
4 3
2 5
1 3
3 9
3 3`;
  const mockPath = mockFile(input);
  try {
    const result = await calculateTotalDistance(mockPath);
    assertEquals(
      result,
      11,
      "The calculated total distance should match the example.",
    );
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("calculateTotalDistance - identical lists", async () => {
  const input = `1 1
2 2
3 3`;
  const mockPath = mockFile(input);
  try {
    const result = await calculateTotalDistance(mockPath);
    assertEquals(
      result,
      0,
      "The calculated total distance should be 0 for identical lists.",
    );
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("calculateTotalDistance - different values", async () => {
  const input = `10 1
20 2
30 3`;
  const mockPath = mockFile(input);
  try {
    const result = await calculateTotalDistance(mockPath);
    assertEquals(
      result,
      54,
      "The calculated total distance should handle large differences correctly.",
    );
  } finally {
    cleanupMockFiles();
  }
});
