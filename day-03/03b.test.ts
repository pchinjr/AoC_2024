import { assertEquals } from "jsr:@std/assert";
import sumValidMultiplicationsWithConditions from "./03b.ts";

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

Deno.test("sumValidMultiplicationsWithConditions - example input", async () => {
  const input =
    `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;
  const mockPath = mockFile(input);
  try {
    const result = await sumValidMultiplicationsWithConditions(mockPath);
    assertEquals(
      result,
      48,
      "The sum of valid multiplications with conditions should match the example.",
    );
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("sumValidMultiplicationsWithConditions - all enabled", async () => {
  const input = `mul(1,2)mul(3,4)do()mul(5,6)`;
  const mockPath = mockFile(input);
  try {
    const result = await sumValidMultiplicationsWithConditions(mockPath);
    assertEquals(
      result,
      44,
      "All valid multiplications should be included when enabled.",
    );
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("sumValidMultiplicationsWithConditions - all disabled", async () => {
  const input = `don't()mul(1,2)mul(3,4)mul(5,6)`;
  const mockPath = mockFile(input);
  try {
    const result = await sumValidMultiplicationsWithConditions(mockPath);
    assertEquals(
      result,
      0,
      "No valid multiplications should be included when all are disabled.",
    );
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("sumValidMultiplicationsWithConditions - mixed conditions", async () => {
  const input = `mul(1,2)don't()mul(3,4)do()mul(5,6)`;
  const mockPath = mockFile(input);
  try {
    const result = await sumValidMultiplicationsWithConditions(mockPath);
    assertEquals(
      result,
      32,
      "The sum should include only enabled multiplications.",
    );
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("sumValidMultiplicationsWithConditions - empty input", async () => {
  const input = ``;
  const mockPath = mockFile(input);
  try {
    const result = await sumValidMultiplicationsWithConditions(mockPath);
    assertEquals(result, 0, "The sum should be 0 for empty input.");
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("sumValidMultiplicationsWithConditions - consecutive conditions", async () => {
  const input = `do()don't()do()mul(2,3)don't()mul(5,6)`;
  const mockPath = mockFile(input);
  try {
    const result = await sumValidMultiplicationsWithConditions(mockPath);
    assertEquals(
      result,
      6,
      "Only the last enabled mul instruction should be included.",
    );
  } finally {
    cleanupMockFiles();
  }
});
