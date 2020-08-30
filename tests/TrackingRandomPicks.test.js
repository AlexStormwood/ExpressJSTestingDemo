const { pickRandomFromArray, pickRandomRepeatedly } = require("../server/TrackingRandomPicks");

let possibleCoinFlipOutcomes = ["heads", "tails"];
let possibleDiceRollOutcomes = [1, 2, 3, 4, 5, 6];

describe('pickRandomFromArray returns one value from the provided arrays.', () => {
    it('Returns one string from an array of strings.', () => {
      expect(typeof pickRandomFromArray(possibleCoinFlipOutcomes) === "string").toBe(true)
    })
    it('Returns one number from an array of numbers.', () => {
        expect(typeof pickRandomFromArray(possibleDiceRollOutcomes) === "number").toBe(true)
      })
});

describe("pickRandomRepeatedly returns an object containing keys that match an array's values.", () => {
    it('Returns an object with 2 keys for a provided with an array containing heads & tails.', () => {
        let objReturned = JSON.parse(pickRandomRepeatedly(possibleCoinFlipOutcomes, 10));
        let objKeysSorted = [...Object.keys(objReturned)].sort();
        let inputValsSorted = [...possibleCoinFlipOutcomes].sort();
        for (let index = 0; index < objKeysSorted.length; index++) {
            expect(objKeysSorted[index] == inputValsSorted[index]).toEqual(true);
        }
    });

    it('Returns an object with 6 keys for a provided array containing numbers 1 through 6.', () => {
        let objReturned = JSON.parse(pickRandomRepeatedly(possibleDiceRollOutcomes, 10));
        let objKeysSorted = [...Object.keys(objReturned)].sort();
        let inputValsSorted = [...possibleDiceRollOutcomes].sort();
        for (let index = 0; index < objKeysSorted.length; index++) {
            expect(objKeysSorted[index] == inputValsSorted[index]).toEqual(true);
        }
    });
});