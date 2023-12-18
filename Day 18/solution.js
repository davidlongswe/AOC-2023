const fs = require("fs");
const data = fs.readFileSync("data.txt", { encoding: "utf-8" }).split("\r\n");

const diggerMoves = data
  .map((line) => line.split(" "))
  .map((props) => {
    let dir = props[0];
    let steps = parseInt(props[1]);
    let instructions = props[2]
      .replace("(", "")
      .replace(")", "")
      .replace("#", "");
    return { dir, steps, instructions };
  });

const getInteriorArea = (vertices) => {
  return (
    Math.abs(
      vertices.reduce((acc, _, i, arr) => {
        const [xi, _yi] = arr[i];
        const [_xiPrev, yiPrev] = arr[(i - 1 + arr.length) % arr.length];
        const [_xiNext, yiNext] = arr[(i + 1) % arr.length];
        return acc + xi * (yiPrev - yiNext);
      }, 0)
    ) / 2
  );
};

const solve_1 = () => {
  let vertices = [[0, 0]];
  let perimeter = 0;

  const dx = { R: 1, L: -1, U: 0, D: 0 };
  const dy = { R: 0, L: 0, U: -1, D: 1 };

  for (let dm of diggerMoves) {
    let { dir, steps, _instructions } = dm;
    let [r, c] = vertices[vertices.length - 1];
    perimeter += steps;
    vertices.push([r + dy[dir] * steps, c + dx[dir] * steps]);
  }
  let interiorArea = getInteriorArea(vertices);
  return interiorArea - perimeter / 2 + 1 + perimeter;
};

const solve_2 = () => {
  let vertices = [[0, 0]];
  let perimeter = 0;

  const dx = { R: 1, L: -1, U: 0, D: 0 };
  const dy = { R: 0, L: 0, U: -1, D: 1 };

  for (let dm of diggerMoves) {
    let { _dir, _steps, instructions } = dm;
    let [r, c] = vertices[vertices.length - 1];
    let steps = parseInt(instructions.slice(0, 5), 16);
    let dir = "RDLU"[parseInt(instructions.slice(-1))];
    perimeter += steps;
    vertices.push([r + dy[dir] * steps, c + dx[dir] * steps]);
    console.log(steps, dir);
  }
  let interiorArea = getInteriorArea(vertices);
  return interiorArea - perimeter / 2 + 1 + perimeter;
};

console.log(`Part 1: ${solve_1()} Part 2: ${solve_2()}`);
