const fs = require("fs");
var Deque = require("../node_modules/collections/deque");
const data = fs.readFileSync("data.txt", { encoding: "utf-8" }).split("\r\n");
const grid = data.map((row) => row.split(""));

const getStartingPosition = () => {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === "S") return [r, c];
    }
  }
};

const solve1_2 = () => {
  let sPos = getStartingPosition();
  const visited = new Set();
  let isVisited = (pos, set) => set.has(pos);
  const canTravelUp = (sym, pos) => "S|JL".includes(sym) && "|7F".includes(pos);
  const canTravelDown = (sym, pos) =>
    "S|7F".includes(sym) && "|JL".includes(pos);
  const canTravelLeft = (sym, pos) =>
    "S-J7".includes(sym) && "-LF".includes(pos);
  const canTravelRight = (sym, pos) =>
    "S-LF".includes(sym) && "-J7".includes(pos);
  const q = new Deque();
  visited.add(`${sPos[0]},${sPos[1]}`);
  q.add({ r: sPos[0], c: sPos[1] });

  let sPosReplacement = new Set(["|", "-", "J", "L", "7", "F"]);

  while (q.length > 0) {
    const { r, c } = q.shift();
    const sym = grid[r][c];

    if (
      r > 0 &&
      canTravelUp(sym, grid[r - 1][c]) &&
      !isVisited(`${r - 1},${c}`, visited)
    ) {
      visited.add(`${r - 1},${c}`);
      q.push({ r: r - 1, c: c });
      sym === "S" &&
        (sPosReplacement = sPosReplacement.intersection(["|", "J", "L"]));
    }

    if (
      r < grid.length - 1 &&
      canTravelDown(sym, grid[r + 1][c]) &&
      !isVisited(`${r + 1},${c}`, visited)
    ) {
      visited.add(`${r + 1},${c}`);
      q.push({ r: r + 1, c: c });
      sym === "S" &&
        (sPosReplacement = sPosReplacement.intersection(["|", "7", "F"]));
    }

    if (
      c > 0 &&
      canTravelLeft(sym, grid[r][c - 1]) &&
      !isVisited(`${r},${c - 1}`, visited)
    ) {
      visited.add(`${r},${c - 1}`);
      q.push({ r: r, c: c - 1 });
      sym === "S" &&
        (sPosReplacement = sPosReplacement.intersection(["-", "J", "7"]));
    }

    if (
      c < grid[r].length - 1 &&
      canTravelRight(sym, grid[r][c + 1]) &&
      !isVisited(`${r},${c + 1}`, visited)
    ) {
      visited.add(`${r},${c + 1}`);
      q.push({ r: r, c: c + 1 });
      sym === "S" &&
        (sPosReplacement = sPosReplacement.intersection(["-", "L", "F"]));
    }
  }

  let newSPos = sPosReplacement.size === 1 ? [...sPosReplacement][0] : "S";

  const updatedGrid = grid.map((row, r) =>
    row.map((sym, c) => {
      if (!visited.has([r, c].join(","))) sym = ".";
      if (sym === "S") sym = newSPos;
      return sym;
    })
  );

  let outside = new Set();
  let within = false;
  let up = null;
  for (let r = 0; r < updatedGrid.length; r++) {
    let row = updatedGrid[r];
    for (let c = 0; c < row.length; c++) {
      let sym = row[c];
      if (sym === "|") {
        within = !within;
      } else if (sym === "-" || sym === ".") {
      } else if (["L", "F"].includes(sym)) {
        up = sym === "L";
      } else if (["7", "J"].includes(sym)) {
        if (sym !== (up ? "J" : "7")) {
          within = !within;
        }
        up = null;
      } else {
        throw new Error(`Unexpected character: ${sym}`);
      }
      if (!within) {
        outside.add([r, c]);
      }
    }
  }

  let outsideAndVisited = new Set([
    ...outside.map((x) => x.join(",")),
    ...visited,
  ]);

  console.log(`Part 1: ${Math.floor(visited.size / 2)}`);
  console.log(
    `Part 2: ${
      updatedGrid.length * updatedGrid[0].length - outsideAndVisited.size
    }`
  );
};

solve1_2();
