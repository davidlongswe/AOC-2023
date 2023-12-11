const fs = require("fs");
const data = fs
  .readFileSync("data.txt", { encoding: "utf-8" })
  .split(/\r\n\r\n/g);

let seeds_1 = data[0].split(":")[1].trim().split(" ").map(Number);
let seeds_2 = [];

for (let i = 0; i < seeds_1.length; i += 2) {
  seeds_2.push([seeds_1[i], seeds_1[i] + seeds_1[i + 1]]);
}

let blocks = data.slice(1).map((x) => {
  return ([dest, source, rangeLen] = x
    .split("\r\n")
    .slice(1)
    .map((x) => x.split(" "))
    .map((x) => x.map((x) => parseInt(x))));
});

const solve_1 = () => {
  for (const block of blocks) {
    newSeeds = [];
    for (let seed of seeds_1) {
      let found = false;
      for (let [a, b, c] of block) {
        if (b <= seed && seed < b + c) {
          newSeeds.push(seed - b + a);
          found = true;
          break;
        }
      }
      if (!found) {
        newSeeds.push(seed);
      }
    }
    seeds_1 = newSeeds;
  }
  return Math.min(...newSeeds);
};

const solve_2 = () => {
  for (const block of blocks) {
    newSeeds = [];
    while (seeds_2.length > 0) {
      let [start, end] = seeds_2.shift();
      let added = false;

      for (let [a, b, c] of block) {
        let overlapStart = Math.max(start, b);
        let overlapEnd = Math.min(end, b + c);

        if (overlapStart < overlapEnd) {
          newSeeds.push([overlapStart - b + a, overlapEnd - b + a]);

          if (overlapStart > start) {
            seeds_2.push([start, overlapStart]);
          }

          if (end > overlapEnd) {
            seeds_2.push([overlapEnd, end]);
          }

          added = true;
          break;
        }
      }

      if (!added) {
        newSeeds.push([start, end]);
      }
    }
    seeds_2 = newSeeds;
  }
  return Math.min(...seeds_2.flat());
};

console.log(solve_1());
console.log(solve_2());
