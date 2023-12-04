const fs = require("fs");
const data = fs.readFileSync("data.txt", { encoding: "utf-8" }).split("\r\n");

const checkIfPossibleGame = (sets) => {
  const MAX_RED = 12,
    MAX_GREEN = 13,
    MAX_BLUE = 14;

  let possible = true;

  sets.forEach((set) => {
    const subsets = set.split(",");

    subsets.forEach((subset) => {
      const numericValue = parseInt(subset.match(/\d+/));
      if (subset.includes("red")) {
        if (!isNaN(numericValue) && numericValue > MAX_RED) possible = false;
      }
      if (subset.includes("blue")) {
        if (!isNaN(numericValue) && numericValue > MAX_BLUE) possible = false;
      }
      if (subset.includes("green")) {
        if (!isNaN(numericValue) && numericValue > MAX_GREEN) possible = false;
      }
    });
  });

  return possible;
};

const getPowerSet = (sets) => {
  let MIN_RED = 0,
    MIN_BLUE = 0,
    MIN_GREEN = 0;

  sets.forEach((set) => {
    const subsets = set.split(",");

    for (let subset of subsets) {
      let currVal = parseInt(subset.match(/\d+/));
      if (subset.includes("red")) {
        if (currVal > MIN_RED) {
          MIN_RED = currVal;
        }
      }
      if (subset.includes("blue")) {
        if (currVal > MIN_BLUE) {
          MIN_BLUE = currVal;
        }
      }
      if (subset.includes("green")) {
        if (currVal > MIN_GREEN) {
          MIN_GREEN = currVal;
        }
      }
    }
  });

  return MIN_RED * MIN_BLUE * MIN_GREEN;
};

const solve_1 = () => {
  let idSum = 0;
  for (let game of data) {
    let splitGame = game.split(":");
    let ID = parseInt(splitGame[0].match(/\d+/g));
    let sets = splitGame[1].split(";");
    checkIfPossibleGame(sets) && (idSum += ID);
  }
  return idSum;
};

const solve_2 = () => {
  let powerSum = 0;

  for (let game of data) {
    let splitGame = game.split(":");
    let sets = splitGame[1].split(";");
    powerSum += getPowerSet(sets);
  }
  return powerSum;
};

console.log(solve_1());
console.log(solve_2());
