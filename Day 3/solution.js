const fs = require("fs");
const data = fs.readFileSync("data.txt", { encoding: "utf-8" }).split("\r\n");

const rows = data.map((x) => x.split(""));

const isDigit = (sym) => /\d/g.test(sym);
const isDot = (sym) => /\./g.test(sym);
const isSymbol = (sym) => !isDigit(sym) && !isDot(sym);
const isStar = (sym) => /\*/g.test(sym);

const processDigits = (currDigits, digits, solve) => {
  if (currDigits.length > 0) {
    const hasAdjacent = currDigits.some((digit) => digit.hasAdj);
    const tempDigit = currDigits.map((digit) => digit.digit).join("");
    if (hasAdjacent) {
      if (solve === 1) {
        digits.push(parseInt(tempDigit));
      } else {
        digits.push({
          num: parseInt(tempDigit),
          starCoord:
            currDigits[currDigits.findIndex((dig) => dig.hasAdj)].starCoord,
        });
      }
    }
  }
};

const checkAdjacent = (r, c, rows, solve) => {
  const mw = rows[r].length;
  const mh = rows.length;
  const surroundingsArr = [
    {
      isAdj:
        r - 1 >= 0 &&
        (solve == 1 ? isSymbol(rows[r - 1][c]) : isStar(rows[r - 1][c])),
      coord: { y: r - 1, x: c },
    },
    {
      isAdj:
        c + 1 < mw &&
        (solve == 1 ? isSymbol(rows[r][c + 1]) : isStar(rows[r][c + 1])),
      coord: { y: r, x: c + 1 },
    },
    {
      isAdj:
        r + 1 < mh &&
        (solve == 1 ? isSymbol(rows[r + 1][c]) : isStar(rows[r + 1][c])),
      coord: { y: r + 1, x: c },
    },
    {
      isAdj:
        c - 1 >= 0 &&
        (solve == 1 ? isSymbol(rows[r][c - 1]) : isStar(rows[r][c - 1])),
      coord: { y: r, x: c - 1 },
    },
    {
      isAdj:
        r + 1 < mh &&
        c + 1 < mw &&
        (solve == 1
          ? isSymbol(rows[r + 1][c + 1])
          : isStar(rows[r + 1][c + 1])),
      coord: { y: r + 1, x: c + 1 },
    },
    {
      isAdj:
        r - 1 >= 0 &&
        c + 1 < mw &&
        (solve == 1
          ? isSymbol(rows[r - 1][c + 1])
          : isStar(rows[r - 1][c + 1])),
      coord: { y: r - 1, x: c + 1 },
    },
    {
      isAdj:
        r + 1 < mh &&
        c - 1 >= 0 &&
        (solve == 1
          ? isSymbol(rows[r + 1][c - 1])
          : isStar(rows[r + 1][c - 1])),
      coord: { y: r + 1, x: c - 1 },
    },
    {
      isAdj:
        r - 1 >= 0 &&
        c - 1 >= 0 &&
        (solve == 1
          ? isSymbol(rows[r - 1][c - 1])
          : isStar(rows[r - 1][c - 1])),
      coord: { y: r - 1, x: c - 1 },
    },
  ];
  let hasAdj = surroundingsArr.some((surroundingsObj) => surroundingsObj.isAdj);
  let index = surroundingsArr.findIndex(
    (surroundingsObj) => surroundingsObj.isAdj
  );
  return solve == 1
    ? hasAdj
    : {
        hasAdj,
        starCoord: hasAdj ? surroundingsArr[index].coord : 0,
      };
};

const solve_1 = () => {
  let digits = [];

  for (let r = 0; r < rows.length; r++) {
    let currDigits = [];
    for (let c = 0; c < rows[r].length; c++) {
      const lastIndex = c == rows.length - 1;
      if (isDigit(rows[r][c])) {
        if (checkAdjacent(r, c, rows, 1)) {
          currDigits.push({ digit: rows[r][c], hasAdj: true });
        } else {
          currDigits.push({ digit: rows[r][c], hasAdj: false });
        }
        if (lastIndex) {
          processDigits(currDigits, digits, 1);
          currDigits = [];
        }
      } else if (isDot(rows[r][c]) || isSymbol(rows[r][c])) {
        processDigits(currDigits, digits, 1);
        currDigits = [];
      }
    }
  }
  console.dir(digits);
  return digits.reduce((sum, num) => sum + num, 0);
};

const solve_2 = () => {
  let digits = [];
  let partCoordMap = new Map();

  for (let r = 0; r < rows.length; r++) {
    let currDigits = [];
    for (let c = 0; c < rows[r].length; c++) {
      const lastIndex = c == rows.length - 1;
      if (isDigit(rows[r][c])) {
        if (checkAdjacent(r, c, rows, 2).hasAdj) {
          currDigits.push({
            digit: rows[r][c],
            hasAdj: true,
            starCoord: checkAdjacent(r, c, rows, 2).starCoord,
          });
        } else {
          currDigits.push({ digit: rows[r][c], hasAdj: false });
        }
        if (lastIndex) {
          processDigits(currDigits, digits, 2);
          currDigits = [];
        }
      } else if (isDot(rows[r][c]) || isSymbol(rows[r][c])) {
        processDigits(currDigits, digits, 2);
        currDigits = [];
      }
    }
  }

  for (let digit of digits) {
    if (partCoordMap.has(JSON.stringify(digit.starCoord))) {
      partCoordMap.get(JSON.stringify(digit.starCoord)).push(digit.num);
    } else {
      partCoordMap.set(JSON.stringify(digit.starCoord), [digit.num]);
    }
  }

  return Array.from(partCoordMap.values())
    .filter((x) => x.length == 2)
    .reduce((sum, part) => sum + part[0] * part[1], 0);
};

console.log(solve_1());
console.log(solve_2());
