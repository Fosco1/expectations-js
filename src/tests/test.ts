import { when, expect, validate, isValid } from '../index';

const data = {
	username: 'test',
	password: 'tezfsdfst',
	telephone: '12345678900',
	acceptTerms: true,
	email: 'mail@test.com',
	age: 19,
	hasVectors: true,
	vectors: [
		{
			address: 'test',
			city: 'test',
			state: 'test'
		},
		{
			address: 'test',
			city: 'test',
			state: ' 2'
		},
		{
			address: '2434',
			city: 'test',
			state: 'asdasd'
		}
	],
	customField: [
		1, 2, 3, 4, 5
	],
	maybe: "3",
	/* required: 'test', */
};

const vectorExpectations = [
	expect('address').toBeString().ifNot('Address must be a string.'),
	expect('city').toBeString().ifNot('City must be a string.'),
	expect('state').toBeString().ifNot('State must be a string.'),
];

const expectations = [
	expect('username').toMatch(/^[a-z0-9_-]{3,16}$/).ifNot('%key.capitalize% must be between 3 and 16 characters long.'),
	expect('password').toMatch(/^[a-z0-9_-]{6,18}$/).ifNot('%key.capitalize% must be between 6 and 18 characters long.'),
	expect('telephone').toMatch(/^1[0-9]{10}$/).ifNot('Please enter a valid phone number.'),
	expect('acceptTerms').toBe(true).ifNot('You must accept the terms and conditions.'),
	expect('email').toMatch(/^[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)+$/).ifNot('Please enter a valid email address.'),
	expect('age').toBeGreaterThan(18).ifNot('You must be at least 18 years old.'),
	expect('vectors').toBeArray().ifNot('Please select at least one vector.'),
	when('hasVectors')/* .debug() */.is(true).expect('vectors').each().hasProperties(['address', 'city', 'state']).ifNot('Vector is invalid.'),
	expect('customField').toHaveLengthBetween(5, 15),
	expect('maybe').notRequired().toBeString().ifNot('%key.capitalize% must be a string.')/* .debug() */,
	expect('address').notRequired().toBeObject().and.toCustom((data) => {return}),
	when('vectors')/* .debug() */.each().satisfies(
		vectorExpectations
	).expect('maybe').is('2').ifNot('Maybe must be 2.'),
	expect('required')
];

const res = validate(expectations, data);
console.log(res);

const valid = isValid(res);

console.log(valid);