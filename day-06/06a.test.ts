import { assertEquals } from "jsr:@std/assert";
import solveChallenge from "./06a.ts";

// Helper function to create and clean up a temporary input file
async function createTempFile(content: string): Promise<string> {
  const tempFile = await Deno.makeTempFile();
  await Deno.writeTextFile(tempFile, content);
  return tempFile;
}

Deno.test("solveChallenge - example input", async () => {
  const input = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
  `.trim();

  const filePath = await createTempFile(input);
  const result = await solveChallenge(filePath);
  await Deno.remove(filePath);

  assertEquals(result, 41);
});

Deno.test("solveChallenge - minimal input where guard exits immediately", async () => {
  const input = `
^
  `.trim();

  const filePath = await createTempFile(input);
  const result = await solveChallenge(filePath);
  await Deno.remove(filePath);

  assertEquals(result, 1);
});
