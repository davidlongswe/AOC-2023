const fs = require("fs");
const data = fs.readFileSync("data.txt", { encoding: "utf-8" }).split("\r\n");

const numbers = data.map((x) => x.split(":")).map((x) => x[1].split("|"));

const winningNumbers = numbers
  .map((x) => x[0].trim())
  .map((x) => x.split(/\s+/g));

const myNumbers = numbers.map((x) => x[1].trim()).map((x) => x.split(/\s+/g));

const solve_1 = () => {
  let totalPts = 0;

  for (let i = 0; i < myNumbers.length; i++) {
    let cardWins = myNumbers[i].filter((num) =>
      winningNumbers[i].includes(num)
    ).length;
    if (cardWins !== 0) {
      totalPts += 2 ** (cardWins - 1);
    }
  }
  return totalPts;
};

const solve_2 = () => {
  const tempArr = [];
  for (let i = 0; i < winningNumbers.length; i++) {
    let winAmount = 0;
    for (const myNum of myNumbers[i]) {
      if (winningNumbers[i].includes(myNum)) {
        winAmount++;
      }
    }
    tempArr.push({
      winAmount,
      count: 1,
    });
  }

  for (let i = 0; i < tempArr.length; i++) {
    const currentCard = tempArr[i];
    for (j = 1; j <= currentCard.winAmount; j++) {
      tempArr[i + j].count += currentCard.count;
    }
  }

  let res = 0;
  tempArr.forEach((cardsWon) => (res += cardsWon.count));
  return res;
};

console.log(solve_1());
console.log(solve_2());
