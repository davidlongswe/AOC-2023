const fs = require("fs");
const data = fs.readFileSync("data.txt", { encoding: "utf-8" }).split("\r\n");

const gcd = (a, b) => (b == 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a / gcd(a, b)) * b;
const lcmAll = (ns) => ns.reduce(lcm, 1);

let graph = {};

const instructions = data[0].split("");
data.slice(2, data.length).forEach((nodeInfo) => {
  let splitNodeInfo = nodeInfo.replaceAll(/[()\s+]/g, "").split("=");
  let origin = splitNodeInfo[0];
  let [L, R] = splitNodeInfo[1].split(",");
  graph[origin] = { L, R };
});

const startingPoint = graph["AAA"];
const endingPoint = graph["ZZZ"];

const solve_1 = () => {
  let steps = 0;
  let i = 0;
  let currentNode = startingPoint;
  while (currentNode !== endingPoint) {
    if (i == instructions.length - 1) i = 0;
    for (let i = 0; i < instructions.length; i++) {
      if (instructions[i] == "L") {
        currentNode = graph[currentNode["L"]];
        steps++;
      } else if (instructions[i] == "R") {
        currentNode = graph[currentNode["R"]];
        steps++;
      }
    }
  }
  return steps;
};

const solve_2 = () => {
  let sPoints = Object.keys(graph).filter((n) => n.endsWith("A"));
  let steps = 0;
  const stepsToCycle = [];
  while (sPoints.length > 0) {
    const m = instructions[steps % instructions.length];

    sPoints.forEach((n, i) => {
      sPoints[i] = graph[n][m];
    });
    steps += 1;
    const next = sPoints.filter((s) => !s.endsWith("Z"));
    if (next.length != sPoints.length) {
      stepsToCycle.push(steps);
    }
    sPoints = next;
  }
  return lcmAll(stepsToCycle);
};

console.log(solve_1());
console.log(solve_2());
