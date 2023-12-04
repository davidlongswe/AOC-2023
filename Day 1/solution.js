const fs = require("fs");
const data = fs.readFileSync("data.txt", { encoding: "utf-8" }).split("\r\n");

const solve_1 = () => {
  return data
    .map((x) => x.match(/\d/g))
    .filter((x) => x !== null)
    .map((x) => parseInt(x[0] + x.slice(-1)))
    .reduce((sum, num) => sum + num, 0);
};

const solve_2 = () => {
  return data
    .map((x) =>
      x
        .replaceAll(/one/gi, "o1e")
        .replaceAll(/two/gi, "t2o")
        .replaceAll(/three/gi, "t3e")
        .replaceAll(/four/gi, "f4r")
        .replaceAll(/five/gi, "f5e")
        .replaceAll(/six/gi, "s6x")
        .replaceAll(/seven/gi, "s7n")
        .replaceAll(/eight/gi, "e8t")
        .replaceAll(/nine/gi, "n9e")
    )
    .map((x) => x.match(/\d/g))
    .filter((x) => x !== null)
    .map((x) => parseInt(x[0] + x.slice(-1)))
    .reduce((sum, num) => sum + num, 0);
};

console.log(solve_1());
console.log(solve_2());
