import { assertEquals } from "jsr:@std/assert";
import solveChallenge from "./04b.ts";

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
  const input = `XMXSXXXXXX
XXAXXMSMSX
XMXSXMAAXX
XXAXASMSMX
XMXSXMXXXX
XXXXXXXXXX
SMSMSMSMSX
XAXAXAXAXX
MXMXMXMXMX
XXXXXXXXXX`;
  const mockPath = mockFile(input);
  try {
    const result = await solveChallenge(mockPath);
    assertEquals(
      result,
      9, // Update this to the correct number if 9 is wrong after testing
      "The number of X-MAS occurrences should match the example.",
    );
  } finally {
    cleanupMockFiles();
  }
});

Deno.test("solveChallenge - no patterns", async () => {
  const input = `SSSSSSSSSS
SSSSSSSSSS
SSSSSSSSSS
SSSSSSSSSS
SSSSSSSSSS
SSSSSSSSSS
SSSSSSSSSS
SSSSSSSSSS
SSSSSSSSSS
SSSSSSSSSS`;
  const mockPath = mockFile(input);
  try {
    const result = await solveChallenge(mockPath);
    assertEquals(result, 0, "There should be no X-MAS patterns.");
  } finally {
    cleanupMockFiles();
  }
});
