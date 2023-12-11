const fs = require("fs");
const data = fs.readFileSync("data.txt", { encoding: "utf-8" }).split("\r\n");
const grid = data.map((row) => row.split(""));

const getEmptyRows = (grid) => {
  let emptyRows = [];
  grid.forEach((row, index) => {
    row.every((char) => char === ".") && emptyRows.push(index);
  });
  return emptyRows;
};

const getEmptyColumns = (grid) => {
  let emptyColumns = [];
  let transposedGrid = grid[0].map((col, i) => grid.map((row) => row[i]));
  transposedGrid.forEach(
    (col, index) =>
      col.every((char) => char === ".") && emptyColumns.push(index)
  );
  return emptyColumns;
};

const getGalaxyCoords = (grid) => {
  let galaxyCoords = [];
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === "#") galaxyCoords.push([r, c]);
    }
  }
  return galaxyCoords;
};

let total1 = 0;
let total2 = 0;
let scale1 = 2;
let scale2 = 1000000;

let galaxyCoords = getGalaxyCoords(grid);
let emptyRows = getEmptyRows(grid);
let emptyColumns = getEmptyColumns(grid);

for (let i = 0; i < galaxyCoords.length; i++) {
  let [r1, c1] = galaxyCoords[i];

  for (let j = 0; j < i; j++) {
    let [r2, c2] = galaxyCoords[j];

    for (let r = Math.min(r1, r2); r < Math.max(r1, r2); r++) {
      total1 += emptyRows.includes(r) ? scale1 : 1;
      total2 += emptyRows.includes(r) ? scale2 : 1;
    }

    for (let c = Math.min(c1, c2); c < Math.max(c1, c2); c++) {
      total1 += emptyColumns.includes(c) ? scale1 : 1;
      total2 += emptyColumns.includes(c) ? scale2 : 1;
    }
  }
}

console.log(`Part 1: ${total1}, Part 2: ${total2}`);
