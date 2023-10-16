import Expectations from "./src/Expectations";
import { Validatable } from "./src/Validatable";

const expect = Expectations.expect;
const when = Expectations.when;

const data = {
	username: 'test',
	password: 'test',
	telephone: '12345678900',
	acceptTerms: false,
	email: '',
	age: 17,
	hasVectors: true,
	vectors: [
		{
			address: 'test',
			city: 'test',
			state: 'test'
		},
		{
			address: 'test',
			city: 'test'
		},
		{
			address: 'test',
			city: 'test',
			state: 'test'
		}
	],
	customField: [
		1, 2, 3, 4, 5
	],
	maybe: 2
};

const vectorExpectations = [
	expect('address').toBeString().ifNot('Address must be a string.'),
	expect('city').toBeString().ifNot('City must be a string.'),
	expect('state').toBeString().ifNot('State must be a string.'),
];

const expectations: Array<Validatable> = [
	expect('username').toMatch(/^[a-z0-9_-]{3,16}$/).ifNot('%key.capitalize% must be between 3 and 16 characters long.'),
	expect('password').toMatch(/^[a-z0-9_-]{6,18}$/).ifNot('%key.capitalize% must be between 6 and 18 characters long.'),
	expect('telephone').toMatch(/^1[0-9]{10}$/).ifNot('Please enter a valid phone number.'),
	expect('acceptTerms').toBe(true).ifNot('You must accept the terms and conditions.'),
	expect('email').toMatch(/^[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)+$/).ifNot('Please enter a valid email address.'),
	expect('age').toBeGreaterThan(18).ifNot('You must be at least 18 years old.'),
	expect('vectors').toBeArray().ifNot('Please select at least one vector.'),
	when('hasVectors').is(true).expect('vectors').each().hasProperties(['address', 'city', 'state']).ifNot('Vector is invalid.'),
	expect('customField').toHaveLengthBetween(10, 15),
	expect('maybe')/* .debug() */.notRequired().toBeString().ifNot('%key.capitalize% must be a string.'),
];

const res = Expectations.validate(expectations, data);

console.log(res);