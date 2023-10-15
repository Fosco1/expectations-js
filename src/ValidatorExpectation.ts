import Expectations, { ExpectationFunction } from "./Expectations";
import { ValidatorResult } from "./ValidatorResult";

export default class ValidatorExpectation {
	key: string;
	expectations: Array<ExpectationFunction>
	reverse: Boolean = false

	constructor(key: string) {
		this.key = key;
		this.expectations = [];
	}

	validate(data: any, res: ValidatorResult) {
		this.expectations.map((expectation) => {
			expectation(data, res);
		});
	}

	toBeString(): ValidatorExpectation {
		this.expectations.push((data: any, res: ValidatorResult, message: string = "Is not a string") => {
			if (typeof data[this.key] !== "string" && !this.reverse) {
				res[this.key] = message;
			}
		});
		return this;
	}

	isString(): ValidatorExpectation {
		this.toBeString();
		return this;
	}

	toMatch(regex: RegExp): ValidatorExpectation {
		this.expectations.push((data: any, res: ValidatorResult, message: string = "Doesn't match the regular expression") => {
			if (!regex.test(data[this.key]) && !this.reverse) {
				res[this.key] = message;
			}
		});
		return this;
	}

	matches(regex: RegExp): ValidatorExpectation {
		this.toMatch(regex);
		return this;
	}

	toBe(value: any): ValidatorExpectation {
		this.expectations.push((data: any, res: ValidatorResult, message: string = "Doesn't match the provided value") => {
			if (data[this.key] !== value && !this.reverse) {
				res[this.key] = message;
			}
		});
		return this;
	}

	toBeGreaterThan(value: number): ValidatorExpectation {
		this.expectations.push((data: any, res: ValidatorResult, message: string = "Is not greater than the provided value") => {
			if (data[this.key] <= value && !this.reverse) {
				res[this.key] = message;
			}
		});
		return this;
	}

	isGreaterThan(value: number): ValidatorExpectation {
		this.toBeGreaterThan(value);
		return this;
	}

	toBeLessThan(value: number): ValidatorExpectation {
		this.expectations.push((data: any, res: ValidatorResult, message: string = "Is not less than the provided value") => {
			if (data[this.key] >= value && !this.reverse) {
				res[this.key] = message;
			}
		});
		return this;
	}

	isLessThan(value: number): ValidatorExpectation {
		this.toBeLessThan(value);
		return this;
	}

	toBeArray(): ValidatorExpectation {
		this.expectations.push((data: any, res: ValidatorResult, message: string = "Is not an array") => {
			if (!Array.isArray(data[this.key]) && !this.reverse) {
				res[this.key] = message;
			}
		});
		return this;
	}

	isArray(): ValidatorExpectation {
		this.toBeArray();
		return this;
	}
	
	toBeEmpty(): ValidatorExpectation {
		this.expectations.push((data: any, res: ValidatorResult, message: string = "Is not empty") => {
			if (data[this.key].length > 0 && !this.reverse) {
				res[this.key] = message;
			}
		});
		return this;
	}

	isEmpty(): ValidatorExpectation {
		this.toBeEmpty();
		return this;
	}

	toHaveProperties(properties: Array<string>): ValidatorExpectation {
		this.expectations.push((data: any, res: ValidatorResult, message: string = "Does not have the required properties") => {
			properties.forEach((property) => {
				if (!data[this.key].hasOwnProperty(property) && !this.reverse) {
					res[this.key] = message;
				}
			});
		});
		return this;
	}

	hasProperties(properties: Array<string>): ValidatorExpectation {
		this.toHaveProperties(properties);
		return this;
	}

	toHaveProperty(property: string): ValidatorExpectation {
		this.expectations.push((data: any, res: ValidatorResult, message: string = "Does not have the required property") => {
			if (!data[this.key].hasOwnProperty(property) && !this.reverse) {
				res[this.key] = message;
			}
		});
		return this;
	}

	hasProperty(property: string): ValidatorExpectation {
		this.toHaveProperty(property);
		return this;
	}

	ifNot(errorMessage: string): ValidatorExpectation {
		const lastExpectation = this.expectations[this.expectations.length - 1];
		this.expectations[this.expectations.length - 1] = (data: any, res: ValidatorResult) => {
			lastExpectation(data, res, errorMessage);
		};
		return this;
	}

	not(): ValidatorExpectation {
		this.expectations.push((data: any, res: ValidatorResult, message: string = "") => {
			this.reverse = !this.reverse;
		});
		return this;
	}

	and(): ValidatorExpectation {
		return this;
	}
}