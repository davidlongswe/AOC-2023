const fs = require("fs");
let g = fs
  .readFileSync("data.txt", { encoding: "utf-8" })
  .split("\r\n")
  .map((row) => row.split(""));

const roll = (dir, g, row, col) => {
  const directions = {
    N: { row: -1, col: 0 },
    E: { row: 0, col: 1 },
    S: { row: 1, col: 0 },
    W: { row: 0, col: -1 },
  };

  const { row: rowInc, col: colInc } = directions[dir];
  let newRow = row + rowInc;
  let newCol = col + colInc;

  while (
    newRow >= 0 &&
    newRow < g.length &&
    newCol >= 0 &&
    newCol < g[row].length &&
    !"#O".includes(g[newRow][newCol])
  ) {
    newRow += rowInc;
    newCol += colInc;
  }

  if (newRow !== row + rowInc || newCol !== col + colInc) {
    g[row][col] = ".";
    g[newRow - rowInc][newCol - colInc] = "O";
  }
};

const runCycle = (dirs) => {
  const rows = g.length;
  const cols = g[0].length;

  for (const dir of dirs) {
    const startRow = dir.includes("N") ? 0 : rows - 1;
    const endRow = dir.includes("N") ? rows : -1;
    const stepRow = dir.includes("N") ? 1 : -1;

    const startCol = dir.includes("W") ? 0 : cols - 1;
    const endCol = dir.includes("W") ? cols : -1;
    const stepCol = dir.includes("W") ? 1 : -1;

    for (let r = startRow; r !== endRow; r += stepRow) {
      for (let c = startCol; c !== endCol; c += stepCol) {
        if (g[r][c] === "O") {
          roll(dir, g, r, c);
        }
      }
    }
  }
};

const sumOfStones = (graph) => {
  let totLoad = 0;
  let rows = graph.length;
  for (let r = 0; r < rows; r++) {
    let count = 0;
    for (let c = 0; c < graph[r].length; c++) {
      if (graph[r][c] === "O") {
        count++;
        totLoad += rows - r;
      }
    }
  }
  return totLoad;
};

const solve_1 = () => {
  runCycle(["N"]);
  console.log(`Part 1: ${sumOfStones(g)}`);
};

const solve_2 = () => {
  let gridIndexes = new Map();
  let cycleStart, cycleEnd;

  for (let iter = 0; iter < 1000000000; iter++) {
    const gString = JSON.stringify(g);
    if (gridIndexes.has(gString)) {
      cycleStart = gridIndexes.get(gString);
      cycleEnd = iter;
      break;
    } else {
      gridIndexes.set(gString, iter);
      runCycle(["N", "W", "S", "E"]);
    }
  }

  for (let j = 0; j < (1000000000 - cycleEnd) % (cycleEnd - cycleStart); j++) {
    runCycle(["N", "W", "S", "E"]);
  }

  console.log(`Part 2: ${sumOfStones(g)}`);
};

solve_1();
solve_2();
