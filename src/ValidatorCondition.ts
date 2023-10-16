import Expectations, { ValidatorFunction } from "./Expectations";
import { Validatable } from "./Validatable";
import ValidatorExpectation from "./ValidatorExpectation";
import { ValidatorResult } from "./ValidatorResult";

export default class ValidatorCondition implements Validatable {
	expectations: Array<ValidatorExpectation>;
	debugMode: Boolean = false;

	constructor(key: string) {
		this.expectations = [new ValidatorExpectation(key)];
	}

	private logIfDebug(...args: any[]) {
		if(this.debugMode) {
			console.log(...args);
		}
	}

	expect(key: string) {
		this.expectations.push(new ValidatorExpectation(key));
		return this;
	}

	debug(): ValidatorCondition {
		this.debugMode = true;
		return this;
	}

	validate(data: any, res: ValidatorResult) {
		this.logIfDebug("Validating", this.expectations)
		/**
		 * Evaluates first expectation, if successful, evaluates second expectation
		 * If unsuccessful, that's okay, because the first expectation is optional
		 */

		const firstExpRes = Expectations.validate(this.expectations[0], data);
		if(Expectations.isValid(firstExpRes)) {
			this.logIfDebug("First is valid", firstExpRes)
			const secondExpRes = Expectations.validate(this.expectations[1], data);
			res[this.expectations[1].key] = secondExpRes[this.expectations[1].key];
			if(Expectations.isValid(secondExpRes)) {
				this.logIfDebug("Second is valid", secondExpRes)
				// If both are valid, we're done
				return;
			} else {
				this.logIfDebug("Second is NOT valid", secondExpRes)
			}
		} else {
			this.logIfDebug("First is NOT valid, but that's okay")
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

	hasMinimumLength(length: number): ValidatorCondition {
		this.lastExpectation.toHaveMinimumLength(length);
		return this;
	}

	hasMaximumLength(length: number): ValidatorCondition {
		this.lastExpectation.toHaveMaximumLength(length);
		return this;
	}

	hasLengthBetween(min: number, max: number): ValidatorCondition {
		this.lastExpectation.toHaveLengthBetween(min, max);
		return this;
	}

	isCustom(fn: ValidatorFunction): ValidatorCondition {
		this.lastExpectation.toCustom(fn);
		return this;
	}

	isObject(): ValidatorCondition {
		this.lastExpectation.toBeObject();
		return this;
	}

	notRequired(): ValidatorCondition {
		this.lastExpectation.notRequired();
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
		this.lastExpectation.not;
		return this;
	}

	and(): ValidatorCondition {
		return this;
	}
}