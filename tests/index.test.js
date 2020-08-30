// Supertest is basically Postman for your tests.
const request = require('supertest');

// Import your app & its server. Yes, they're different.
var {server, app} = require('../server/index');
// The app is the bunch of code & routes.
// The server is the app running, ready to process requests & generate responses.

// Should probably store this in a "datasets.js" file or something.
// Or use a database reference. This app is simple, doesn't need epic setups.
let possibleCoinFlipOutcomes = ["heads", "tails"];
let possibleDiceRollOutcomes = [1, 2, 3, 4, 5, 6];

// Handle the done() callback and force the NodeJS process to close
// as it hangs open forever when you do server-related stuff in Jest
// "afterAll" is a magic built-in Jest function that will run when
// all tests & test suites have finished running.
afterAll(async (done) => {
	// Force our server reference to close:
	await server.close(); 

	// Dumb hack to trick Jest into waiting a bit more before 
	// it freaks out over processes hanging open. 
	// Potentially because server.close() does not complete instantly? Not sure.
	// This has been an issue for ExpressJS & Jest devs 
	//for several years & solutions are vague.
	await new Promise(resolve => setTimeout(() => resolve(), 500)); 

	// Resolve the done() callback? Again not sure, as solutions are vague.
	done();
})

// Sanity check test.
describe('Dummy root route exists.', () => {
	it("Server 'homepage' can be viewed just fine.", async (done) => {
		const res = await request(app).get('/');
		expect(res.statusCode).toEqual(200);
		done();
	});
});

// Test suite for the "localhost:3000/PickRandomFromData" route without URL params.
describe('Post for singular random output from provided arrays.', () => {
	it('Should return heads or tails when given [heads, tails]', async (done) => {
		// Build request with specified route, HTTP method, and body data:
		const res = await request(app)
			.post('/PickRandomFromData')
			.send({
				userSuppliedArray: possibleCoinFlipOutcomes
			});
		
		// Check the result of the request:
		expect(res.statusCode).toEqual(200);
		expect(possibleCoinFlipOutcomes.includes(res.body.chosenResult)).toEqual(true);
		
		// Pass a callback to the Jest global object to get us closer to triggering afterAll():
		done();
	});

	// Same as above.
	it('Should return a number between 1 & 6 when given an array of numbers 1 through 6.', async (done) => {
		const res = await request(app)
			.post('/PickRandomFromData')
			.send({
				userSuppliedArray: possibleDiceRollOutcomes
			});
		expect(res.statusCode).toEqual(200);
		expect(possibleDiceRollOutcomes.includes(res.body.chosenResult)).toEqual(true);
		done();
	})
});


// Test suite for the "localhost:3000/PickRandomFromData" route with URL params.
// eg. localhost:3000/PickRandomFromData/100
describe("Post for tally of outputs from repeated random picking from provided arrays.", () => {
	it('When given an array like [heads, tails], route returns an object like {heads: 10, tails: 10}.', async (done) => {
		const res = await request(app)
			.post('/PickRandomFromData/100')
			.send({
				userSuppliedArray: possibleCoinFlipOutcomes
			});
		expect(res.statusCode).toEqual(200);

		// Due to the nature of random, we can only really expect the key names to be the same
		// whenever the tests run.
		// We could theoretically be stricter and also make sure the values for each key
		// is greater than 0, as statistically that would be true...
		// But that seems unecessary here.
		expect(res.body.talliedResult).toEqual(expect.objectContaining({ heads: expect.any(Number), tails: expect.any(Number) }));

		done();
	});

	it('When given an array like [1,2,3,4,5,6], route returns an object like {1: 10, 2: 10, 3: 10, 4: 10, 5: 10, 6: 10}.', async (done) => {
		const res = await request(app)
			.post('/PickRandomFromData/100')
			.send({
				userSuppliedArray: possibleDiceRollOutcomes
			});
		expect(res.statusCode).toEqual(200);

		// Bit of a quirk when you have numbers as your possible outcomes...
		// The keys of an object - at least, when using JSON - must be strings.
		// So the keys are "1" and "2" and etc.
		expect(res.body.talliedResult).toEqual(
			expect.objectContaining(
				{
					"1": expect.any(Number),
					"2": expect.any(Number),
					"3": expect.any(Number),
					"4": expect.any(Number),
					"5": expect.any(Number),
					"6": expect.any(Number)
				}
			)
		);
		// We could totally code up a more-generic way to do this but
		// it seems like more effort than needed when the focus is on
		// testing in Express. 
		done();
	});

});