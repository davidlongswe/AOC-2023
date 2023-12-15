const fs = require("fs");
const data = fs.readFileSync("data.txt", { encoding: "utf-8" }).split("\r\n");

let stringsToConvert = data[0].split(",");

const hash = (ss) => {
  let prevCode = 0;
  for (let ch of ss) {
    let currValue = prevCode;
    currValue += ch.charCodeAt(0);
    currValue *= 17;
    currValue %= 256;
    prevCode = currValue;
  }
  return prevCode;
};

const hash2 = (ss) => {
  let label, focalLength, operation;
  if (ss.includes("=")) {
    [label, focalLength] = ss.split("=");
    operation = "=";
  } else if (ss.includes("-")) {
    label = ss.split("-")[0];
    operation = "-";
  }

  let box = 0;
  for (let ch of label) {
    let currValue = box;
    currValue += ch.charCodeAt(0);
    currValue *= 17;
    currValue %= 256;
    box = currValue;
  }
  return [box, label, focalLength, operation];
};

const solve_1 = () => {
  let tot = 0;
  for (let i = 0; i < stringsToConvert.length; i++) {
    let splitString = stringsToConvert[i].split("");
    tot += hash(splitString);
  }
  return tot;
};

const solve_2 = () => {
  let tot = 0;
  let boxes = Array.from({ length: 256 }, () => []);
  for (let i = 0; i < stringsToConvert.length; i++) {
    let [box, label, focalLength, operation] = hash2(stringsToConvert[i]);
    let boxContents = focalLength && `${label} ${focalLength}`;
    if (!boxes[box]) console.log(boxContents);
    let labelIndex = boxes[box].findIndex((bC) => bC.includes(label));

    if (operation === "-") {
      if (labelIndex !== -1) boxes[box].splice(labelIndex, 1);
    } else if (operation === "=") {
      if (labelIndex !== -1 && boxes[box][labelIndex].includes(label)) {
        boxes[box][labelIndex] = boxContents;
      } else {
        boxes[box].push(boxContents);
      }
    }
  }

  boxes.forEach((b, index) => {
    for (let slot = 0; slot < b.length; slot++) {
      tot += (index + 1) * (slot + 1) * parseInt(b[slot].split(" ")[1]);
    }
  });

  return tot;
};

console.log(`Part 1: ${solve_1()} Part 2: ${solve_2()}`);
