const fs = require("fs");
const grid = fs.readFileSync("data.txt", { encoding: "utf-8" }).split("\r\n");
var Deque = require("../node_modules/collections/deque");
const { empty } = require("collections/shim-object");

let rows = grid.length;
let cols = grid[0].length;

const printG = (g) => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      process.stdout.write(g[r][c]);
    }
    console.log();
  }
};

const getEnergizedCells = (g, sP) => {
  const energized = new Set();
  const dq = new Deque();
  const vacuum = (row, col) => g[row][col] === ".";
  const fMirror = (row, col) => g[row][col] === "/";
  const bMirror = (row, col) => g[row][col] === "\\";
  const vSplitter = (row, col) => g[row][col] === "|";
  const hSplitter = (row, col) => g[row][col] === "-";
  const getCoords = (s) => s.match(/\d+/g);

  dq.add(sP);

  while (dq.length !== 0) {
    let [r, c, dr, dc] = dq.shift();

    r += dr;
    c += dc;

    if (r < 0 || r >= g.length || c < 0 || c >= g[0].length) {
      continue;
    }

    if (
      vacuum(r, c) ||
      (hSplitter(r, c) && dc !== 0) ||
      (vSplitter(r, c) && dr !== 0)
    ) {
      if (!energized.has(JSON.stringify([r, c, dr, dc]))) {
        dq.add([r, c, dr, dc]);
        energized.add(JSON.stringify([r, c, dr, dc]));
      }
    } else if (fMirror(r, c)) {
      //(down -> left) (up -> right) (right -> up) (left -> down)
      if (dc !== 0) {
        dr = -dc;
        dc = 0;
      } else {
        dc = -dr;
        dr = 0;
      }
      if (!energized.has(JSON.stringify([r, c, dr, dc]))) {
        dq.add([r, c, dr, dc]);
        energized.add(JSON.stringify([r, c, dr, dc]));
      }
    } else if (bMirror(r, c)) {
      //(down -> right) (up -> left) (right -> down) (left -> up)
      if (dc !== 0) {
        dr = dc;
        dc = 0;
      } else {
        dc = dr;
        dr = 0;
      }
      if (!energized.has(JSON.stringify([r, c, dr, dc]))) {
        dq.add([r, c, dr, dc]);
        energized.add(JSON.stringify([r, c, dr, dc]));
      }
    } else {
      let pairs = vSplitter(r, c)
        ? [
            [1, 0],
            [-1, 0],
          ]
        : [
            [0, 1],
            [0, -1],
          ];
      for (let pair of pairs) {
        let [newDr, newDc] = pair;
        if (!energized.has(JSON.stringify([r, c, newDr, newDc]))) {
          dq.add([r, c, newDr, newDc]);
          energized.add(JSON.stringify([r, c, newDr, newDc]));
        }
      }
    }
  }
  let cleanSet = new Set();
  for (let s of energized) {
    let [r, c] = getCoords(s);
    cleanSet.add(JSON.stringify([r, c]));
  }
  return cleanSet.size;
};

const solve_1 = () => {
  return getEnergizedCells(grid, [0, -1, 0, 1]);
};

const solve_2 = () => {
  let variations = [];
  for (let i = 0; i < rows; i++) {
    //Leftermost
    variations.push(getEnergizedCells(grid, [i, -1, 0, 1]));
    //Uppermost
    variations.push(getEnergizedCells(grid, [-1, i, 1, 0]));
    //Rightermost
    variations.push(getEnergizedCells(grid, [i, cols, 0, -1]));
    //Lowermost
    variations.push(getEnergizedCells(grid, [rows, i, -1, 0]));
  }
  return Math.max(...variations);
};

console.log(`Part 1: ${solve_1()}, Part 2: ${solve_2()}`);
