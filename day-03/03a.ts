async function sumValidMultiplications(filePath: string): Promise<number> {
  const input = await Deno.readTextFile(filePath);

  // Match valid "mul(X,Y)" patterns using regex
  const regex = /mul\((\d{1,3}),(\d{1,3})\)/g;
  let match;
  let total = 0;

  while ((match = regex.exec(input)) !== null) {
    const x = parseInt(match[1], 10);
    const y = parseInt(match[2], 10);
    total += x * y;
    console.log(`Found valid instruction: mul(${x},${y}) = ${x * y}`);
  }

  console.log(`Total Sum: ${total}`);
  return total;
}

export default sumValidMultiplications;
