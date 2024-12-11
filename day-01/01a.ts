async function calculateTotalDistance(filePath: string): Promise<number> {
    const input = await Deno.readTextFile(filePath);
  
    // Parse input into left and right lists
    const lines = input.trim().split("\n");
    const left: number[] = [];
    const right: number[] = [];
  
    for (const line of lines) {
      const [leftValue, rightValue] = line.split(/\s+/).map(Number);
      left.push(leftValue);
      right.push(rightValue);
    }
  
    console.log("Raw Left List:", left);
    console.log("Raw Right List:", right);
  
    left.sort((a, b) => a - b);
    right.sort((a, b) => a - b);
  
    console.log("Sorted Left List:", left);
    console.log("Sorted Right List:", right);
  
    const totalDistance = left.reduce((total, value, index) => {
      const distance = Math.abs(value - right[index]);
      console.log(`Pair: (${value}, ${right[index]}), Distance: ${distance}`);
      return total + distance;
    }, 0);
  
    console.log("Total Distance:", totalDistance);
    return totalDistance;
  }
  
  export default calculateTotalDistance;
  