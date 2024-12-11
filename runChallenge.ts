// runChallenge.ts
async function runChallenge(day: string, part: string) {
    const solutionPath = `./day-${day.padStart(2, "0")}/${day.padStart(2, "0")}${part}.ts`;
    const inputPath = `./day-${day.padStart(2, "0")}/input.txt`;

    try {
        const solveChallenge = (await import(solutionPath)).default;
        const result = await solveChallenge(inputPath);
        console.log(`Result for Day ${day} Part ${part.toUpperCase()}:`, result);
    } catch (error) {
        console.error(`Error running Day ${day} Part ${part.toUpperCase()}:`, error.message);
    }
}

const [day, part] = Deno.args;
if (!day || !part) {
    console.error("Usage: deno run --allow-read runChallenge.ts [day] [part]");
    Deno.exit(1);
}

await runChallenge(day, part);
