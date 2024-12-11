async function sumValidMultiplicationsWithConditions(
  filePath: string,
): Promise<number> {
  const input = await Deno.readTextFile(filePath);

  // Regex to match valid instructions and conditions
  const instructionRegex = /(do\(\)|don\'t\(\)|mul\(\d{1,3},\d{1,3}\))/g;

  let total = 0;
  let isEnabled = true; // Multiplications are enabled by default

  // Find all matching instructions
  const matches = input.match(instructionRegex) || [];
  for (const match of matches) {
    console.log(`Processing token: "${match}"`);

    // Handle conditions
    if (match === "do()") {
      isEnabled = true;
      console.log(`Condition found: do(), isEnabled: ${isEnabled}`);
      continue;
    }
    if (match === "don't()") {
      isEnabled = false;
      console.log(`Condition found: don't(), isEnabled: ${isEnabled}`);
      continue;
    }

    // Handle valid mul instructions
    const mulMatch = /mul\((\d{1,3}),(\d{1,3})\)/.exec(match);
    if (mulMatch && isEnabled) {
      const x = parseInt(mulMatch[1], 10);
      const y = parseInt(mulMatch[2], 10);
      const product = x * y;
      total += product;
      console.log(`Enabled: mul(${x},${y}) = ${product}`);
    } else if (mulMatch) {
      console.log(`Disabled: ${match}`);
    }
  }

  console.log(`Total Sum: ${total}`);
  return total;
}

export default sumValidMultiplicationsWithConditions;
