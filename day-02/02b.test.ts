import { assertEquals } from "jsr:@std/assert";
import countSafeReportsWithDampener from "./02b.ts";

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
      console.warn(`Warning: Could not remove mock file: ${file} - ${error.message}`);
    }
  });
  mockFiles.length = 0;
}

Deno.test("countSafeReportsWithDampener - example input", async () => {
  const input = `7 6 4 2 1\n1 2 7 8 9\n9 7 6 2 1\n1 3 2 4 5\n8 6 4 4 1\n1 3 6 7 9`;
  const mockPath = mockFile(input);
  try {
    const result = await countSafeReportsWithDampener(mockPath);
    assertEquals(result, 4, "The count of safe reports should match the example.");
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("countSafeReportsWithDampener - all safe", async () => {
  const input = `1 2 3\n3 2 1\n5 4 3 2 1`;
  const mockPath = mockFile(input);
  try {
    const result = await countSafeReportsWithDampener(mockPath);
    assertEquals(result, 3, "All reports should be safe without dampener.");
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("countSafeReportsWithDampener - mixed safe and unsafe", async () => {
  const input = `1 3 6\n4 4\n5 4 3 2 1\n2 3 6 7`;
  const mockPath = mockFile(input);
  try {
    const result = await countSafeReportsWithDampener(mockPath);
    assertEquals(result, 3, "The count of safe reports should include fixable ones.");
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("countSafeReportsWithDampener - empty file", async () => {
  const input = ``;
  const mockPath = mockFile(input);
  try {
    const result = await countSafeReportsWithDampener(mockPath);
    assertEquals(result, 0, "An empty file should have no safe reports.");
  } finally {
    cleanupMockFiles();
  }
});