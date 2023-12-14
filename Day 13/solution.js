const fs = require("fs");
const grids = fs
  .readFileSync("data.txt", { encoding: "utf-8" })
  .split("\r\n\r\n")
  .map((x) => x.split(","))
  .map((x) => x[0].split("\r\n"));

const solve = (part) => {
  let rTot = 0;

  for (const g of grids) {
    const rows = g.length;
    const cols = g[0].length;

    for (let c = 0; c < cols - 1; c++) {
      let smudges = 0;
      for (let dc = 0; dc < cols; dc++) {
        const left = c - dc;
        const right = c + 1 + dc;
        if (0 <= left && right < cols) {
          for (let r = 0; r < rows; r++) {
            if (g[r][left] !== g[r][right]) {
              smudges += 1;
            }
          }
        }
      }

      if (smudges === (part === 2 ? 1 : 0)) {
        rTot += c + 1;
      }
    }
    for (let r = 0; r < rows - 1; r++) {
      let smudges = 0;
      for (let dr = 0; dr < rows; dr++) {
        const above = r - dr;
        const below = r + 1 + dr;
        if (0 <= above && below < rows) {
          for (let c = 0; c < cols; c++) {
            if (g[above][c] !== g[below][c]) {
              smudges += 1;
            }
          }
        }
      }

      if (smudges === (part === 2 ? 1 : 0)) {
        rTot += 100 * (r + 1);
      }
    }
  }
  console.log(rTot);
};

solve(1);
solve(2);
