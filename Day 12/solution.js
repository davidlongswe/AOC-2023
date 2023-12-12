const fs = require("fs");
const data = fs.readFileSync("data.txt", { encoding: "utf-8" }).split("\r\n");

/*
 *-$Caching inspired by HyperNeutrino$-*
 */

const combinatoricsObj = data.map((x) => {
  let [combination, req] = x.split(" ");
  return { combination, req };
});

const cache = {};

const countCombinations = (combination, req) => {
  if (combination === "") return req.length === 0 ? 1 : 0;
  if (req == []) return combination.includes("#") ? 0 : 1;

  const key = JSON.stringify([combination, req]);
  if (key in cache) {
    return cache[key];
  }

  let result = 0;

  if (".?".includes(combination[0])) {
    result += countCombinations(combination.slice(1), req);
  }
  if ("#?".includes(combination[0])) {
    if (
      req[0] <= combination.length &&
      !combination.slice(0, req[0]).includes(".") &&
      (req[0] == combination.length || combination[req[0]] !== "#")
    ) {
      result += countCombinations(combination.slice(req[0] + 1), req.slice(1));
    }
  }

  cache[key] = result;

  return result;
};

let solve_1 = 0;
let solve_2 = 0;

for (let c of combinatoricsObj) {
  let part1combination = c.combination;
  let part1req = c.req.split(",").map(Number);
  let part2combination = Array(5).fill(c.combination).join("?");
  let part2req = c.req
    .concat(",")
    .repeat(5)
    .slice(0, -1)
    .split(",")
    .map(Number);
  solve_1 += countCombinations(part1combination, part1req);
  solve_2 += countCombinations(part2combination, part2req);
}

console.log(solve_1, solve_2);
