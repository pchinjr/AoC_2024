import { assertEquals } from "jsr:@std/assert";
import solveChallenge from "./07b.ts";

Deno.test("solveChallenge - part 2 example input", async () => {
  const input = `
    190: 10 19
    3267: 81 40 27
    83: 17 5
    156: 15 6
    7290: 6 8 6 15
    161011: 16 10 13
    192: 17 8 14
    21037: 9 7 18 13
    292: 11 6 16 20
  `;

  const tempFile = await Deno.makeTempFile();
  await Deno.writeTextFile(tempFile, input.trim());

  const result = await solveChallenge(tempFile);
  assertEquals(result, 11387); // Expected result
});
