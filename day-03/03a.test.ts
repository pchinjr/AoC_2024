import { assertEquals } from "jsr:@std/assert";
import sumValidMultiplications from "./03a.ts";

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

Deno.test("sumValidMultiplications - example input", async () => {
  const input =
    `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;
  const mockPath = mockFile(input);
  try {
    const result = await sumValidMultiplications(mockPath);
    assertEquals(
      result,
      161,
      "The sum of valid multiplications should match the example.",
    );
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("sumValidMultiplications - no valid instructions", async () => {
  const input = `random text with no valid instructions`;
  const mockPath = mockFile(input);
  try {
    const result = await sumValidMultiplications(mockPath);
    assertEquals(
      result,
      0,
      "The sum should be 0 when there are no valid instructions.",
    );
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("sumValidMultiplications - all valid instructions", async () => {
  const input = `mul(1,2) mul(3,4) mul(5,6)`;
  const mockPath = mockFile(input);
  try {
    const result = await sumValidMultiplications(mockPath);
    assertEquals(
      result,
      44,
      "The sum should be the total of all valid multiplications.",
    );
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("sumValidMultiplications - empty input", async () => {
  const input = ``;
  const mockPath = mockFile(input);
  try {
    const result = await sumValidMultiplications(mockPath);
    assertEquals(result, 0, "The sum should be 0 for empty input.");
  } finally {
    cleanupMockFiles();
  }
});
