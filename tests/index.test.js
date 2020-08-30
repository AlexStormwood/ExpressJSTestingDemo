const request = require('supertest');
var {server, app} = require('../server/index');

let possibleCoinFlipOutcomes = ["heads", "tails"];
let possibleDiceRollOutcomes = [1, 2, 3, 4, 5, 6];

afterAll(async (done) => {
	await server.close();
	await new Promise(resolve => setTimeout(() => resolve(), 500));
	done();
})


describe('Dummy root route exists.', () => {


	it('should create a new post', async (done) => {
		const res = await request(app)
			.get('/');
		expect(res.statusCode).toEqual(200);
		done();
	});
	
});

describe('Post for singular random output from provided arrays.', () => {
	it('Should return heads or tails when given [heads, tails]', async (done) => {
		const res = await request(app)
			.post('/PickRandomFromData')
			.send({
				userSuppliedArray: possibleCoinFlipOutcomes
			});
		expect(res.statusCode).toEqual(200);
		expect(possibleCoinFlipOutcomes.includes(res.body.chosenResult)).toEqual(true);
		done();
	});

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

describe("Post for tally of outputs from repeated random picking from provided arrays.", () => {
	it('When given an array like [heads, tails], route returns an object like {heads: 10, tails: 10}.', async (done) => {
		const res = await request(app)
			.post('/PickRandomFromData/100')
			.send({
				userSuppliedArray: possibleCoinFlipOutcomes
			});
		expect(res.statusCode).toEqual(200);
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
		done();
	});

});