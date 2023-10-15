import { ExpectationFunction } from "./Expectations";
import { ValidatorResult } from "./ValidatorResult";

export default class ValidatorInterface {
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

	toBeString(): ValidatorInterface {
		this.expectations.push((data: any, res: ValidatorResult, message: string = "Is not a string") => {
			if (typeof data[this.key] !== "string" && !this.reverse) {
				res[this.key] = message;
			}
		});
		return this;
	}

	isString(): ValidatorInterface {
		this.toBeString();
		return this;
	}

	toMatch(regex: RegExp): ValidatorInterface {
		this.expectations.push((data: any, res: ValidatorResult, message: string = "Doesn't match the regular expression") => {
			if (!regex.test(data[this.key]) && !this.reverse) {
				res[this.key] = message;
			}
		});
		return this;
	}

	matches(regex: RegExp): ValidatorInterface {
		this.toMatch(regex);
		return this;
	}

	toBe(value: any): ValidatorInterface {
		this.expectations.push((data: any, res: ValidatorResult, message: string = "Doesn't match the provided value") => {
			if (data[this.key] !== value && !this.reverse) {
				res[this.key] = message;
			}
		});
		return this;
	}

	toBeGreaterThan(value: number): ValidatorInterface {
		this.expectations.push((data: any, res: ValidatorResult, message: string = "Is not greater than the provided value") => {
			if (data[this.key] <= value && !this.reverse) {
				res[this.key] = message;
			}
		});
		return this;
	}

	isGreaterThan(value: number): ValidatorInterface {
		this.toBeGreaterThan(value);
		return this;
	}

	toBeLessThan(value: number): ValidatorInterface {
		this.expectations.push((data: any, res: ValidatorResult, message: string = "Is not less than the provided value") => {
			if (data[this.key] >= value && !this.reverse) {
				res[this.key] = message;
			}
		});
		return this;
	}

	isLessThan(value: number): ValidatorInterface {
		this.toBeLessThan(value);
		return this;
	}

	toBeArray(): ValidatorInterface {
		this.expectations.push((data: any, res: ValidatorResult, message: string = "Is not an array") => {
			if (!Array.isArray(data[this.key]) && !this.reverse) {
				res[this.key] = message;
			}
		});
		return this;
	}

	isArray(): ValidatorInterface {
		this.toBeArray();
		return this;
	}
	
	toBeEmpty(): ValidatorInterface {
		this.expectations.push((data: any, res: ValidatorResult, message: string = "Is not empty") => {
			if (data[this.key].length > 0 && !this.reverse) {
				res[this.key] = message;
			}
		});
		return this;
	}

	isEmpty(): ValidatorInterface {
		this.toBeEmpty();
		return this;
	}

	toHaveProperties(properties: Array<string>): ValidatorInterface {
		this.expectations.push((data: any, res: ValidatorResult, message: string = "Does not have the required properties") => {
			properties.forEach((property) => {
				if (!data[this.key].hasOwnProperty(property) && !this.reverse) {
					res[this.key] = message;
				}
			});
		});
		return this;
	}

	hasProperties(properties: Array<string>): ValidatorInterface {
		this.toHaveProperties(properties);
		return this;
	}

	toHaveProperty(property: string): ValidatorInterface {
		this.expectations.push((data: any, res: ValidatorResult, message: string = "Does not have the required property") => {
			if (!data[this.key].hasOwnProperty(property) && !this.reverse) {
				res[this.key] = message;
			}
		});
		return this;
	}

	hasProperty(property: string): ValidatorInterface {
		this.toHaveProperty(property);
		return this;
	}

	ifNot(errorMessage: string): ValidatorInterface {
		const lastExpectation = this.expectations[this.expectations.length - 1];
		this.expectations[this.expectations.length - 1] = (data: any, res: ValidatorResult) => {
			lastExpectation(data, res, errorMessage);
		};
		return this;
	}

	not(): ValidatorInterface {
		this.expectations.push((data: any, res: ValidatorResult, message: string = "") => {
			this.reverse = !this.reverse;
		});
		return this;
	}

	and(): ValidatorInterface {
		return this;
	}
}