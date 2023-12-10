const fs = require("fs");
const data = fs.readFileSync("data.txt", { encoding: "utf-8" }).split("\r\n");
const sequences = data.map((line) => line.split(" ").map(Number));

const extrapolate = (s) => {
  return s.slice(1).map((value, index) => value - s[index]);
};

const solve_1_2 = () => {
  let solution_1 = 0;
  let solution_2 = 0;
  sequences.forEach((seq) => {
    let differenceCalc = [seq];
    for (let i = 0; seq.some((value) => value !== 0); i++) {
      seq = extrapolate(seq);
      differenceCalc.push(seq);
    }
    solution_1 += differenceCalc
      .map((arr) => arr[arr.length - 1])
      .reduce((a, b) => a + b);
    solution_2 += differenceCalc
      .map((arr) => arr[0])
      .reduceRight((a, b) => b - a);
  });
  return `Part 1: ${solution_1}, Part 2: ${solution_2}`;
};

console.log(solve_1_2());
