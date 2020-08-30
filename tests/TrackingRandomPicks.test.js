// This file is an example of plain Jest for NodeJS tests.
// The other file has the Supertest & Jest for ExpressJS tests.

const { pickRandomFromArray, pickRandomRepeatedly } = require("../server/TrackingRandomPicks");

// Should probably store this in a "datasets.js" file or something.
// Or use a database reference. This app is simple, doesn't need epic setups.
let possibleCoinFlipOutcomes = ["heads", "tails"];
let possibleDiceRollOutcomes = [1, 2, 3, 4, 5, 6];

// Set up a test suite, or collection of tests, to test one function against a variety of data.
describe('pickRandomFromArray returns one value from the provided arrays.', () => {
	it('Returns one string from an array of strings.', () => {
		// Jest has this dumb rule against syntactic sugar.
		// While you can use Jest methods to check for types of complex objects (eg. Arrays, Classes),
		// you can't do that consistently for primitive types or value types. This is the 
		// most consistent way to check what data type your primitive data is in Jest:
		expect(typeof pickRandomFromArray(possibleCoinFlipOutcomes) === "string").toBe(true)
	})
	it('Returns one number from an array of numbers.', () => {
		expect(typeof pickRandomFromArray(possibleDiceRollOutcomes) === "number").toBe(true)
	})
});

// Set up a test suite, or collection of tests, to test one function against a variety of data.
describe("pickRandomRepeatedly returns an object containing keys that match an array's values.", () => {
	it('Returns an object with 2 keys for a provided with an array containing heads & tails.', () => {
		let objReturned = JSON.parse(pickRandomRepeatedly(possibleCoinFlipOutcomes, 10));

		// Yes, sort behaves weirdly depending on the data that it gets. 
		// But if you sort both sides of your comparison, they'll both be equally weird.
		let objKeysSorted = [...Object.keys(objReturned)].sort();
		let inputValsSorted = [...possibleCoinFlipOutcomes].sort();

		// We're comparing the keys from the server response to the values from the input data.
		// We don't care about the exact values for the keys from the server response object,
		// as they'll be different for every response,
		// but we do need to at least make sure every input is represented.
		// Statistically speaking, we should probably also make sure the server response object has
		// values greater than 0 for each key,
		// but that seems unecessary when we just wanna see how to test ExpressJS.
		// You can work on making the perfect test yourself, later.
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