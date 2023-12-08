const fs = require("fs");
const data = fs.readFileSync("data.txt", { encoding: "utf-8" }).split("\r\n");

const [times, distances] = data.map((x) => x.match(/\d+/g));

//Solve 1
const solve_1 = () => {
  let waysToBeatRecordPerRace = [];
  for (let i = 0; i < times.length; i++) {
    let waysToBeatCurrRecord = 0;
    for (let k = 0; k < times[i]; k++) {
      let boatSpeed = k;
      let timeLeftOfRace = times[i] - k;
      let distanceTraveled = boatSpeed * timeLeftOfRace;
      if (distanceTraveled > distances[i]) {
        waysToBeatCurrRecord++;
      }
    }
    waysToBeatRecordPerRace.push(waysToBeatCurrRecord);
  }
  return waysToBeatRecordPerRace.reduce(
    (accumulator, currentValue) => accumulator * currentValue,
    1
  );
};

const solve_2 = () => {
  const newTime = parseInt(times.join(""));
  const newDistance = parseInt(distances.join(""));
  let waysToBeatCurrRecord = 0;
  for (let k = 0; k < newTime; k++) {
    let boatSpeed = k;
    let timeLeftOfRace = newTime - k;
    let distanceTraveled = boatSpeed * timeLeftOfRace;
    if (distanceTraveled > newDistance) {
      waysToBeatCurrRecord++;
    }
  }
  return waysToBeatCurrRecord;
};

console.log(solve_1());
console.log(solve_2());
