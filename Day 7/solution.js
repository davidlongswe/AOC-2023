const fs = require("fs");
const data = fs.readFileSync("data.txt", { encoding: "utf-8" }).split("\r\n");

const splitData = data.map((line) => {
  const [hand, bid] = line.split(" ");
  return [hand, parseInt(bid)];
});

const hands = splitData.map((entry) => entry[0]);
const bids = splitData.map((entry) => entry[1]);
