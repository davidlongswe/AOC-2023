const fs = require("fs");
const { Heap } = require("heap-js");

const G = fs
  .readFileSync("data.txt", "utf-8")
  .trim()
  .split(/\r?\n/)
  .map((line) => line.split("").map(Number));

const G_ROWS = G.length;
const G_COLS = G[0].length;

function isVisited(visited, { r, c, rDir, cDir, consecutive }) {
  // Generate a unique key based on the current position and direction
  // Use bitwise operators to allocate all of the difference values in a
  // 32-bit integer.
  const key =
    (r << 16) | (c << 8) | ((rDir & 3) << 6) | ((cDir & 3) << 4) | consecutive;

  // Check if the key exists in the set of visited positions.
  if (visited.has(key)) return true;

  // If consecutive steps are greater than or equal to the minimum steps,
  // add a range of keys to the visited set to represent the path taken.
  if (consecutive >= visited.minSteps) {
    for (let i = 0; i <= visited.maxSteps - consecutive; ++i) {
      visited.add(key + i);
    }
  } else {
    visited.add(key);
  }

  return false;
}

function move(positions, p, rDir, cDir, minSteps, maxSteps) {
  // Calculate the next position based on the current position and direction.
  const [nRow, nCol] = [p.r + rDir, p.c + cDir];
  const sDir = rDir === p.rDir && cDir === p.cDir;

  // Check if the next position is out of bounds
  if (nRow < 0 || nRow >= G_ROWS || nCol < 0 || nCol >= G_COLS) return;

  // Check if moving in the opposite direction
  if (rDir === -p.rDir && cDir === -p.cDir) return;

  // Check if consecutive steps are equal to the maximum steps and in the same direction,
  // or if consecutive steps are less than the minimum steps and not in the same direction and not starting position.
  // If so, return without updating the positions.
  if (p.consecutive === maxSteps && sDir) return;
  if (p.consecutive < minSteps && !sDir && !(p.r === 0 && p.c === 0)) return;

  // Push the new position to the positions array.
  positions.push({
    r: nRow,
    c: nCol,
    rDir,
    cDir,
    consecutive: sDir ? p.consecutive + 1 : 1,
    heat: p.heat + G[nRow][nCol],
  });
}

// Function to find the minimum heat loss using a modified Dijkstra's algorithm.
function minHeat(minSteps, maxSteps) {
  // Initialize a priority queue for positions based on heat value in ascending order.
  const positions = new Heap((a, b) => a.heat - b.heat);

  // Initialize a set to keep track of visited positions.
  const visited = new Set();
  visited.minSteps = minSteps;
  visited.maxSteps = maxSteps;

  // Push the starting position to the priority queue.
  positions.push({
    r: 0,
    c: 0,
    rDir: 0,
    cDir: 0,
    consecutive: 0,
    heat: 0,
  });

  // Process positions in the priority queue until it's empty.
  while (positions.length > 0) {
    // Pop the position with the minimum heat value.
    const p = positions.pop();

    // Check and skip if the position has been visited.
    if (isVisited(visited, p)) continue;

    // Check if the position is at the destination
    // Check for p2 that we've moved at least >= minSteps
    // Return the heat value.
    if (p.r === G_ROWS - 1 && p.c === G_COLS - 1 && p.consecutive >= minSteps)
      return p.heat;

    // Try moving in all four directions and update positions accordingly.

    move(positions, p, -1, 0, minSteps, maxSteps); //U
    move(positions, p, 0, 1, minSteps, maxSteps); //R
    move(positions, p, 1, 0, minSteps, maxSteps); //D
    move(positions, p, 0, -1, minSteps, maxSteps); //L
  }

  return 0;
}

console.log(`Part 1: ${minHeat(0, 3)} Part 2: ${minHeat(4, 10)}`);
