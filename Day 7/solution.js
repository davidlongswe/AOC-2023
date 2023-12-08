const fs = require("fs");
const data = fs.readFileSync("data.txt", { encoding: "utf-8" }).split("\r\n");

const handData = data.map((line) => {
  const [hand, bid] = line.split(" ");
  return { hand, bid: parseInt(bid) };
});

let onePairHands = [];
let twoPairHands = [];
let threeKindHands = [];
let fourKindHands = [];
let fiveKindHands = [];
let fullHouseHands = [];
let highCardHands = [];

let part = 2;

const cardValues = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  T: 10,
  J: part === 1 ? 11 : 1,
  Q: 12,
  K: 13,
  A: 14,
};

const getOccurences = (cards) =>
  cards.reduce(function (acc, curr) {
    return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
  }, {});

const fiveOfAKind = (hand) => {
  if (part === 1) {
    return Object.values(getOccurences([...hand])).includes(5);
  } else {
    return (
      (getOccurences([...hand])["J"] === 1 &&
        Object.values(getOccurences([...hand])).includes(4)) ||
      (getOccurences([...hand])["J"] === 2 &&
        Object.values(getOccurences([...hand])).includes(3)) ||
      (getOccurences([...hand])["J"] === 3 &&
        Object.values(getOccurences([...hand])).includes(2)) ||
      (getOccurences([...hand])["J"] === 4 &&
        Object.values(getOccurences([...hand])).includes(1)) ||
      Object.values(getOccurences([...hand])).includes(5)
    );
  }
};

const fourOfAKind = (hand) => {
  if (part === 1) {
    Object.values(getOccurences([...hand])).includes(4);
  } else {
    return (
      (getOccurences([...hand])["J"] === 1 &&
        Object.values(getOccurences([...hand])).includes(3)) ||
      (getOccurences([...hand])["J"] === 2 &&
        Object.values(getOccurences([...hand])).filter((x) => x === 2)
          .length === 2) ||
      (getOccurences([...hand])["J"] === 3 &&
        Object.values(getOccurences([...hand])).includes(1)) ||
      Object.values(getOccurences([...hand])).includes(4)
    );
  }
};

const fullHouse = (hand) => {
  if (part === 1) {
    return (
      Object.values(getOccurences([...hand])).includes(3) &&
      Object.values(getOccurences([...hand])).includes(2)
    );
  } else {
    return (
      (Object.values(getOccurences([...hand])).includes(3) &&
        Object.values(getOccurences([...hand])).includes(2)) ||
      (Object.values(getOccurences([...hand])).filter((x) => x === 2).length ===
        2 &&
        getOccurences([...hand])["J"] === 1) ||
      (Object.values(getOccurences([...hand])).filter((x) => x === 2).length ===
        2 &&
        getOccurences([...hand])["J"] === 2)
    );
  }
};

const threeOfAKind = (hand) => {
  if (part === 1) {
    return (
      Object.values(getOccurences([...hand])).includes(3) &&
      !Object.values(getOccurences([...hand])).includes(2)
    );
  } else {
    return (
      (Object.values(getOccurences([...hand])).includes(3) &&
        !Object.values(getOccurences([...hand])).includes(2)) ||
      (Object.values(getOccurences([...hand])).includes(2) &&
        getOccurences([...hand])["J"] === 1) ||
      getOccurences([...hand])["J"] === 2
    );
  }
};

const twoPair = (hand) => {
  if (part === 1) {
    return (
      Object.values(getOccurences([...hand])).filter((occ) => occ == 2)
        .length == 2
    );
  } else {
    return (
      Object.values(getOccurences([...hand])).filter((occ) => occ == 2)
        .length == 2 ||
      (Object.values(getOccurences([...hand])).includes(2) &&
        getOccurences([...hand])["J"] === 1)
    );
  }
};

const onePair = (hand) => {
  if (part === 1) {
    return (
      Object.values(getOccurences([...hand])).filter((occ) => occ == 2)
        .length == 1 && !Object.values(getOccurences([...hand])).includes(3)
    );
  } else {
    return (
      (Object.values(getOccurences([...hand])).filter((occ) => occ == 2)
        .length == 1 &&
        !Object.values(getOccurences([...hand])).includes(3)) ||
      getOccurences([...hand])["J"] === 1
    );
  }
};

const highCard = (hand) => new Set([...hand]).size === hand.length;

const sortedByCardOrder = (hands) => {
  return hands.sort((a, b) => {
    let aHandArr = a.hand.split("");
    let bHandArr = b.hand.split("");
    for (let i = 0; i < aHandArr.length; i++) {
      if (cardValues[aHandArr[i]] === cardValues[bHandArr[i]]) continue;
      if (cardValues[aHandArr[i]] > cardValues[bHandArr[i]]) return 1;
      if (cardValues[aHandArr[i]] < cardValues[bHandArr[i]]) return -1;
    }
    return 0;
  });
};

const solve = () => {
  for (let currHand of handData) {
    switch (true) {
      case fiveOfAKind(currHand.hand):
        fiveKindHands.push({
          hand: currHand.hand,
          bid: currHand.bid,
          pattern: "fiveOfAKind",
        });
        break;
      case fourOfAKind(currHand.hand):
        fourKindHands.push({
          hand: currHand.hand,
          bid: currHand.bid,
          pattern: "fourOfAKind",
        });
        break;
      case fullHouse(currHand.hand):
        fullHouseHands.push({
          hand: currHand.hand,
          bid: currHand.bid,
          pattern: "fullHouse",
        });
        break;
      case threeOfAKind(currHand.hand):
        threeKindHands.push({
          hand: currHand.hand,
          bid: currHand.bid,
          pattern: "threeOfAKind",
        });
        break;
      case twoPair(currHand.hand):
        twoPairHands.push({
          hand: currHand.hand,
          bid: currHand.bid,
          pattern: "twoPair",
        });
        break;
      case onePair(currHand.hand):
        onePairHands.push({
          hand: currHand.hand,
          bid: currHand.bid,
          pattern: "onePair",
        });
        break;
      case highCard(currHand.hand):
        highCardHands.push({
          hand: currHand.hand,
          bid: currHand.bid,
          pattern: "highCard",
        });
        break;
      default:
        console.log(`Invalid hand ${currHand.hand}`);
    }
  }

  let onePairHandsSorted = sortedByCardOrder(onePairHands);
  let twoPairHandsSorted = sortedByCardOrder(twoPairHands);
  let threeKindHandsSorted = sortedByCardOrder(threeKindHands);
  let fourKindHandsSorted = sortedByCardOrder(fourKindHands);
  let fiveKindHandsSorted = sortedByCardOrder(fiveKindHands);
  let fullHouseHandsSorted = sortedByCardOrder(fullHouseHands);
  let highCardHandsSorted = sortedByCardOrder(highCardHands);

  const allHands = [
    ...highCardHandsSorted,
    ...onePairHandsSorted,
    ...twoPairHandsSorted,
    ...threeKindHandsSorted,
    ...fullHouseHandsSorted,
    ...fourKindHandsSorted,
    ...fiveKindHandsSorted,
  ];

  let sum = 0;
  allHands.forEach((hand, index) => {
    sum += hand.bid * (index + 1);
  });

  return sum;
};

console.log(solve());
