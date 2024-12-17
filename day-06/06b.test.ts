import { assertEquals } from "jsr:@std/assert";
import solveChallenge from "./06b.ts";

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

  const tempFile = await Deno.makeTempFile();
  await Deno.writeTextFile(tempFile, input);
  const result = await solveChallenge(tempFile);
  await Deno.remove(tempFile);

  assertEquals(result, 6);
});
