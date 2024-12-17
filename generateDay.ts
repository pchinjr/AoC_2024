// generateDay.ts
import { ensureDir } from "https://deno.land/std@0.203.0/fs/ensure_dir.ts";

async function generateDay(day: string) {
  // Ensure day number is valid
  if (!/^\d+$/.test(day) || Number(day) < 1 || Number(day) > 31) {
    console.error("Invalid day number. Please provide a valid number (1-31).");
    Deno.exit(1);
  }

  // Format the day number as two digits
  const dayPadded = day.padStart(2, "0");

  // Create the folder for the day
  const folderName = `day-${dayPadded}`;
  await ensureDir(folderName);
  console.log(`Created folder: ${folderName}`);

  // Define the files to be created
  const files = [
    `${folderName}/${dayPadded}a.ts`,
    `${folderName}/${dayPadded}b.ts`,
    `${folderName}/${dayPadded}a.test.ts`,
    `${folderName}/${dayPadded}b.test.ts`,
  ];

  // Touch each file
  for (const file of files) {
    await Deno.writeTextFile(file, "");
    console.log(`Created file: ${file}`);
  }
}

// Get the day number from the command-line arguments
const args = Deno.args;
if (args.length !== 1) {
  console.error(
    "Usage: deno run --allow-write --allow-read generateDay.ts <day>",
  );
  Deno.exit(1);
}

await generateDay(args[0]);
