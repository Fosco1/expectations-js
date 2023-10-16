import Expectations from "./Expectations";
import { Validatable } from "./Validatable";
import ValidatorExpectation from "./ValidatorExpectation";
import { ValidatorResult } from "./ValidatorResult";

export default class ValidatorCondition implements Validatable {
	expectations: Array<ValidatorExpectation>;
	constructor(key: string) {
		this.expectations = [new ValidatorExpectation(key)];
	}

	expect(key: string) {
		this.expectations.push(new ValidatorExpectation(key));
		return this;
	}

	debug(): ValidatorCondition {
		console.log(this.expectations);
		return this;
	}

	validate(data: any, res: ValidatorResult) {
		/**
		 * Cycle through each expectation, if the previous one is successful, proceed to the next one.
		 */
		res[this.expectations[0].key] = [];
		const thisRes = res[this.expectations[0].key];
		for (let i = 0; i < this.expectations.length; i++) {
			console.log('---validating condition---')
			const expectation = this.expectations[i];
			expectation.validate(data, thisRes);
			if (!Expectations.isValid(thisRes)) {
				console.log("failed at", i, "with", thisRes);
				break;
			}
		}
	}

	get lastExpectation() {
		return this.expectations[this.expectations.length - 1];
	}

	matches(regex: RegExp): ValidatorCondition {
		this.lastExpectation.toMatch(regex);
		return this;
	}

	isString(): ValidatorCondition {
		this.lastExpectation.toBeString();
		return this;
	}

	is(value: any): ValidatorCondition {
		this.lastExpectation.toBe(value);
		return this;
	}

	isGreaterThan(value: number): ValidatorCondition {
		this.lastExpectation.toBeGreaterThan(value);
		return this;
	}

	isLessThan(value: number): ValidatorCondition {
		this.lastExpectation.toBeLessThan(value);
		return this;
	}

	isArray(): ValidatorCondition {
		this.lastExpectation.toBeArray();
		return this;
	}

	isEmpty(): ValidatorCondition {
		this.lastExpectation.toBeEmpty();
		return this;
	}

	hasProperties(properties: Array<string>): ValidatorCondition {
		this.lastExpectation.toHaveProperties(properties);
		return this;
	}

	hasProperty(property: string): ValidatorCondition {
		this.lastExpectation.toHaveProperty(property);
		return this;
	}

	each(): ValidatorCondition {
		this.lastExpectation.each();
		return this;
	}

	ifNot(errorMessage: string): ValidatorCondition {
		this.lastExpectation.ifNot(errorMessage);
		return this;
	}

	not(): ValidatorCondition {
		this.lastExpectation.not();
		return this;
	}

	and(): ValidatorCondition {
		return this;
	}
}